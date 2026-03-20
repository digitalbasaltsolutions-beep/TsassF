import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../../shared/database/base.schema.js';
import { TenantPlugin } from '../../../shared/database/tenant.plugin.js';

@Schema({ timestamps: true })
export class Pipeline extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PipelineSchema = SchemaFactory.createForClass(Pipeline);
PipelineSchema.plugin(TenantPlugin);
