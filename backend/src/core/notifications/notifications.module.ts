import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { Notification, NotificationSchema } from './schemas/notification.schema.js';
import { BullModule } from '@nestjs/bullmq';
import { WhatsAppService } from './whatsapp.service.js';
import { NotificationsProcessor } from './notifications.processor.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, WhatsAppService, NotificationsProcessor],
  exports: [NotificationsService, WhatsAppService, BullModule],
})
export class NotificationsModule {}
