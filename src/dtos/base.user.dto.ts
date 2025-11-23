import { IsString } from "class-validator"
import { IsNotEmpty } from "class-validator"

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

export interface IUserId extends Pick<IUser, "id"> {}

//! DTOs
export class UserIdDto implements IUserId {
	@IsString()
	@IsNotEmpty()
	id!: string
}
