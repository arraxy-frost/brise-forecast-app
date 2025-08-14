import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 255)
    password: string;
}

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(8, 255)
    password: string;
}
