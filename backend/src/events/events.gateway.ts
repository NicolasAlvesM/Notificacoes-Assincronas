import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateEventDto } from './dto/status-event.dto';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  sendStatusUpdate(data: CreateEventDto) {
    this.server.emit('statusUpdate', data);
  }
}
