import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MediaType } from '@prisma/client';
export class CreateMediaDto {
  @IsString() @Length(1, 200) publicId!: string;
  @IsUrl({ protocols: ['https'], require_protocol: true }) url!: string;
  @IsString() @Length(1, 255) fileName!: string;
  @IsString() @Length(1, 100) mimeType!: string;
  @IsEnum(MediaType) type!: MediaType;
  @IsInt() @Min(1) @Max(10485760) size!: number;
  @IsOptional() @IsInt() @Min(1) @Max(20000) width?: number;
  @IsOptional() @IsInt() @Min(1) @Max(20000) height?: number;
  @IsOptional() @IsString() @MaxLength(500) alt?: string;
  @IsOptional() @IsString() @MaxLength(3000) description?: string;
}
