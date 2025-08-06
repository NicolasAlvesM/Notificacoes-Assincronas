import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { EventsGateway } from 'src/events/events.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller()
export class RabbitMQController {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly eventsGateway: EventsGateway,
  ) {}
  @MessagePattern(process.env.FILA_ENTRADA)
  async processQueue(@Payload() data, @Ctx() context: RmqContext) {
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      this.notificationService.processNotification(data);

      channel.ack(originalMsg);
      return data;
    } catch (error) {
      console.log(`Erro ao processar a fila: ${error}`);
    }
  }

  @MessagePattern(process.env.FILA_STATUS)
  async notificationQueue(@Payload() data, @Ctx() context: RmqContext) {
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      this.eventsGateway.sendStatusUpdate({
        mensagemId: data.mensagemId,
        status: data.status,
      });
      channel.ack(originalMsg);
      return data;
    } catch (error) {
      console.log(`Erro ao notificar: ${error}`);
    }
  }
}
