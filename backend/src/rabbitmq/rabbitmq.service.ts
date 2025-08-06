import { Inject, Injectable } from '@nestjs/common';
import { CreateRabbitmqDto } from './dto/create-rabbitmq.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  create(createRabbitmqDto: CreateRabbitmqDto) {
    try {
      this.client
        .emit('fila.notificacao.entrada.nicolas', createRabbitmqDto)
        .subscribe();

      return 'Mensagem publicada com sucesso';
    } catch (error) {
      console.error('Erro ao publicar mensagem:', error);
      throw error;
    }
  }

  notification(createRabbitmqDto: CreateRabbitmqDto) {
    try {
      this.client
        .emit('fila.notificacao.status.nicolas', createRabbitmqDto)
        .subscribe();

      return 'Mensagem publicada com sucesso';
    } catch (error) {
      console.error('Erro ao publicar mensagem:', error);
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} rabbitmq`;
  }
}
