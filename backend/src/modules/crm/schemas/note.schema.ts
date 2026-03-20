import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
import { TenantPlugin } from '../../../shared/database/tenant.plugin.js';

@Schema({ timestamps: true })
export class Note extends BaseDocument {
  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: ['Contact', 'Deal'], required: true })
  linkedEntityType: 'Contact' | 'Deal';

  @Prop({ type: Types.ObjectId, required: true })
  linkedEntityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.plugin(TenantPlugin);
NoteSchema.index({ organizationId: 1, linkedEntityId: 1 });
