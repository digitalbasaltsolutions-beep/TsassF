import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async createNotification(organizationId: string, title: string, message: string, type: string = 'info') {
    return this.notificationModel.create({
      organizationId: new Types.ObjectId(organizationId),
      title,
      message,
      type
    });
  }

  async getMyNotifications(organizationId: string) {
    return this.notificationModel.find({ organizationId: new Types.ObjectId(organizationId) }).sort({ createdAt: -1 }).limit(20).exec();
  }

  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
  }

  async clearAll(organizationId: string) {
    return this.notificationModel.updateMany({ organizationId: new Types.ObjectId(organizationId) }, { isRead: true }).exec();
  }
}
