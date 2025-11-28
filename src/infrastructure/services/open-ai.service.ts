import { SERVICE_TYPES } from "@/service.types"
import { inject } from "inversify"
import { IConfig } from "@/config"
import OpenAI from "openai"
import { injectable } from "inversify"

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

	async generateSpeechToText(_audio: Buffer): Promise<string> {
		return "s"
	}

	async generateText(prompt: string): Promise<string> {
		const response = await this.openAi.responses.create({
			model: this.config.OPEN_AI_CHAT_MODEL,
			input: prompt,
			store: true
		})
		return response.output_text
	}
}
