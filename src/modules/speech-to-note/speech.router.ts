import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "../../shared/router.interface"
import { SERVICE_TYPES } from "../../service.types"
import validationMiddleware from "../../middlewares/validation.middleware"
import { SpeechToTextDto } from "./speech.dto"
import { SpeechController } from "./speech.controller"
import authMiddleware from "@/middlewares/auth.middleware"

@injectable()
class SpeechRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/speech"

	constructor(
		@inject(SERVICE_TYPES.SpeechController)
		private readonly speechController: SpeechController
	) {}
	setupRoutes(): void {
		this.router.post(
			"/to-text",
			authMiddleware(),
			validationMiddleware(SpeechToTextDto, "body"),
			this.speechController.speechToText
		)
	}
}

export default SpeechRouter
