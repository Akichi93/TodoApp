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
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Req() req: any) {
    const userId = req.user.id;
    const data = await this.notificationsService.getUserNotifications(userId);
    return { data };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() body: CreateNotificationDto, @Req() req: any) {
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
    return this.notificationsService.sendEmail(body.email, body.subject, body.message);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const result = await this.notificationsService.markAsRead(id, userId);
    return { data: result };
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: any) {
    const userId = req.user.id;
    await this.notificationsService.markAllAsRead(userId);
    return { data: true };
  }
}
