import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private notificationsService: NotificationsService) {}

  onModuleInit() {
    this.logger.log('Scheduler service initialized');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleOverdueTasksCheck() {
    this.logger.log('Running overdue tasks check...');
    await this.notificationsService.checkOverdueTasks();
  }
}
