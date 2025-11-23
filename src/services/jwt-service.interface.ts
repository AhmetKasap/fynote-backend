import { JWTPayload } from "jose"

export interface IJwtService {
	secret: Uint8Array
	alg: string
	jwtGenerate(
		payload: any,
		expiresIn: number | string | Date
	): Promise<string>
	jwtVerify(token: string): Promise<any>
	hashPassword(password: string): string
	comparePassword(password: string, hash: string): boolean
	tokenVerify(token: string): Promise<JWTPayload>
}
