import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { randomUUID } from 'crypto';
import { StatusService } from 'src/status/status.service';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import { CreateRabbitmqDto } from 'src/rabbitmq/dto/create-rabbitmq.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly statusService: StatusService,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const id = randomUUID();
    const messageData = {
      id,
      conteudoMensagem: createNotificationDto.conteudoMensagem,
      status: 'PROCESSANDO',
    };

    this.rabbitmqService.create(messageData);
    this.statusService.setStatus(id, 'PROCESSANDO');

    return id;
  }

  async processNotification(data: CreateRabbitmqDto) {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000),
    );

    const falhou = Math.random() < 0.2;

    const statusFinal = falhou ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';
    const statusPayload = {
      ...data,
      status: statusFinal,
    };

    this.statusService.setStatus(data.id, statusFinal);

    this.rabbitmqService.notification(statusPayload);

    return statusPayload;
  }

  findAll() {
    return `This action returns all notifications`;
  }
}
