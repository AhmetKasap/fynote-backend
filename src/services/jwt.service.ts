import type { IConfig } from "../config"
import { JWTPayload, SignJWT, jwtVerify } from "jose"
import sha256 from "sha256"
import { inject, injectable } from "inversify"
import { SERVICE_TYPES } from "../service.types"
import { UserModel } from "../database/models/user.model"
import ApiError from "../shared/api.error"
import { IJwtService } from "./jwt-service.interface"
@injectable()
class JwtService implements IJwtService {
	secret: Uint8Array
	alg: string
	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig
	) {
		this.secret = new TextEncoder().encode(this.config.JWT_SECRET)
		this.alg = "HS256"
	}
	jwtGenerate(
		payload: any,
		expiresIn: number | string | Date
	): Promise<string> {
		const jwt = new SignJWT(payload)
			.setIssuedAt()
			.setProtectedHeader({ alg: this.alg })
			.setExpirationTime(expiresIn)
			.sign(this.secret)
		return jwt
	}
	async jwtVerify(token: string): Promise<any> {
		const { payload } = await jwtVerify(token, this.secret, {
			algorithms: [this.alg]
		})
		return payload
	}
	hashPassword(password: string): string {
		return sha256(password)
	}
	comparePassword(password: string, hash: string): boolean {
		return sha256(password) === hash
	}

	async tokenVerify(token: string): Promise<JWTPayload> {
		if (token.includes("Bearer")) token = token.split(" ")[1]
		try {
			const decoded = await this.jwtVerify(token)
			const user = await UserModel.findOne({
				_id: decoded.id
			})
			if (!user) throw new ApiError(404, "User not found")
			return {
				message: "User found",
				result: decoded,
				success: true
			}
		} catch (error) {
			throw new ApiError(400, "Invalid token")
		}
	}
}
export default JwtService
