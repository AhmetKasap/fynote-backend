import { SERVICE_TYPES } from "@/service.types"
import { inject } from "inversify"
import { IConfig } from "@/config"
import OpenAI from "openai"
import { injectable } from "inversify"
import { promptSettings } from "@/templates/promt.settings"

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

	async generateText(prompt: string): Promise<string> {
		const response = await this.openAi.responses.create({
			model: this.config.OPEN_AI_CHAT_MODEL,
			input: prompt
		})
		return response.output_text
	}

	async generateProgramFromText(text: string): Promise<string> {
		const prompt = promptSettings + text

		const response = await this.openAi.responses.create({
			model: this.config.OPEN_AI_CHAT_MODEL,
			input: prompt
		})
		return response.output_text
	}
}
