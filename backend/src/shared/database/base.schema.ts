import { Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class BaseDocument extends Document {
  @Prop({ type: Types.ObjectId, required: false, index: true })
  organizationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false })
  createdBy?: Types.ObjectId;
}
