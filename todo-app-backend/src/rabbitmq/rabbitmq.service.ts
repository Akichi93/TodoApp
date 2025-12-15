import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  // No-op placeholder: RabbitMQ integration has been removed.
  emit(_pattern: string, _payload: any) {
    this.logger.warn('emit() called but RabbitMQ integration is disabled');
    return Promise.resolve();
  }

  send(_pattern: string, _payload: any) {
    this.logger.warn('send() called but RabbitMQ integration is disabled');
    return Promise.resolve(null);
  }
}
