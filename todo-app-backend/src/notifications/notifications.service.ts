import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import nodemailer from 'nodemailer';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService,
    private prisma: PrismaService,
    private rabbitmqService: RabbitmqService,
  ) {}

  async checkOverdueTasks(): Promise<void> {
    this.logger.log('Checking for overdue tasks...');

    const overdueTasks = await this.tasksService.findOverdueTasks();

    for (const task of overdueTasks) {
      try {
        await this.sendNotification({
          taskId: task.id,
          taskTitle: task.title,
          dueDate: task.dueDate ?? new Date(),
          userId: task.userId,
          user: {
            email: task.user.email,
            firstName: task.user.firstName || undefined,
          },
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

  async sendNotification(taskData: {
    taskId: string;
    taskTitle: string;
    dueDate: Date | string;
    userId: string;
    user: { email: string; firstName?: string };
  }): Promise<void> {
    this.logger.log(
      `Sending notification for overdue task ${taskData.taskId} to user ${taskData.user.email}`,
    );

    const dueDateStr =
      taskData.dueDate instanceof Date
        ? taskData.dueDate.toISOString()
        : taskData.dueDate;

    // Create notification record in DB
    const notification = await this.prisma.notification.create({
      data: {
        userId: taskData.userId,
        title: `Task overdue: ${taskData.taskTitle}`,
        body: `Your task "${taskData.taskTitle}" was due on ${dueDateStr}.`,
        meta: {
          taskId: taskData.taskId,
          dueDate: taskData.dueDate,
        },
      },
    });

    this.logger.log(`Notification record created: ${notification.id}`);

    // Offload email sending to RabbitMQ
    await this.rabbitmqService.emit('notification_created', {
      notificationId: notification.id,
      email: taskData.user.email,
      subject: `Task overdue: ${taskData.taskTitle}`,
      text: `Hello ${taskData.user.firstName || ''},\n\nYour task "${taskData.taskTitle}" was due on ${dueDateStr}.\n\nPlease check your tasks.`,
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNotification(
    userId: string,
    data: { title: string; body: string; meta?: Record<string, any> },
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title: data.title,
        body: data.body,
        meta: data.meta ?? Prisma.JsonNull,
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.rabbitmqService.emit('notification_created', {
        notificationId: notification.id,
        email: user.email,
        subject: notification.title,
        text: notification.body,
      });
    }

    return notification;
  }

  async sendEmail(email: string, subject: string, text: string) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@example.com';

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      const transporter: nodemailer.Transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject,
        text,
      });
      return info;
    }

    this.logger.warn('SMTP not configured; cannot send email');
    return null;
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notif || notif.userId !== userId) return null;
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
