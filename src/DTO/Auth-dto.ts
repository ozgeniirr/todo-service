import {
  IsInt,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';


export class AuthRegisterDTO {
    @IsNotEmpty()
    @IsEmail()
    email!:string;

    @IsNotEmpty()
    @MinLength(6)
    password!:string;


    @IsNotEmpty()
    firstName!:string;

    @IsNotEmpty()
    lastName!: string;

    @IsNotEmpty()
    @IsInt()
    age!:number;


}


export class AuthLoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email!:string;

    @IsNotEmpty()
    @MinLength(6)
    password!:string;


}