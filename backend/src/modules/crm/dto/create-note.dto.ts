import { IsString, IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  content: string;

  @IsEnum(['Contact', 'Deal'])
  linkedEntityType: 'Contact' | 'Deal';

  @IsMongoId()
  linkedEntityId: string;

  @IsMongoId()
  @IsOptional()
  ownerId?: string;
}
