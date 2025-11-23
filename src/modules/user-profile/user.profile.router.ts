import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "../../shared/router.interface"
import { SERVICE_TYPES } from "../../service.types"
import authMiddleware from "../../middlewares/auth.middleware"
import { UserProfileController } from "./user.profile.controller"
import {
	ForgotPasswordDto,
	ResetPasswordDto,
	UpdateUserProfileDto
} from "./user.profile.dto"
import validationMiddleware from "@/middlewares/validation.middleware"

@injectable()
class UserProfileRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/user-profile"

	constructor(
		@inject(SERVICE_TYPES.UserProfileController)
		private readonly userProfileController: UserProfileController
	) {}
	setupRoutes(): void {
		this.router.get(
			"/",
			authMiddleware(),
			this.userProfileController.getUserProfile
		)
		this.router.put(
			"/",
			validationMiddleware(UpdateUserProfileDto, "body"),
			authMiddleware(),
			this.userProfileController.updateUserProfile
		)
		this.router.post(
			"/forgot-password",
			validationMiddleware(ForgotPasswordDto, "body"),
			this.userProfileController.forgotPassword
		)
		this.router.post(
			"/reset-password",
			validationMiddleware(ResetPasswordDto, "body"),
			this.userProfileController.resetPassword
		)
	}
}

export default UserProfileRouter
