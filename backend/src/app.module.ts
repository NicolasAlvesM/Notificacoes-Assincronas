import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { StatusService } from './status/status.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [NotificationsModule, RabbitmqModule, EventsModule],
  providers: [StatusService],
})
export class AppModule {}
