import { container } from "@/inversify.config"
import { SERVICE_TYPES } from "@/service.types"
import { KafkaProducerService } from "./kafka-producer.service"
import { KafkaConsumerService } from "./kafka-consumer.service"
import { ProgramFromAudioConsumerService } from "./consumers/program-from-audio.consumer.service"
import { ProgramFromTextConsumerService } from "./consumers/program-from-text.consumer.service"

/**
 * Kafka Bootstrap Service
 * Tüm Kafka bağlantılarını ve consumer'ları merkezi olarak yönetir
 */
export class KafkaBootstrap {
	private producer: KafkaProducerService | null = null
	private consumer: KafkaConsumerService | null = null
	private isInitialized = false

	async initialize(): Promise<void> {
		if (this.isInitialized) {
			return
		}

		try {
			this.producer = container.get<KafkaProducerService>(
				SERVICE_TYPES.KafkaProducerService
			)
			await this.producer.connect()

			this.consumer = container.get<KafkaConsumerService>(
				SERVICE_TYPES.KafkaConsumerService
			)

			await this.registerConsumers()
			await this.consumer.connect()

			this.isInitialized = true
		} catch (err) {
			throw err
		}
	}

	private async registerConsumers(): Promise<void> {
		const programFromAudioConsumer =
			container.get<ProgramFromAudioConsumerService>(
				SERVICE_TYPES.ProgramFromAudioConsumerService
			)
		this.consumer!.registerHandler(programFromAudioConsumer)

		const programFromTextConsumer =
			container.get<ProgramFromTextConsumerService>(
				SERVICE_TYPES.ProgramFromTextConsumerService
			)
		this.consumer!.registerHandler(programFromTextConsumer)
	}

	async shutdown(): Promise<void> {
		if (!this.isInitialized) {
			return
		}

		try {
			if (this.producer) {
				await this.producer.disconnect()
			}

			if (this.consumer) {
				await this.consumer.disconnect()
			}

			this.isInitialized = false
		} catch (err) {
			throw err
		}
	}

	async healthCheck(): Promise<boolean> {
		try {
			if (!this.producer) return false
			return await this.producer.healthCheck()
		} catch (err) {
			return false
		}
	}

	getProducer(): KafkaProducerService {
		if (!this.producer) {
			throw new Error(
				"[Kafka Bootstrap] Producer not initialized. Call initialize() first."
			)
		}
		return this.producer
	}

	getConsumer(): KafkaConsumerService {
		if (!this.consumer) {
			throw new Error(
				"[Kafka Bootstrap] Consumer not initialized. Call initialize() first."
			)
		}
		return this.consumer
	}
}

let kafkaBootstrap: KafkaBootstrap | null = null

export function getKafkaBootstrap(): KafkaBootstrap {
	if (!kafkaBootstrap) {
		kafkaBootstrap = new KafkaBootstrap()
	}
	return kafkaBootstrap
}

export async function bootstrapKafka(): Promise<void> {
	const bootstrap = getKafkaBootstrap()
	await bootstrap.initialize()
}

export async function shutdownKafka(): Promise<void> {
	const bootstrap = getKafkaBootstrap()
	await bootstrap.shutdown()
}

export async function kafkaHealthCheck(): Promise<boolean> {
	const bootstrap = getKafkaBootstrap()
	return await bootstrap.healthCheck()
}
