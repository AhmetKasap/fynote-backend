import { inject, injectable } from "inversify"

import { SERVICE_TYPES } from "@/service.types"
import { KafkaProducerService } from "@/infrastructure/kafka-producer.service"
import KAFKA_TOPICS from "@/infrastructure/kafka.topics"

@injectable()
export class SpeechService {
	constructor(
		@inject(SERVICE_TYPES.KafkaProducerService)
		private readonly kafkaProducerService: KafkaProducerService
	) {}
	async speechToText(audio: Buffer): Promise<void> {
		await this.kafkaProducerService.sendMessage(
			KAFKA_TOPICS.SPEECH_TO_TEXT,
			audio.toString("base64")
		)
	}
}
