import { inject, injectable } from "inversify"
import { EachMessagePayload } from "kafkajs"
import KAFKA_TOPICS from "../kafka.topics"
import { IMessageHandler } from "../interfaces/message-handler.interface"
import { SERVICE_TYPES } from "@/service.types"
import { OpenAiService } from "../services/open-ai.service"

@injectable()
export class SpeechToTextConsumerService implements IMessageHandler {
	constructor(
		@inject(SERVICE_TYPES.OpenAiService)
		private readonly openAiService: OpenAiService
	) {}

	getTopic(): string {
		return KAFKA_TOPICS.SPEECH_TO_TEXT
	}

	async handleMessage(payload: EachMessagePayload): Promise<void> {
		const value = payload.message.value?.toString()
		if (!value) {
			return
		}
		const audio = Buffer.from(value, "base64")
		const text = await this.openAiService.generateSpeechToText(audio)
		console.log(text)
	}
}
