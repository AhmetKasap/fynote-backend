import { Response } from "express"

export type ApiResponse<T = unknown> = {
	success: boolean
	message: string
	data?: T
	errors?: unknown
}

export default class ResponseBuilder {
	static ok<T>(res: Response, data?: T, message = "Success") {
		return res
			.status(200)
			.json({ success: true, message, data } as ApiResponse<T>)
	}

	static created<T>(res: Response, data?: T, message = "Created") {
		return res
			.status(201)
			.json({ success: true, message, data } as ApiResponse<T>)
	}

	static noContent(res: Response) {
		return res.status(204).send()
	}

	static fail(
		res: Response,
		message = "Bad Request",
		statusCode = 400,
		errors?: unknown
	) {
		return res
			.status(statusCode)
			.json({ success: false, message, errors } as ApiResponse)
	}
}
