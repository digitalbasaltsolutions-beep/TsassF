import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class Order extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  declare organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Contact', required: true })
  customer: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Product' }])
  products: Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'], default: 'pending' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
