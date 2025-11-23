import { plainToInstance } from "class-transformer"
import { validate, ValidationError } from "class-validator"
import type { RequestHandler } from "express"
import ApiError from "../shared/api.error"
const validationMiddleware = (
	type: any,
	value: "body" | "query" | "params",
	skipMissingProperties = false,
	whitelist = true,
	forbidNonWhitelisted = true
): RequestHandler => {
	return (req, _res, next) => {
		const data = plainToInstance(type, req[value])
		validate(data, {
			skipMissingProperties,
			whitelist,
			forbidNonWhitelisted
		}).then((errors: any) => {
			if (errors.length > 0) {
				const messages: any[] = errors.map((error: ValidationError) => {
					const error1: any = {
						field: error.property,
						errors: []
					}
					for (const key of Object.keys(error?.constraints || {})) {
						if (error.constraints?.[key]) {
							error1.errors.push(error.constraints[key])
						}
					}
					return error1
				})
				next(new ApiError(400, "validation error", undefined, messages))
			} else {
				req[value] = data
				next()
			}
		})
	}
}

export default validationMiddleware
