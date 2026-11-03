import { Type } from 'class-transformer';
import {
  ValidateNested,
  ArrayUnique,
  MaxLength,
  Length,
  ValidateIf,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import {
  IsArray,
  ArrayMaxSize,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class ProjectSkillDto {
  @IsString() @Length(1, 100) skillId!: string;
  @IsOptional() @IsString() @MaxLength(500) usageNote?: string;
}
export class CreateProjectDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(50)
  @ArrayUnique((item: ProjectSkillDto | null) => item?.skillId)
  @ValidateNested({ each: true })
  @Type(() => ProjectSkillDto)
  skills?: ProjectSkillDto[];

  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @Length(1, 100, { each: true })
  technologies?: string[];

  @IsString()
  @Length(1, 200)
  @IsNotEmpty()
  title!: string;

  @IsString()
  @MaxLength(2000)
  @IsNotEmpty()
  excerpt!: string;

  @IsString()
  @MaxLength(100000)
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  githubUrl?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  liveUrl?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  featured?: boolean;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
