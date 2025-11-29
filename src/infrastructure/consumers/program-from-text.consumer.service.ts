import { inject, injectable } from "inversify"
import { EachMessagePayload } from "kafkajs"
import KAFKA_TOPICS from "../kafka.topics"
import { IMessageHandler } from "../interfaces/message-handler.interface"
import { SERVICE_TYPES } from "@/service.types"
import { OpenAiService } from "../services/open-ai.service"
import { ProgramModel } from "@/database/models/program.model"

@injectable()
export class ProgramFromTextConsumerService implements IMessageHandler {
	constructor(
		@inject(SERVICE_TYPES.OpenAiService)
		private readonly openAiService: OpenAiService
	) {}

	getTopic(): string {
		return KAFKA_TOPICS.PROGRAM_FROM_TEXT
	}

	async handleMessage(payload: EachMessagePayload): Promise<void> {
		const value = payload.message.value?.toString()
		if (!value) {
			return
		}

		try {
			const data = JSON.parse(value)
			const { programId, text } = data

			const programContent =
				await this.openAiService.generateProgramFromText(text)

			const title =
				text.substring(0, 50) + (text.length > 50 ? "..." : "")

			await ProgramModel.findByIdAndUpdate(programId, {
				title,
				content: programContent,
				status: "completed",
				updatedAt: new Date()
			})
		} catch (err) {
			console.error(
				"[ProgramFromTextConsumer] Error processing message:",
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
