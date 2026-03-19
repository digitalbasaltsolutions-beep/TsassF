import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

export enum ActivityType {
  Call = 'Call',
  Meeting = 'Meeting',
  Note = 'Note',
  Email = 'Email',
}

@Schema({ timestamps: true })
export class Activity extends BaseDocument {
  @Prop({ type: String, enum: ActivityType, required: true })
  type: ActivityType;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Contact' })
  contactId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Deal' })
  dealId?: Types.ObjectId;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
