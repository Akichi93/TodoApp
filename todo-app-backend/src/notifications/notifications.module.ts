import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TasksModule } from '../tasks/tasks.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [TasksModule, PrismaModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

