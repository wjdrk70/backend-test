import {IsEmail, IsNotEmpty, Matches, MaxLength, MinLength, ValidateIf} from "class-validator";


export class CreateUserDto {


    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;

    @ValidateIf(() => false)
    password: string;

}




