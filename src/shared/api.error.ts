import { injectable } from "inversify"

@injectable()
class ApiError extends Error {
	statusCode: number
	message: string
	details?: any
	validationErrors?: any[]

	constructor(
		statusCode: number,
		message: string,
		details?: any,
		validationErrors?: any[]
	) {
		super(message)
		this.statusCode = statusCode
		this.message = message
		this.details = details
		this.validationErrors = validationErrors
	}

	static BadRequest(message?: string) {
		return new ApiError(400, message || "Bad Request")
	}

	static NotFound(message?: string) {
		return new ApiError(404, message || "Not Found")
	}
	static Unauthorized(message?: string) {
		return new ApiError(401, message || "Unauthorized")
	}

	static Forbidden(message?: string) {
		return new ApiError(403, message || "Forbidden")
	}

	static InternalServerError(message?: string) {
		return new ApiError(500, message || "Internal Server Error")
	}

	static NotImplemented(message?: string) {
		return new ApiError(501, message || "Not Implemented")
	}

	static BadGateway(message?: string) {
		return new ApiError(502, message || "Bad Gateway")
	}

	static ServiceUnavailable(message?: string) {
		return new ApiError(503, message || "Service Unavailable")
	}

	static GatewayTimeout(message?: string) {
		return new ApiError(504, message || "Gateway Timeout")
	}

	static PreconditionFailed(message?: string) {
		return new ApiError(412, message || "Precondition Failed")
	}

	static RequestEntityTooLarge(message?: string) {
		return new ApiError(413, message || "Request Entity Too Large")
	}

	static RequestURITooLong(message?: string) {
		return new ApiError(414, message || "Request URI Too Long")
	}

	static UnsupportedMediaType(message?: string) {
		return new ApiError(415, message || "Unsupported Media Type")
	}

	static RequestedRangeNotSatisfiable(message?: string) {
		return new ApiError(416, message || "Requested Range Not Satisfiable")
	}

	static ExpectationFailed(message?: string) {
		return new ApiError(417, message || "Expectation Failed")
	}

	static UnprocessableEntity(message?: string) {
		return new ApiError(422, message || "Unprocessable Entity")
	}

	static Locked(message?: string) {
		return new ApiError(423, message || "Locked")
	}

	static TooManyRequests(message?: string) {
		return new ApiError(429, message || "Too Many Requests")
	}

	static NetworkAuthenticationRequired(message?: string) {
		return new ApiError(511, message || "Network Authentication Required")
	}

	static ValidationError(message?: string, validationErrors?: any[]) {
		return new ApiError(
			400,
			message || "Validation Error",
			400,
			validationErrors
		)
	}
}

export default ApiError
