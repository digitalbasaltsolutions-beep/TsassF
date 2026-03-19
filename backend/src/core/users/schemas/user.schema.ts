import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';

@Schema({ timestamps: true })
export class User extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
