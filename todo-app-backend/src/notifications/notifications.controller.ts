import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendEmailDto } from './dto/send-email.dto';

import { NotificationEventDto } from './dto/notification-event.dto';

// Interface for request with user
interface RequestWithUser {
  user: {
    id: string;
  };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    const data = await this.notificationsService.getUserNotifications(userId);
    return { data };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() body: CreateNotificationDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    const created = await this.notificationsService.createNotification(userId, {
      title: body.title,
      body: body.body,
      meta: body.meta,
    });
    return { data: created };
  }

  @Post('send-email')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendEmail(@Body() body: SendEmailDto) {
    await this.notificationsService.sendEmail(
      body.email,
      body.subject,
      body.message,
    );
    return { data: { sent: true } };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    const result = await this.notificationsService.markAsRead(id, userId);
    return { data: result };
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    await this.notificationsService.markAllAsRead(userId);
    return { data: true };
  }

  @EventPattern('notification_created')
  async handleNotificationCreated(@Payload() data: NotificationEventDto) {
    Logger.log(
      `Received notification_created event for ${data.email}`,
      'NotificationsController',
    );
    await this.notificationsService.sendEmail(
      data.email,
      data.subject,
      data.text,
    );
  }
}
