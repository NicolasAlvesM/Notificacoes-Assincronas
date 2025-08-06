import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateEventDto } from './dto/status-event.dto';

@WebSocketGateway(Number(process.env.WEBSOCKET_PORT) || 3001, {
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
