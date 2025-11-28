import { inject, injectable } from "inversify"
import { Kafka, Consumer, logLevel } from "kafkajs"
import { IConfig } from "@/config"
import { SERVICE_TYPES } from "@/service.types"
import { IMessageHandler } from "./interfaces/message-handler.interface"

@injectable()
export class KafkaConsumerService {
	private kafka: Kafka
	private consumer: Consumer
	private isConnected: boolean = false
	private handlers: Map<string, IMessageHandler> = new Map()

	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig
	) {
		this.kafka = new Kafka({
			clientId: this.config.KAFKA_CONSUMER_CLIENT_ID, //bir tanımlayıcıdır. olmazsa kafka kendisi oluşturur
			brokers: this.config.KAFKA_BROKERS.split(";"),
			logLevel: logLevel.INFO
		})

		this.consumer = this.kafka.consumer({
			groupId: this.config.KAFKA_GROUP_ID
		})
	}

	/**
	 * Yeni bir message handler ekler
	 * @param handler IMessageHandler implement eden consumer
	 */
	registerHandler(handler: IMessageHandler): void {
		const topic = handler.getTopic()
		if (this.handlers.has(topic)) {
			console.warn(
				`[Kafka Consumer] Handler already registered for topic: ${topic}, overwriting...`
			)
		}
		this.handlers.set(topic, handler)
		console.log(`[Kafka Consumer] Handler registered for topic: ${topic}`)
	}

	/**
	 * Birden fazla handler'ı toplu olarak ekler
	 * @param handlers IMessageHandler dizisi
	 */
	registerHandlers(handlers: IMessageHandler[]): void {
		handlers.forEach((handler) => this.registerHandler(handler))
	}

	/** Bağlantı Aç ve Handler'ların Topiclerine Subscribe Et */
	async connect() {
		if (this.isConnected) {
			console.warn("[Kafka Consumer] Already connected, skipping...")
			return
		}

		if (this.handlers.size === 0) {
			console.warn(
				"[Kafka Consumer] No handlers registered. Please register handlers before connecting."
			)
			return
		}

		try {
			await this.consumer.connect()
			this.isConnected = true
			console.log("[Kafka Consumer] Connected")

			// Handler'ların topiclerine subscribe ol
			const topics = Array.from(this.handlers.keys())
			for (const topic of topics) {
				await this.consumer.subscribe({ topic, fromBeginning: true })
				console.log(`[Kafka Consumer] Subscribed to topic: ${topic}`)
			}

			// Mesajları dinle ve ilgili handler'a yönlendir
			await this.consumer.run({
				eachMessage: async (payload) => {
					const { topic, partition, message } = payload
					const value = message.value?.toString()

					console.log(
						`[Kafka Consumer] Received message from ${topic}[${partition}]: ${value}`
					)

					// İlgili handler'ı bul ve çalıştır
					const handler = this.handlers.get(topic)
					if (handler) {
						try {
							await handler.handleMessage(payload)
							console.log(
								`[Kafka Consumer] Message processed successfully by ${handler.constructor.name}`
							)
						} catch (err) {
							console.error(
								`[Kafka Consumer] Error processing message in handler ${handler.constructor.name}:`,
								err
							)
						}
					} else {
						console.warn(
							`[Kafka Consumer] No handler found for topic: ${topic}`
						)
					}
				}
			})
		} catch (err) {
			console.error("[Kafka Consumer] Connection/Subscribe failed:", err)
			throw err
		}
	}

	/** Bağlantı Kapat */
	async disconnect() {
		if (!this.isConnected) return
		try {
			await this.consumer.disconnect()
			this.isConnected = false
			console.log("[Kafka Consumer] Disconnected")
		} catch (err) {
			console.error("[Kafka Consumer] Disconnect error:", err)
		}
	}

	/** Health Check */
	async healthCheck(): Promise<boolean> {
		try {
			const admin = this.kafka.admin()
			await admin.connect()
			await admin.disconnect()
			return true
		} catch {
			return false
		}
	}
}
