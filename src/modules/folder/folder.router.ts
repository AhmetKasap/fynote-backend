import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "@/shared/router.interface"
import { SERVICE_TYPES } from "@/service.types"
import validationMiddleware from "@/middlewares/validation.middleware"
import authMiddleware from "@/middlewares/auth.middleware"
import { CreateFolderDto, UpdateFolderDto } from "@/modules/folder/folder.dto"
import { FolderController } from "./folder.controller"

@injectable()
class FolderRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/folders"

	constructor(
		@inject(SERVICE_TYPES.FolderController)
		private readonly folderController: FolderController
	) {}

	setupRoutes(): void {
		this.router.use(authMiddleware())

		this.router.get("/", this.folderController.getFolders)
		this.router.post(
			"/",
			validationMiddleware(CreateFolderDto, "body"),
			this.folderController.createFolder
		)
		this.router.get("/:id", this.folderController.getFolder)
		this.router.put(
			"/:id",
			validationMiddleware(UpdateFolderDto, "body"),
			this.folderController.updateFolder
		)
		this.router.delete("/:id", this.folderController.deleteFolder)
	}
}

export default FolderRouter
