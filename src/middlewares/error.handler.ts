import ApiError from "../shared/api.error"
import { type NextFunction, type Request, type Response } from "express"

const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof ApiError) {
		if (err.validationErrors) {
			return res.status(err.statusCode || 400).json({
				success: false,
				message: err.message,
				validationErrors: err.validationErrors
			})
		}
		return res.status(err.statusCode || 400).json({
			success: false,
			message: err.message
		})
	} else {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
			details: `MongoDB Error: ${err.message}`
		})
	}
}

export default errorHandler
