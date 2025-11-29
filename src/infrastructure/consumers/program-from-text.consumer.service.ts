import { inject, injectable } from "inversify"
import { EachMessagePayload } from "kafkajs"
import KAFKA_TOPICS from "../kafka.topics"
import { IMessageHandler } from "../interfaces/message-handler.interface"
import { SERVICE_TYPES } from "@/service.types"
import { OpenAiService } from "../services/open-ai.service"
import { ProgramModel } from "@/database/models/program.model"
import { IOpenApiResponse } from "@/dtos/open.api.dto"

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

		let programId: string | null = null

		const data = JSON.parse(value)
		const { programId: id, text } = data
		programId = id

		if (!programId || !text) {
			throw new Error("programId veya text eksik")
		}

		const programContent: IOpenApiResponse =
			await this.openAiService.generateProgramFromText(text)

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
