import { IsString, IsEmail, IsOptional, MinLength, IsUrl } from "class-validator";

export class CreateUserDto {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;
}
