import { inject, injectable } from "inversify"
import { EachMessagePayload } from "kafkajs"
import KAFKA_TOPICS from "../kafka.topics"
import { IMessageHandler } from "../interfaces/message-handler.interface"
import { SERVICE_TYPES } from "@/service.types"
import { OpenAiService } from "../services/open-ai.service"
import { ProgramModel } from "@/database/models/program.model"

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

		try {
			const data = JSON.parse(value)
			const { programId, audio } = data

			const audioBuffer = Buffer.from(audio, "base64")
			const transcribedText =
				await this.openAiService.generateSpeechToText(audioBuffer)

			const programContent =
				await this.openAiService.generateProgramFromText(
					transcribedText
				)

			const title =
				transcribedText.substring(0, 50) +
				(transcribedText.length > 50 ? "..." : "")

			await ProgramModel.findByIdAndUpdate(programId, {
				title,
				content: programContent,
				status: "completed",
				updatedAt: new Date()
			})
		} catch (err) {
			console.error(
				"[ProgramFromAudioConsumer] Error processing message:",
				err
			)

			if (value) {
				const data = JSON.parse(value)
				await ProgramModel.findByIdAndUpdate(data.programId, {
					status: "failed",
					updatedAt: new Date()
				})
			}

			throw err
		}
	}
}
