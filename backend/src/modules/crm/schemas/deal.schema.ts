import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

export enum DealStatus {
  Open = 'Open',
  Won = 'Won',
  Lost = 'Lost',
}

@Schema({ timestamps: true })
export class Deal extends BaseDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 0 })
  value: number;

  @Prop({ type: String, enum: DealStatus, default: DealStatus.Open })
  status: DealStatus;

  @Prop({ default: 'Lead' })
  pipelineStage: string;

  @Prop({ type: Types.ObjectId, ref: 'Contact' })
  contactId: Types.ObjectId;
}

export const DealSchema = SchemaFactory.createForClass(Deal);
