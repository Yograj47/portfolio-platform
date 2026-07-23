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

    @IsDateString({ strict: true }, { message: "Start date must be a valid ISO 8601 date (YYYY-MM-DD)" })
    startDate!: string;

    @IsOptional()
    @IsDateString({ strict: true }, { message: "End date must be a valid ISO 8601 date (YYYY-MM-DD)" })
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    current?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    displayOrder?: number;
}