import {
  MaxLength,
  Length,
  ValidateIf,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  avatarMediaId?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  resumeMediaId?: string | null;
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Length(1, 100)
  name?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  summary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  isAvailable?: boolean;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  openToFullTime?: boolean;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  openToOpenSource?: boolean;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  openToFreelance?: boolean;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  githubUrl?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl({ protocols: ['https', 'http'], require_protocol: true })
  resumeUrl?: string;
}
