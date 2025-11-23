import { IUser, UserModel } from "@/database/models/user.model"
import { inject, injectable } from "inversify"
import { IUserId } from "@/dtos/base.user.dto"
import ApiError from "@/shared/api.error"
import {
	IForgotPassword,
	IResetPassword,
	UpdateUserProfileDto
} from "./user.profile.dto"
import { generateCode, generateExpirationDate } from "@/helpers/code.generator"
import { MailService } from "@/services/mail.service"
import { SERVICE_TYPES } from "@/service.types"
import { MailType } from "@/dtos/mail.dto"
import { IJwtService } from "@/services/jwt-service.interface"

@injectable()
class UserProfileService {
	constructor(
		@inject(SERVICE_TYPES.MailService)
		private readonly mailService: MailService,
		@inject(SERVICE_TYPES.IJwtService)
		private readonly jwtService: IJwtService
	) {}

	async getUserProfile(userId: IUserId): Promise<Omit<IUser, "password">> {
		const user = await UserModel.findOne({ _id: userId }).select(
			"-password"
		)
		if (!user) {
			throw ApiError.NotFound("Kullanıcı bulunamadı")
		}
		return user
	}

	async updateUserProfile(
		userId: IUserId,
		dto: UpdateUserProfileDto
	): Promise<Omit<IUser, "password">> {
		const user = await UserModel.findOne({ _id: userId })
		if (!user) {
			throw ApiError.NotFound("Kullanıcı bulunamadı")
		}
		user.firstName = dto.firstName
		user.lastName = dto.lastName
		user.updatedAt = new Date()
		await user.save()
		const populatedUser = await UserModel.findById(user._id).select(
			"-password"
		)
		if (!populatedUser) {
			throw ApiError.InternalServerError("Kullanıcı güncellenemedi")
		}
		return populatedUser
	}

	async forgotPassword(dto: IForgotPassword): Promise<boolean> {
		const user = await UserModel.findOne({
			email: dto.email
		})
		if (!user) {
			throw ApiError.Unauthorized("Invalid email")
		}
		const code = generateCode()
		const codeExpires = generateExpirationDate()
		user.passwordResetCode = code
		user.passwordResetExpires = codeExpires
		await user.save()

		await this.mailService.sendMail(
			user.email,
			code,
			MailType.PASSWORD_RESET
		)
		return true
	}

	async resetPassword(dto: IResetPassword): Promise<boolean> {
		const user = await UserModel.findOne({
			passwordResetCode: dto.code,
			email: dto.email
		})
		if (!user) {
			throw ApiError.Unauthorized("Invalid code or email")
		}
		if (
			user.passwordResetExpires &&
			user.passwordResetExpires < new Date()
		) {
			throw ApiError.BadRequest("Code expired")
		}
		user.password = this.jwtService.hashPassword(dto.password)
		user.passwordResetCode = undefined
		user.passwordResetExpires = undefined
		user.updatedAt = new Date()
		await user.save()
		return true
	}
}
export default UserProfileService
