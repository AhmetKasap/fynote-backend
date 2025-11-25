import { Router } from "express"
import { inject, injectable } from "inversify"
import { type IRouter } from "@/shared/router.interface"
import { SERVICE_TYPES } from "@/service.types"
import validationMiddleware from "@/middlewares/validation.middleware"
import authMiddleware from "@/middlewares/auth.middleware"
import { CreateNoteDto, UpdateNoteDto } from "@/modules/note/note.dto"
import { NoteController } from "./note.controller"

@injectable()
class NoteRouter implements IRouter {
	router: Router = Router()
	path = "/api/v1/note"

	constructor(
		@inject(SERVICE_TYPES.NoteController)
		private readonly noteController: NoteController
	) {}

	setupRoutes(): void {
		this.router.use(authMiddleware())

		this.router.get("/", this.noteController.getNotes)
		this.router.post(
			"/",
			validationMiddleware(CreateNoteDto, "body"),
			this.noteController.createNote
		)
		this.router.get("/:id", this.noteController.getNote)
		this.router.put(
			"/:id",
			validationMiddleware(UpdateNoteDto, "body"),
			this.noteController.updateNote
		)
		this.router.delete("/:id", this.noteController.deleteNote)
	}
}

export default NoteRouter
