import { inject, injectable } from "inversify"
import { SERVICE_TYPES } from "@/service.types"
import { KafkaProducerService } from "@/infrastructure/kafka-producer.service"
import KAFKA_TOPICS from "@/infrastructure/kafka.topics"
import { ProgramModel } from "@/database/models/program.model"
import { Types } from "mongoose"
import { IProgramResponse } from "./program.dto"

@injectable()
export class ProgramService {
	constructor(
		@inject(SERVICE_TYPES.KafkaProducerService)
		private readonly kafkaProducerService: KafkaProducerService
	) {}

	async createProgramFromAudio(
		audio: Buffer,
		userId: string
	): Promise<IProgramResponse> {
		const program = await ProgramModel.create({
			userId: new Types.ObjectId(userId),
			title: "Program Hazırlanıyor...",
			content: "",
			status: "processing"
		})

		await this.kafkaProducerService.sendMessage(
			KAFKA_TOPICS.PROGRAM_FROM_AUDIO,
			JSON.stringify({
				programId: program._id.toString(),
				userId,
				audio: audio.toString("base64")
			})
		)

		return {
			id: program._id.toString(),
			message: "Programınız hazırlanıyor, kısa süre içinde tamamlanacak.",
			status: "processing"
		}
	}

	async createProgramFromText(
		text: string,
		userId: string
	): Promise<IProgramResponse> {
		const program = await ProgramModel.create({
			userId: new Types.ObjectId(userId),
			title: "Program Hazırlanıyor...",
			content: "",
			status: "processing"
		})

		await this.kafkaProducerService.sendMessage(
			KAFKA_TOPICS.PROGRAM_FROM_TEXT,
			JSON.stringify({
				programId: program._id.toString(),
				userId,
				text
			})
		)

		return {
			id: program._id.toString(),
			message: "Programınız hazırlanıyor, kısa süre içinde tamamlanacak.",
			status: "processing"
		}
	}

	async getProgramById(programId: string, userId: string) {
		const program = await ProgramModel.findOne({
			_id: programId,
			userId: new Types.ObjectId(userId)
		})

		if (!program) {
			return null
		}

		return program
	}

	async getUserPrograms(userId: string) {
		const programs = await ProgramModel.find({
			userId: new Types.ObjectId(userId)
		}).sort({ createdAt: -1 })

		return programs
	}
}
