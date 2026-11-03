import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MessageStatus } from '@prisma/client';
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
export class CreateMessageDto {
  @Transform(trim) @IsString() @Length(1, 100) name!: string;
  @Transform(trim) @IsEmail() @MaxLength(254) email!: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(200) subject?: string;
  @Transform(trim) @IsString() @Length(10, 5000) message!: string;
  @IsOptional() @IsString() @MaxLength(200) website?: string;
}
export class MessageQueryDto {
  @IsOptional() @IsEnum(MessageStatus) status?: MessageStatus;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
export class UpdateMessageDto {
  @IsEnum(MessageStatus) status!: MessageStatus;
}
