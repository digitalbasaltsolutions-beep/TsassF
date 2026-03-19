import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

export enum PlanType {
  Free = 'Free',
  Pro = 'Pro',
  Enterprise = 'Enterprise',
}

@Schema({ timestamps: true })
export class Subscription extends BaseDocument {
  // Overriding to make it required
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true, unique: true })
  declare organizationId: Types.ObjectId;

  @Prop({ type: String, enum: PlanType, default: PlanType.Free })
  plan: PlanType;

  @Prop({ type: String, default: 'active' }) // active, past_due, canceled
  status: string;

  @Prop({ type: String })
  stripeCustomerId?: string;

  @Prop({ type: String })
  stripeSubscriptionId?: string;

  @Prop({ type: Number, default: 0 })
  apiCallsUsage: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
