import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "@/shared/router.interface"
import { SERVICE_TYPES } from "@/service.types"
import validationMiddleware from "@/middlewares/validation.middleware"
import {
	CreateProgramFromTextDto,
	CreateProgramFromAudioDto
} from "./program.dto"
import { ProgramController } from "./program.controller"
import authMiddleware from "@/middlewares/auth.middleware"

@injectable()
class ProgramRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/program"

	constructor(
		@inject(SERVICE_TYPES.ProgramController)
		private readonly programController: ProgramController
	) {}

	setupRoutes(): void {
		this.router.post(
			"/from-audio",
			authMiddleware(),
			validationMiddleware(CreateProgramFromAudioDto, "body"),
			this.programController.createFromAudio
		)

		this.router.post(
			"/from-text",
			authMiddleware(),
			validationMiddleware(CreateProgramFromTextDto, "body"),
			this.programController.createFromText
		)

		this.router.get(
			"/:id",
			authMiddleware(),
			this.programController.getProgramById
		)

		this.router.get(
			"/",
			authMiddleware(),
			this.programController.getUserPrograms
		)
	}
}

export default ProgramRouter
