import { ProjectStatus } from "@prisma/client";
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from "class-validator";

export class CreateProjectDto {
    @IsString()
    title!: string;

    @IsString()
    excerpt!: string;

    @IsString()
    description!: string;

    @IsOptional()
    @IsUrl()
    githubUrl?: string;

    @IsOptional()
    @IsUrl()
    liveUrl?: string;

    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsInt()
    @Min(0)
    displayOrder?: number;

    @IsString()
    categoryId!: string;
}