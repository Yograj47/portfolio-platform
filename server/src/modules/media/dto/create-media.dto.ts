import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { MediaType } from '@prisma/client';

export class CreateMediaDto {
    @IsString()
    publicId!: string;

    @IsUrl()
    url!: string;

    @IsString()
    fileName!: string;

    @IsString()
    mimeType!: string;

    @IsEnum(MediaType)
    type!: MediaType;

    @IsInt()
    @Min(0)
    size!: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    width?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    height?: number;

    @IsOptional()
    @IsString()
    alt?: string;

    @IsOptional()
    @IsString()
    description?: string;
}