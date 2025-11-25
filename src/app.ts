import { createServer, Server } from "http"
import type { Express } from "express"
import { type IConfig } from "./config"
import { inject, injectable } from "inversify"
import { SERVICE_TYPES } from "./service.types"
import express from "express"
import cors from "cors"
import AppRouter from "./app-router"
import errorHandler from "./middlewares/error.handler"
import connectMongoDB from "./database/db.connection"
import path from "path"

@injectable()
class App {
	app: Express
	httpServer: Server

	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig,
		@inject(SERVICE_TYPES.IAppRouter) private readonly appRouter: AppRouter
	) {
		const app: Express = express()

		app.use(express.json())
		app.use(express.urlencoded({ extended: true }))
		app.use(cors())
		app.use("/public", express.static(path.join(__dirname, "public")))
		app.use(
			"/icons",
			express.static(path.join(__dirname, "public", "icons"))
		)

		this.app = app
		this.httpServer = createServer(this.app)
	}
	async start() {
		this.appRouter.run(this.app)
		connectMongoDB(this.config.MONGODB_URL)
		//iconSeeder()
		this.httpServer.listen(this.config.PORT, () => {
			console.log(`Server is running on port ${this.config.PORT}`)
		})
	}
	async afterStart() {
		this.app.use(errorHandler)
	}
}

export default App
