import { inject, injectable } from "inversify"
import { IUser, type IRegister } from "./auth.dto"
import { type ILogin } from "./auth.dto"
import { UserModel } from "../../database/models/user.model"
import ApiError from "../../shared/api.error"
import { SERVICE_TYPES } from "../../service.types"
import { IJwtService } from "../../services/jwt-service.interface"
import { IConfig } from "../../config"
import { MailService } from "@/services/mail.service"
import { MailType } from "@/dtos/mail.dto"
import { generateCode, generateExpirationDate } from "@/helpers/code.generator"

@injectable()
export class AuthService {
	constructor(
		@inject(SERVICE_TYPES.IJwtService)
		private readonly jwtService: IJwtService,
		@inject(SERVICE_TYPES.IConfig)
		private readonly config: IConfig,
		@inject(SERVICE_TYPES.MailService)
		private readonly mailService: MailService
	) {}
	async login(
		login: ILogin
	): Promise<Omit<IUser, "password"> & { token: string }> {
		const userPassword = this.jwtService.hashPassword(login.password)
		const user = await UserModel.findOne({
			email: login.email,
			password: userPassword
		})
		if (!user) {
			throw ApiError.NotFound("User email or password is incorrect")
		}

		if (!user.isEmailActivated) {
			throw ApiError.Unauthorized("Please verify your email first")
		}

		const jwtPayload = {
			id: user.id.toString(),
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName
		}

		const token = await this.jwtService.jwtGenerate(
			jwtPayload,
			this.config.JWT_TOKEN_EXPIRATION
		)
		return {
			id: user.id.toString(),
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			token: token
		}
	}

	async register(dto: IRegister): Promise<boolean> {
		const userIsExists = await UserModel.findOne({ email: dto.email })
		if (userIsExists) {
			throw ApiError.BadRequest("User already exists")
		}
		const userPassword = this.jwtService.hashPassword(dto.password)

		const emailActivationCode = generateCode()
		const emailActivationExpires = generateExpirationDate()

		const user = await UserModel.create({
			...dto,
			password: userPassword,
			emailActivationCode: emailActivationCode,
			emailActivationExpires: emailActivationExpires,
			isEmailActivated: false
		})

		await this.mailService.sendMail(
			user.email,
			emailActivationCode,
			MailType.VERIFICATION
		)

		return true
	}

	async verifyEmail(email: string, code: string): Promise<boolean> {
		const user = await UserModel.findOne({
			email: email,
			emailActivationCode: code,
			emailActivationExpires: { $gt: new Date() }
		})
		if (!user) {
			throw ApiError.NotFound("User not found or code is incorrect")
		}
		user.isEmailActivated = true
		user.emailActivationCode = undefined
		user.emailActivationExpires = undefined
		await user.save()
		return true
	}

	async resendVerificationEmail(email: string): Promise<boolean> {
		const user = await UserModel.findOne({
			email: email,
			isEmailActivated: false
		})
		if (!user) {
			throw ApiError.NotFound(
				"User not found or email is already verified"
			)
		}
		const emailActivationCode = generateCode()
		const emailActivationExpires = generateExpirationDate()
		user.emailActivationCode = emailActivationCode
		user.emailActivationExpires = emailActivationExpires
		await user.save()
		await this.mailService.sendMail(
			user.email,
			emailActivationCode,
			MailType.VERIFICATION
		)
		return true
	}

	async authTest(): Promise<any> {
		return {
			success: true,
			message: "Auth test successful"
		}
	}
}
