import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "../../shared/router.interface"
import { SERVICE_TYPES } from "../../service.types"
import validationMiddleware from "../../middlewares/validation.middleware"
import {
	LoginDto,
	RegisterDto,
	ResendVerificationEmailDto,
	VerifyEmailDto
} from "./auth.dto"
import authMiddleware from "../../middlewares/auth.middleware"
import { AuthController } from "./auth.controller"

@injectable()
class AuthRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/auth"

	constructor(
		@inject(SERVICE_TYPES.AuthController)
		private readonly authController: AuthController
	) {}
	setupRoutes(): void {
		this.router.post(
			"/register",
			validationMiddleware(RegisterDto, "body"),
			this.authController.register
		)

		this.router.post(
			"/login",
			validationMiddleware(LoginDto, "body"),
			this.authController.login
		)

		this.router.post(
			"/verify-email",
			validationMiddleware(VerifyEmailDto, "body"),
			this.authController.verifyEmail
		)

		this.router.post(
			"/resend-verification-email",
			validationMiddleware(ResendVerificationEmailDto, "body"),
			this.authController.resendVerificationEmail
		)

		// Test endpoint
		this.router.get("/test", authMiddleware(), this.authController.authTest)
	}
}

export default AuthRouter
