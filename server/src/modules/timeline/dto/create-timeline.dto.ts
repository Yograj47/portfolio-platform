import { TimelineType } from '@prisma/client';
import {
  Length,
  MaxLength,
  ValidateIf,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateTimelineDto {
  @IsOptional() @IsString() credentialId?: string;
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  credentialUrl?: string;
  @IsOptional() @IsDateString() expiresAt?: string;

  @IsString()
  @Length(1, 200)
  title!: string;

  @IsString()
  @Length(1, 200)
  organization!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsEnum(TimelineType)
  type!: TimelineType;

  @IsDateString(
    { strict: true },
    { message: 'Start date must be a valid ISO 8601 date (YYYY-MM-DD)' },
  )
  startDate!: string;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'End date must be a valid ISO 8601 date (YYYY-MM-DD)' },
  )
  endDate?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  current?: boolean;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
