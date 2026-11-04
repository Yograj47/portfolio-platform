import {
  IsByteLength,
  MaxLength,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(8)
  @IsByteLength(8, 72)
  password!: string;
}
