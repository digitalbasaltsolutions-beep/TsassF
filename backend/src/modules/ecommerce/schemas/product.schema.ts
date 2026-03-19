import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class Product extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  declare organizationId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
