import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class Notification extends BaseDocument {
  // Overriding to make it required
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  declare organizationId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' })
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
