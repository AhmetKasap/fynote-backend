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
		const base64str = audio.toString("base64")

		const response = await this.openAi.chat.completions.create({
			model: this.config.OPEN_AI_SPEECH_MODEL,
			modalities: ["text", "audio"],
			audio: { voice: "alloy", format: "wav" },

			messages: [
				{
					role: "user",
					content: [
						{ type: "text", text: "What is in this recording?" },
						{
							type: "input_audio",
							input_audio: {
								data: base64str,
								format: "mp3" // gönderdiğin ses mp3 ise wav yazma
							}
						}
					]
				}
			],

			store: false
		})

		return response.choices[0]
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
