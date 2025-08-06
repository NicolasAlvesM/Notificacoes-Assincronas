import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateEventDto } from './dto/status-event.dto';

@WebSocketGateway(Number(process.env.WEBSOCKET_PORT) || 3001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribeToStatus')
  onSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() mensagemId: string,
  ) {
    client.join(mensagemId);
  }

  sendStatusUpdate(data: CreateEventDto) {
    this.server.to(data.mensagemId).emit('statusUpdate', data);
  }
}
