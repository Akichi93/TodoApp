import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TasksModule } from '../tasks/tasks.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsController } from './notifications.controller';

import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [forwardRef(() => TasksModule), PrismaModule, RabbitmqModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
