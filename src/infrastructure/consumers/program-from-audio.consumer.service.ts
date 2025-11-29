import { inject, injectable } from "inversify"
import { EachMessagePayload } from "kafkajs"
import KAFKA_TOPICS from "../kafka.topics"
import { IMessageHandler } from "../interfaces/message-handler.interface"
import { SERVICE_TYPES } from "@/service.types"
import { OpenAiService } from "../services/open-ai.service"
import { ProgramModel } from "@/database/models/program.model"
import { IOpenApiResponse } from "@/dtos/open.api.dto"

@injectable()
export class ProgramFromAudioConsumerService implements IMessageHandler {
	constructor(
		@inject(SERVICE_TYPES.OpenAiService)
		private readonly openAiService: OpenAiService
	) {}

	getTopic(): string {
		return KAFKA_TOPICS.PROGRAM_FROM_AUDIO
	}

	async handleMessage(payload: EachMessagePayload): Promise<void> {
		const value = payload.message.value?.toString()
		if (!value) {
			return
		}

		let programId: string | null = null

		const data = JSON.parse(value)
		const { programId: id, audio } = data
		programId = id

		const audioBuffer = Buffer.from(audio, "base64")

		const transcribedText =
			await this.openAiService.generateSpeechToText(audioBuffer)

		const programContent: IOpenApiResponse =
			await this.openAiService.generateProgramFromText(transcribedText)

		await ProgramModel.findByIdAndUpdate(
			programId,
			{
				title: programContent.title,
				content: programContent.content,
				content_json: programContent.content_json,
				status: "completed",
				updatedAt: new Date()
			},
			{ new: true }
		)
	}
}
