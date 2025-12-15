import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_CLIENT } from './rabbitmq.constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  // No-op placeholder: RabbitMQ integration has been removed.
  async emit(pattern: string, payload: any) {
    this.logger.log(`Emitting message to ${pattern}`);
    // Use lastValueFrom to ensure the Observable is subscribed to and executed
    return lastValueFrom(this.client.emit(pattern, payload));
  }

  async send(pattern: string, payload: any) {
    this.logger.log(`Sending message to ${pattern}`);
    return lastValueFrom(this.client.send(pattern, payload));
  }
}
