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
	OPENAI_API_KEY: string
	OPEN_AI_CHAT_MODEL: string
	OPEN_AI_SPEECH_MODEL: string
	KAFKA_PRODUCER_CLIENT_ID: string
	KAFKA_BROKERS: string
	KAFKA_GROUP_ID: string
	KAFKA_CONSUMER_CLIENT_ID: string
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
	OPENAI_API_KEY: string
	OPEN_AI_CHAT_MODEL: string
	OPEN_AI_SPEECH_MODEL: string
	KAFKA_PRODUCER_CLIENT_ID: string
	KAFKA_BROKERS: string
	KAFKA_GROUP_ID: string
	KAFKA_CONSUMER_CLIENT_ID: string
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
		this.OPENAI_API_KEY = process.env["OPENAI_API_KEY"] as string
		this.OPEN_AI_CHAT_MODEL = process.env["OPEN_AI_CHAT_MODEL"] as string
		this.OPEN_AI_SPEECH_MODEL = process.env[
			"OPEN_AI_SPEECH_MODEL"
		] as string
		this.KAFKA_PRODUCER_CLIENT_ID = process.env["KAFKA_CLIENT_ID"] as string
		this.KAFKA_BROKERS = process.env["KAFKA_BROKERS"] as string
		this.KAFKA_GROUP_ID = process.env["KAFKA_GROUP_ID"] as string
		this.KAFKA_CONSUMER_CLIENT_ID = process.env[
			"KAFKA_CONSUMER_CLIENT_ID"
		] as string
	}
}
