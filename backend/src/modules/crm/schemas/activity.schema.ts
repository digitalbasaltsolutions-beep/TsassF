import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
import { TenantPlugin } from '../../../shared/database/tenant.plugin.js';

export enum ActivityType {
  Call = 'Call',
  Meeting = 'Meeting',
  Email = 'Email',
  Task = 'Task',
}

export enum ActivityStatus {
  Pending = 'Pending',
  Done = 'Done',
}

@Schema({ timestamps: true })
export class Activity extends BaseDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: ActivityType, required: true })
  type: ActivityType;

  @Prop()
  description: string;

  @Prop({ type: String, enum: ActivityStatus, default: ActivityStatus.Pending })
  status: ActivityStatus;

  @Prop()
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Contact' })
  contactId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Deal' })
  dealId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.plugin(TenantPlugin);
ActivitySchema.index({ organizationId: 1, dueDate: 1 });
