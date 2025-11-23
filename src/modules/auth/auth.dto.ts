import { IsOptional, IsString, MinLength } from "class-validator"
import { IsNotEmpty } from "class-validator"
import { IsEmail } from "class-validator"

//!INTERFACES
export interface IUser {
	id?: string
	firstName?: string
	lastName?: string
	email: string
	password: string
	createdAt: Date
	updatedAt: Date
}

export interface ILogin extends Pick<IUser, "email" | "password"> {}
export interface IRegister extends Omit<IUser, "createdAt" | "updatedAt"> {}

export interface IVerifyEmail {
	email: string
	code: string
}

export interface IResendVerificationEmail {
	email: string
}

//! DTOs

export class LoginDto implements ILogin {
	@IsEmail()
	@IsNotEmpty()
	email!: string

	@IsString()
	@IsNotEmpty()
	password!: string
}

export class RegisterDto implements IRegister {
	@IsString()
	@IsOptional()
	firstName?: string

	@IsString()
	@IsOptional()
	lastName?: string

	@IsEmail()
	@IsNotEmpty()
	email!: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password!: string
}

export class VerifyEmailDto implements IVerifyEmail {
	@IsEmail()
	@IsNotEmpty()
	email!: string

	@IsString()
	@IsNotEmpty()
	code!: string
}

export class ResendVerificationEmailDto implements IResendVerificationEmail {
	@IsEmail()
	@IsNotEmpty()
	email!: string
}
