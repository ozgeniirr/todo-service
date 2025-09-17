import {
  IsInt,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformProperty } from '@/provider/transform.property';


export class AuthRegisterDTO {
    @IsNotEmpty()
	  @IsEmail()
	  @Transform((property) => transformProperty(property.value, property.key))
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