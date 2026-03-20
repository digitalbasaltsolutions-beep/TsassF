import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
import { TenantPlugin } from '../../../shared/database/tenant.plugin.js';

@Schema({ timestamps: true })
export class Stage extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'Pipeline', required: true })
  pipelineId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: '#3b82f6' }) // Default blue-500
  color: string;
}

export const StageSchema = SchemaFactory.createForClass(Stage);
StageSchema.plugin(TenantPlugin);
StageSchema.index({ pipelineId: 1, order: 1 });
