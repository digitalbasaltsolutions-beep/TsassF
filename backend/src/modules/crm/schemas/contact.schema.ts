import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
import { TenantPlugin } from '../../../shared/database/tenant.plugin.js';

@Schema({ timestamps: true })
export class Contact extends BaseDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  company: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.plugin(TenantPlugin);
ContactSchema.index({ organizationId: 1, deletedAt: 1 });
ContactSchema.index({ ownerId: 1, organizationId: 1, deletedAt: 1 });
ContactSchema.index({ email: 1, organizationId: 1, deletedAt: 1 }, { unique: true });
