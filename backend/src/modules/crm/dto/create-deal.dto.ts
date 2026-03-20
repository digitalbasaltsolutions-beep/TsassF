import { IsString, IsNumber, IsEnum, IsMongoId, IsOptional, IsDateString } from 'class-validator';
import { DealStatus } from '../schemas/deal.schema.js';

export class CreateDealDto {
  @IsString()
  title: string;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @IsMongoId()
  pipelineId: string;

  @IsMongoId()
  stageId: string;

  @IsMongoId()
  @IsOptional()
  contactId?: string;

  @IsMongoId()
  @IsOptional()
  ownerId?: string;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;
}
