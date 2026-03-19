import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema';
import { Role } from '../../../shared/constants/roles.enum';

@Schema({ timestamps: true })
export class Membership extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  // We inherit organizationId from BaseDocument, but we want it required here
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  declare organizationId: Types.ObjectId;

  @Prop({ type: String, enum: Role, default: Role.Member })
  role: Role;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

// Compound index to ensure a user is only a member of an org once
MembershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });
