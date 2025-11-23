import dotenv from "dotenv"
import { injectable } from "inversify"
dotenv.config()

export interface IConfig {
	PORT: number
	MONGODB_URL: string
	JWT_SECRET: string
	JWT_TOKEN_EXPIRATION: string
	SERVER_URL: string
	MAIL_HOST: string
	MAIL_PORT: number
	MAIL_USER: string
	MAIL_PASSWORD: string
	MAIL_FROM: string
	MAIL_SECURE: boolean
}

@injectable()
export class Config implements IConfig {
	PORT: number
	MONGODB_URL: string
	JWT_SECRET: string
	JWT_TOKEN_EXPIRATION: string
	SERVER_URL: string
	MAIL_HOST: string
	MAIL_PORT: number
	MAIL_USER: string
	MAIL_PASSWORD: string
	MAIL_FROM: string
	MAIL_SECURE: boolean

	constructor() {
		this.PORT = process.env["PORT"] as unknown as number
		this.MONGODB_URL = process.env["MONGODB_URL"] as string
		this.JWT_SECRET = process.env["JWT_SECRET"] as string
		this.JWT_TOKEN_EXPIRATION = process.env[
			"JWT_TOKEN_EXPIRATION"
		] as string
		this.SERVER_URL = process.env["SERVER_URL"] as string
		this.MAIL_HOST = process.env["MAIL_HOST"] as string
		this.MAIL_PORT = process.env["MAIL_PORT"] as unknown as number
		this.MAIL_USER = process.env["MAIL_USER"] as string
		this.MAIL_PASSWORD = process.env["MAIL_PASSWORD"] as string
		this.MAIL_FROM = process.env["MAIL_FROM"] as string
		this.MAIL_SECURE = process.env["MAIL_SECURE"] === "true"
	}
}
