import {IsEmail, IsString, IsStrongPassword, Matches, MaxLength, MinLength} from "class-validator";
import {Transform} from "class-transformer";
import {BadRequestException} from "@nestjs/common";
import {NotIn} from "../../not-in";
export class CreateUserDto{
    @Transform(params => params.value.trim())
    @NotIn('password',{ message :'password 는 뭐 안된단다'})
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    readonly name : string;

    @IsString()
    @MaxLength(60)
    @IsEmail()
    readonly email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    readonly password: string;

}