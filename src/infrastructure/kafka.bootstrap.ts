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

	/**
	 * Kafka servislerini başlatır
	 */
	async initialize(): Promise<void> {
		if (this.isInitialized) {
			console.log("[Kafka Bootstrap] Already initialized, skipping...")
			return
		}

		try {
			console.log("[Kafka Bootstrap] Starting Kafka services...")

			// Producer'ı başlat
			this.producer = container.get<KafkaProducerService>(
				SERVICE_TYPES.KafkaProducerService
			)
			await this.producer.connect()
			console.log("[Kafka Bootstrap] ✅ Producer started successfully")

			// Consumer'ı başlat ve handler'ları register et
			this.consumer = container.get<KafkaConsumerService>(
				SERVICE_TYPES.KafkaConsumerService
			)

			// Tüm consumer'ları (message handler'ları) register et
			await this.registerConsumers()

			// Consumer'ı başlat (tüm register edilmiş handler'ların topic'lerine subscribe olur)
			await this.consumer.connect()

			console.log("[Kafka Bootstrap] ✅ Consumer started successfully")

			this.isInitialized = true
			console.log(
				"[Kafka Bootstrap] ✅ All Kafka services started successfully"
			)
		} catch (err) {
			console.error(
				"[Kafka Bootstrap] ❌ Failed to start Kafka services:",
				err
			)
			throw err
		}
	}

	/**
	 * Tüm consumer'ları (message handler'ları) register eder
	 * Yeni consumer eklemek için buraya ekleyin
	 */
	private async registerConsumers(): Promise<void> {
		console.log("[Kafka Bootstrap] Registering message handlers...")

		// Program from Audio Consumer
		const programFromAudioConsumer =
			container.get<ProgramFromAudioConsumerService>(
				SERVICE_TYPES.ProgramFromAudioConsumerService
			)
		this.consumer!.registerHandler(programFromAudioConsumer)

		// Program from Text Consumer
		const programFromTextConsumer =
			container.get<ProgramFromTextConsumerService>(
				SERVICE_TYPES.ProgramFromTextConsumerService
			)
		this.consumer!.registerHandler(programFromTextConsumer)

		console.log("[Kafka Bootstrap] ✅ All message handlers registered")
	}

	/**
	 * Kafka servislerini kapatır (Graceful Shutdown)
	 */
	async shutdown(): Promise<void> {
		if (!this.isInitialized) {
			console.log(
				"[Kafka Bootstrap] Not initialized, nothing to shutdown"
			)
			return
		}

		try {
			console.log("[Kafka Bootstrap] Shutting down Kafka services...")

			if (this.producer) {
				await this.producer.disconnect()
				console.log("[Kafka Bootstrap] ✅ Producer disconnected")
			}

			if (this.consumer) {
				await this.consumer.disconnect()
				console.log("[Kafka Bootstrap] ✅ Consumer disconnected")
			}

			this.isInitialized = false
			console.log(
				"[Kafka Bootstrap] ✅ Kafka services shut down successfully"
			)
		} catch (err) {
			console.error(
				"[Kafka Bootstrap] ❌ Error shutting down Kafka services:",
				err
			)
		}
	}

	/**
	 * Health check - Kafka servislerinin sağlıklı olup olmadığını kontrol eder
	 */
	async healthCheck(): Promise<boolean> {
		try {
			if (!this.producer) return false

			const producerHealthy = await this.producer.healthCheck()
			console.log(
				`[Kafka Bootstrap] Health check - Producer: ${producerHealthy ? "✅" : "❌"}`
			)

			return producerHealthy
		} catch (err) {
			console.error("[Kafka Bootstrap] Health check failed:", err)
			return false
		}
	}

	/**
	 * Producer instance'ını döndürür
	 */
	getProducer(): KafkaProducerService {
		if (!this.producer) {
			throw new Error(
				"[Kafka Bootstrap] Producer not initialized. Call initialize() first."
			)
		}
		return this.producer
	}

	/**
	 * Consumer instance'ını döndürür
	 */
	getConsumer(): KafkaConsumerService {
		if (!this.consumer) {
			throw new Error(
				"[Kafka Bootstrap] Consumer not initialized. Call initialize() first."
			)
		}
		return this.consumer
	}
}

// Singleton instance
let kafkaBootstrap: KafkaBootstrap | null = null

/**
 * Kafka Bootstrap singleton instance'ını döndürür
 */
export function getKafkaBootstrap(): KafkaBootstrap {
	if (!kafkaBootstrap) {
		kafkaBootstrap = new KafkaBootstrap()
	}
	return kafkaBootstrap
}

/**
 * Kafka servislerini başlatır (Helper function)
 */
export async function bootstrapKafka(): Promise<void> {
	const bootstrap = getKafkaBootstrap()
	await bootstrap.initialize()
}

/**
 * Kafka servislerini kapatır (Helper function)
 */
export async function shutdownKafka(): Promise<void> {
	const bootstrap = getKafkaBootstrap()
	await bootstrap.shutdown()
}

/**
 * Kafka health check (Helper function)
 */
export async function kafkaHealthCheck(): Promise<boolean> {
	const bootstrap = getKafkaBootstrap()
	return await bootstrap.healthCheck()
}
