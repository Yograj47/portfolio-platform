import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  Length,
  MaxLength,
  ValidateIf,
  Matches,
} from 'class-validator';
export class CreateSkillDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(1, 100)
  name!: string;
  @IsOptional() @IsString() @MaxLength(100) icon?: string;
  @IsOptional()
  @IsString()
  @Matches(/^(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})?$/)
  color?: string;
  @IsOptional() @IsString() @MaxLength(100) group?: string;
  @IsInt() @Min(0) @Max(100) level!: number;
  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
