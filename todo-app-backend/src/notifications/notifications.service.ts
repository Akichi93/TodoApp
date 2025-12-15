import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private tasksService: TasksService,
    private prisma: PrismaService,
  ) {}

  async checkOverdueTasks(): Promise<void> {
    this.logger.log('Checking for overdue tasks...');

    const overdueTasks = await this.tasksService.findOverdueTasks();

    for (const task of overdueTasks) {
      try {
        // Envoyer directement la notification
        await this.sendNotification({
          taskId: task.id,
          taskTitle: task.title,
          dueDate: task.dueDate,
          userId: task.userId,
          user: task.user,
        });
      } catch (error) {
        this.logger.error(
          `Failed to send notification for overdue task ${task.id}`,
          error,
        );
      }
    }

    this.logger.log(`Found ${overdueTasks.length} overdue tasks`);
  }

  async sendNotification(taskData: any): Promise<void> {
    this.logger.log(
      `Sending notification for overdue task ${taskData.taskId} to user ${taskData.user.email}`,
    );

    // TODO: Implement email sending logic
    // For now, just log the notification
    this.logger.log(`Notification sent: Task "${taskData.taskTitle}" is overdue`);
  }
}

