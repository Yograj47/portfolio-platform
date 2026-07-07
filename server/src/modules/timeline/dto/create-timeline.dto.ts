import { TimelineType } from "@prisma/client";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateTimelineDto {
    @IsString()
    title!: string;

    @IsString()
    organization!: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(TimelineType)
    type!: TimelineType;

    @IsDateString()
    startDate!: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @IsOptional()
    @IsBoolean()
    current?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    displayOrder?: number;
}