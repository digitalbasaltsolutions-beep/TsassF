import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class Organization extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: String, default: 'Free' })
  subscriptionPlan: string;

  @Prop({ type: [String], default: ['crm'] })
  subscriptions: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
