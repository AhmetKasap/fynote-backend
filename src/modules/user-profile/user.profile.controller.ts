import { inject, injectable } from "inversify"
import type { Response } from "express"
import { SERVICE_TYPES } from "@/service.types"
import { IUserId } from "@/dtos/base.user.dto"
import IUserRequest from "@/shared/user.request"
import ResponseBuilder from "@/shared/response.builder"
import UserProfileService from "./user.profile.service"
import {
	ForgotPasswordDto,
	ResetPasswordDto,
	UpdateUserProfileDto
} from "./user.profile.dto"

@injectable()
export class UserProfileController {
	constructor(
		@inject(SERVICE_TYPES.UserProfileService)
		private readonly userProfileService: UserProfileService
	) {}
	getUserProfile = async (
		req: IUserRequest<{}, {}, {}>,
		res: Response
	): Promise<Response> => {
		const userId = req.user?.id as unknown as IUserId
		const userProfile = await this.userProfileService.getUserProfile(userId)

		return ResponseBuilder.ok(
			res,
			userProfile,
			"User profile retrieved successfully"
		)
	}

	updateUserProfile = async (
		req: IUserRequest<{}, {}, UpdateUserProfileDto>,
		res: Response
	): Promise<Response> => {
		const userId = req.user?.id as unknown as IUserId
		const userProfile = await this.userProfileService.updateUserProfile(
			userId,
			req.body
		)
		return ResponseBuilder.ok(
			res,
			userProfile,
			"User profile updated successfully"
		)
	}

	forgotPassword = async (
		req: IUserRequest<{}, {}, ForgotPasswordDto>,
		res: Response
	): Promise<Response> => {
		const userProfile = await this.userProfileService.forgotPassword(
			req.body
		)
		return ResponseBuilder.ok(res, userProfile, "Password reset email sent")
	}

	resetPassword = async (
		req: IUserRequest<{}, {}, ResetPasswordDto>,
		res: Response
	): Promise<Response> => {
		const userProfile = await this.userProfileService.resetPassword(
			req.body
		)
		return ResponseBuilder.ok(
			res,
			userProfile,
			"Password reset successfully"
		)
	}
}
