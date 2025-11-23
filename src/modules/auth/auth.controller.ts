import { injectable, inject } from "inversify"
import type { Request, Response } from "express"
import { type IRegister } from "./auth.dto"
import { SERVICE_TYPES } from "../../service.types"
import ResponseBuilder from "../../shared/response.builder"
import IUserRequest from "@/shared/user.request"
import { AuthService } from "./auth.service"

@injectable()
export class AuthController {
	constructor(
		@inject(SERVICE_TYPES.AuthService)
		private readonly authService: AuthService
	) {}

	register = async (req: Request, res: Response): Promise<Response> => {
		const registerDto = req.body as IRegister
		const user = await this.authService.register(registerDto)
		return ResponseBuilder.created(
			res,
			user,
			"Registration successful, please check your email for activation"
		)
	}

	login = async (req: Request, res: Response): Promise<Response> => {
		const { email, password } = req.body
		const user = await this.authService.login({ email, password })
		return ResponseBuilder.created(res, user, "User logged in successfully")
	}

	verifyEmail = async (req: Request, res: Response): Promise<Response> => {
		const { email, code } = req.body
		const user = await this.authService.verifyEmail(email, code)
		return ResponseBuilder.ok(res, user, "Email verified successfully")
	}

	resendVerificationEmail = async (
		req: Request,
		res: Response
	): Promise<Response> => {
		const { email } = req.body
		const user = await this.authService.resendVerificationEmail(email)
		return ResponseBuilder.ok(
			res,
			user,
			"Verification email sent successfully"
		)
	}

	authTest = async (
		_req: IUserRequest<{}, {}, {}>,
		res: Response
	): Promise<Response> => {
		const user = await this.authService.authTest()
		return ResponseBuilder.ok(res, user, "Auth test successful")
	}
}
