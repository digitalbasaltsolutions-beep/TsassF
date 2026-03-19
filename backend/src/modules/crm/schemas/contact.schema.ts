import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class Contact extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  company: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
