import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreatePipelineDto {
  @IsString()
  name: string;
}

export class CreateStageDto {
  @IsMongoId()
  pipelineId: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  color?: string;
}
