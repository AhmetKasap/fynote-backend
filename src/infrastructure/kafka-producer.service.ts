import { inject, injectable } from "inversify"
import { Kafka, logLevel, Producer } from "kafkajs"
import { IConfig } from "@/config"
import { SERVICE_TYPES } from "@/service.types"

@injectable()
export class KafkaProducerService {
	private kafka: Kafka
	private producer: Producer
	private isConnected: boolean = false

	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig
	) {
		this.kafka = new Kafka({
			clientId: this.config.KAFKA_PRODUCER_CLIENT_ID,
			brokers: this.config.KAFKA_BROKERS.split(";"),

			logLevel: logLevel.INFO
		})

		this.producer = this.kafka.producer({
			allowAutoTopicCreation: false,

			// Retry mekanizması
			retry: {
				retries: 5,
				initialRetryTime: 300, // ilk retry
				maxRetryTime: 3000, // max limit
				factor: 2 // exponential backoff
			}
		})
	}

	async connect() {
		if (this.isConnected) return
		try {
			await this.producer.connect()
			this.isConnected = true
			console.log("Kafka Producer connected")
		} catch (error) {
			console.error("Kafka Producer connection failed:", error)
			throw error
		}
	}

	async sendMessage(topic: string, message: string) {
		if (!this.isConnected) await this.connect()

		await this.producer.send({
			topic,
			messages: [{ value: message }]
		})
		console.log(`Message sent to ${topic}`)
	}

	async disconnect() {
		if (!this.isConnected) return

		try {
			await this.producer.disconnect()
			this.isConnected = false
			console.log("[Kafka Producer] Disconnected")
		} catch (err) {
			console.error("[Kafka Producer] Disconnect error:", err)
		}
	}

	/** Health Check */
	async healthCheck() {
		try {
			await this.kafka.admin().connect()
			await this.kafka.admin().disconnect()
			return true
		} catch {
			return false
		}
	}
}
