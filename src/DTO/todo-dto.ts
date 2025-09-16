import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";

export class CreateTodoDTO {
  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;

  @IsString()
  @Length(2, 200)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  title!: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true" || value === 1 || value === "1")
  completed?: boolean;
}

export class UpdateTodoDTO {
  @IsString()
  @Length(2, 200)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  title!: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === "true" || value === 1 || value === "1")
  completed?: boolean;
}

export class DeleteTodoDTO {
  @IsString()
  @Length(2, 200)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  title!: string;
}