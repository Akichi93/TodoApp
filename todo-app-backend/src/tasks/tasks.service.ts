import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { PaginationUtil, PaginationResult } from '../common/utils/pagination.util';
import { CACHE_KEYS, CACHE_TTL } from '../common/constants';
import { RedisService } from '../redis/redis.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: createTaskDto.dueDate
          ? new Date(createTaskDto.dueDate)
          : null,
        userId,
      },
    });

    await this.invalidateUserTasksCache(userId);

    return task;
  }

  async findAll(
    userId: string,
    query: TaskQueryDto,
  ): Promise<PaginationResult<any>> {
    const { page, limit } = PaginationUtil.normalize({
      page: query.page,
      limit: query.limit,
    });

    const cacheKey = this.getTasksListCacheKey(userId, query);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const where = this.buildWhereClause(userId, query);
    const skip = PaginationUtil.getSkip({ page, limit });

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    const result = PaginationUtil.create(tasks, total, { page, limit });
    await this.redis.set(cacheKey, JSON.stringify(result), CACHE_TTL.TASKS_LIST);

    return result;
  }

  async findOne(id: string, userId: string) {
    const cacheKey = `${CACHE_KEYS.TASK_PREFIX}${id}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      const task = JSON.parse(cached);
      if (task.userId === userId) {
        return task;
      }
      throw new ForbiddenException('Access denied');
    }

    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.redis.set(cacheKey, JSON.stringify(task), CACHE_TTL.TASK);

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id, userId);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
    });

    await this.invalidateTaskCache(id);
    await this.invalidateUserTasksCache(userId);

    return updatedTask;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.task.delete({
      where: { id },
    });

    await this.invalidateTaskCache(id);
    await this.invalidateUserTasksCache(userId);
  }

  async findOverdueTasks(): Promise<any[]> {
    const now = new Date();

    return this.prisma.task.findMany({
      where: {
        completed: false,
        dueDate: {
          lt: now,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  private buildWhereClause(userId: string, query: TaskQueryDto): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {
      userId,
    };

    if (query.completed !== undefined) {
      where.completed = query.completed;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.dueDateFrom || query.dueDateTo) {
      where.dueDate = {};
      if (query.dueDateFrom) {
        where.dueDate.gte = new Date(query.dueDateFrom);
      }
      if (query.dueDateTo) {
        where.dueDate.lte = new Date(query.dueDateTo);
      }
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private getTasksListCacheKey(userId: string, query: TaskQueryDto): string {
    const queryString = JSON.stringify(query);
    return `${CACHE_KEYS.TASKS_LIST_PREFIX}${userId}:${queryString}`;
  }

  private async invalidateTaskCache(taskId: string): Promise<void> {
    await this.redis.del(`${CACHE_KEYS.TASK_PREFIX}${taskId}`);
  }

  private async invalidateUserTasksCache(userId: string): Promise<void> {
    const pattern = `${CACHE_KEYS.TASKS_LIST_PREFIX}${userId}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

