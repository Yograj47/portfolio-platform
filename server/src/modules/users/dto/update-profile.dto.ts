import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    IsUrl,
} from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsOptional()
    @IsBoolean()
    openToFullTime?: boolean;

    @IsOptional()
    @IsBoolean()
    openToOpenSource?: boolean;

    @IsOptional()
    @IsBoolean()
    openToFreelance?: boolean;

    @IsOptional()
    @IsUrl()
    githubUrl?: string;

    @IsOptional()
    @IsUrl()
    linkedinUrl?: string;

    @IsOptional()
    @IsUrl()
    resumeUrl?: string;
}