import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;
  let redis: RedisService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const userId = 'user-id';
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
      };

      const expectedTask = {
        id: 'task-id',
        ...createTaskDto,
        userId,
        completed: false,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.task.create.mockResolvedValue(expectedTask);
      mockRedisService.keys.mockResolvedValue([]);

      const result = await service.create(userId, createTaskDto);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: createTaskDto.title,
          userId,
        }),
      });
    });
  });

  describe('findOne', () => {
    it('should return a task if found and user owns it', async () => {
      const taskId = 'task-id';
      const userId = 'user-id';

      const task = {
        id: taskId,
        title: 'Test Task',
        userId,
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockRedisService.set.mockResolvedValue(undefined);

      const result = await service.findOne(taskId, userId);

      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = 'task-id';
      const userId = 'user-id';

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own task', async () => {
      const taskId = 'task-id';
      const userId = 'user-id';
      const otherUserId = 'other-user-id';

      const task = {
        id: taskId,
        title: 'Test Task',
        userId: otherUserId,
      };

      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.task.findUnique.mockResolvedValue(task);

      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});

