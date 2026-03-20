import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
import { TenantPlugin } from '../../../shared/database/tenant.plugin.js';

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

  @Prop({ type: Types.ObjectId, ref: 'Pipeline', required: true })
  pipelineId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Stage', required: true })
  stageId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Contact' })
  contactId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;

  @Prop()
  expectedCloseDate: Date;

  @Prop()
  deletedAt?: Date;
}

export const DealSchema = SchemaFactory.createForClass(Deal);
DealSchema.plugin(TenantPlugin);
DealSchema.index({ organizationId: 1, pipelineId: 1, deletedAt: 1 });
DealSchema.index({ organizationId: 1, stageId: 1, deletedAt: 1 });
