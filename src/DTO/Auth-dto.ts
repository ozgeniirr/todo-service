import {
  IsInt,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Length
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
    @Transform(({ value }) => transformProperty(value))
	  @Transform(({ value }) => value.trim())
    @Length(1, 256)
    firstName!:string;

    @IsNotEmpty()
    @Transform(({ value }) => transformProperty(value))
	  @Transform(({ value }) => value.trim())
    @Length(1, 256)
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