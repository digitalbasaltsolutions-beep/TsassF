import { IsString, IsEnum, IsOptional, IsMongoId, IsDateString } from 'class-validator';
import { ActivityType, ActivityStatus } from '../schemas/activity.schema.js';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ActivityStatus)
  @IsOptional()
  status?: ActivityStatus;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsMongoId()
  @IsOptional()
  contactId?: string;

  @IsMongoId()
  @IsOptional()
  dealId?: string;

  @IsMongoId()
  @IsOptional()
  ownerId?: string;
}
