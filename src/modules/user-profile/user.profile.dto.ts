import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export interface IUserProfile {
	id?: string
	firstName?: string
	lastName?: string
	email: string
}

export interface IUpdateUserProfile
	extends Pick<IUserProfile, "firstName" | "lastName"> {}

export class UpdateUserProfileDto implements IUpdateUserProfile {
	@IsString()
	@IsNotEmpty()
	firstName!: string
	@IsString()
	@IsNotEmpty()
	lastName!: string
}

export interface IForgotPassword {
	email: string
}

export class ForgotPasswordDto implements IForgotPassword {
	@IsEmail()
	@IsNotEmpty()
	email!: string
}

export interface IResetPassword {
	email: string
	code: string
	password: string
}

export class ResetPasswordDto implements IResetPassword {
	@IsEmail()
	@IsNotEmpty()
	email!: string
	@IsString()
	@IsNotEmpty()
	code!: string
	@IsString()
	@IsNotEmpty()
	password!: string
}
