import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

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
    // Create notification record in DB
    const notification = await this.prisma.notification.create({
      data: {
        userId: taskData.userId,
        title: `Task overdue: ${taskData.taskTitle}`,
        body: `Your task "${taskData.taskTitle}" was due on ${taskData.dueDate}.`,
        meta: {
          taskId: taskData.taskId,
          dueDate: taskData.dueDate,
        },
      },
    });

    this.logger.log(`Notification record created: ${notification.id}`);

    // Send email if SMTP configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@example.com';

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const to = taskData.user.email;
        const subject = `Task overdue: ${taskData.taskTitle}`;
        const text = `Hello ${taskData.user.firstName || ''},\n\nYour task \"${taskData.taskTitle}\" was due on ${taskData.dueDate}.\n\nPlease check your tasks.`;

        await transporter.sendMail({
          from: emailFrom,
          to,
          subject,
          text,
        });

        this.logger.log(`Email sent to ${to} for notification ${notification.id}`);
      } catch (err) {
        this.logger.warn('Failed to send email notification', err);
      }
    } else {
      this.logger.warn('SMTP not configured; skipping email sending');
    }
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }


  async createNotification(userId: string, data: { title: string; body: string; meta?: any }) {
    const notification = await this.prisma.notification.create({
      data: { userId, title: data.title, body: data.body, meta: data.meta },
    });

    // Optionally send email
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      try {
        await this.sendEmail(user.email, notification.title, notification.body);
      } catch (err) {
        this.logger.warn('Failed to send email for created notification', err);
      }
    }

    return notification;
  }

  async sendEmail(email: string, subject: string, text: string) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || 'no-reply@example.com';

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      return transporter.sendMail({ from: emailFrom, to: email, subject, text });
    }

    this.logger.warn('SMTP not configured; cannot send email');
    return null;
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif || notif.userId !== userId) return null;
    return this.prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  }
}

