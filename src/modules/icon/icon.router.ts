import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "@/shared/router.interface"
import { SERVICE_TYPES } from "@/service.types"
import authMiddleware from "@/middlewares/auth.middleware"
import { IconController } from "./icon.controller"

@injectable()
class IconRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/icons"

	constructor(
		@inject(SERVICE_TYPES.IconController)
		private readonly iconController: IconController
	) {}

	setupRoutes(): void {
		this.router.use(authMiddleware())

		this.router.get("/", this.iconController.getIcons)
	}
}

export default IconRouter
