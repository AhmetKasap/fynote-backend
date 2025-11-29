import { SERVICE_TYPES } from "@/service.types"
import { inject } from "inversify"
import { IConfig } from "@/config"
import OpenAI from "openai"
import { injectable } from "inversify"
import { promptSettings } from "@/templates/promt.settings"
import { IOpenApiResponse } from "@/dtos/open.api.dto"
import ApiError from "@/shared/api.error"

@injectable()
export class OpenAiService {
	private readonly openAi: OpenAI
	constructor(
		@inject(SERVICE_TYPES.IConfig)
		private readonly config: IConfig
	) {
		this.openAi = new OpenAI({
			apiKey: this.config.OPENAI_API_KEY
		})
	}

	async generateSpeechToText(audio: Buffer): Promise<any> {
		const file = await OpenAI.toFile(audio, "audio.mp3", {
			type: "audio/mpeg"
		})

		const response = await this.openAi.audio.transcriptions.create({
			model: this.config.OPEN_AI_SPEECH_MODEL,
			file
		})

		return response.text
	}

	async generateProgramFromText(text: string): Promise<IOpenApiResponse> {
		const prompt = promptSettings + text

		const response = await this.openAi.chat.completions.create({
			model: this.config.OPEN_AI_CHAT_MODEL,
			messages: [
				{
					role: "system",
					content:
						"Sen bir profesyonel program asistanısın. Kullanıcının isteğine göre detaylı, yapılandırılmış günlük programlar oluşturursun. Yanıtların SADECE JSON formatında olmalı."
				},
				{
					role: "user",
					content: prompt
				}
			],
			temperature: 0.7,
			max_tokens: 2000,
			response_format: { type: "json_object" }
		})

		const content = response.choices[0]?.message?.content
		if (!content) {
			throw ApiError.InternalServerError(
				"OpenAI yanıtı gerekli alanları içermiyor"
			)
		}

		const parsedResponse = JSON.parse(content) as IOpenApiResponse

		parsedResponse.content_json.summary =
			parsedResponse.content_json.summary || parsedResponse.content
		parsedResponse.content_json.total_activities =
			parsedResponse.content_json.total_activities ||
			parsedResponse.content_json.daily_routine.length
		parsedResponse.content_json.tags =
			parsedResponse.content_json.tags || []

		return parsedResponse
	}
}
