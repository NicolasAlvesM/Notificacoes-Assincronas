import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [RabbitmqModule, StatusModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
