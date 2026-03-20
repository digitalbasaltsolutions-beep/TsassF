import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class AnalyticsEvent extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'Organization', index: true })
  declare organizationId: Types.ObjectId;

  @Prop({ required: true, index: true })
  type: string; // CONTACT_CREATED, DEAL_CREATED, LIMIT_HIT, etc.

  @Prop({ type: Object })
  metadata: any;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);
