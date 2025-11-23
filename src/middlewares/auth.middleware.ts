import { NextFunction, Response } from "express"
import { IJwtService } from "../services/jwt-service.interface"
import { IUser } from "../database/models/user.model"
import { container } from "../inversify.config"
import ApiError from "../shared/api.error"
import { SERVICE_TYPES } from "../service.types"
import IUserRequest from "../shared/user.request"

export default function authMiddleware() {
	const jwtService = container.get<IJwtService>(SERVICE_TYPES.IJwtService)

	return async (req: IUserRequest, _res: Response, next: NextFunction) => {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return next(new ApiError(400, "Token not found"))
		}
		const token = authHeader.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: authHeader

		const tokenIsValid = await jwtService.tokenVerify(token)
		if (!tokenIsValid["result"]) {
			return next(new ApiError(401, "Invalid token"))
		}

		req.user = tokenIsValid["result"] as IUser

		next()
	}
}
