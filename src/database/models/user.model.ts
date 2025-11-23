import { model, Schema } from "mongoose"

export interface IUser {
	id: string
	firstName?: string
	lastName?: string
	email: string
	password: string

	isEmailActivated: boolean
	emailActivationCode?: string
	emailActivationExpires?: Date

	passwordResetCode?: string
	passwordResetExpires?: Date

	createdAt: Date
	updatedAt: Date
}

const userSchema = new Schema<IUser>({
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isEmailActivated: { type: Boolean, default: false },
	emailActivationCode: { type: String, required: false },
	emailActivationExpires: { type: Date, required: false },
	passwordResetCode: { type: String, required: false },
	passwordResetExpires: { type: Date, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
})

export const UserModel = model<IUser>("User", userSchema)
