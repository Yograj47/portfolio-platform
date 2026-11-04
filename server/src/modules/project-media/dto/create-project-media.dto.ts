import { ValidateIf, IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class CreateProjectMediaDto {
  @IsString()
  projectId!: string;

  @IsString()
  mediaId!: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  isCover?: boolean;
}
