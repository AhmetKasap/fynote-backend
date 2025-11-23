import { injectable, inject } from "inversify"
import type { Response } from "express"
import type IUserRequest from "@/shared/user.request"
import { SERVICE_TYPES } from "@/service.types"
import ResponseBuilder from "@/shared/response.builder"
import {
	ICreateFolderDto,
	IFolderId,
	IUpdateFolderDto
} from "@/modules/folder/folder.dto"
import { IUserId } from "@/dtos/base.user.dto"
import { FolderService } from "./folder.service"

@injectable()
export class FolderController {
	constructor(
		@inject(SERVICE_TYPES.FolderService)
		private readonly folderService: FolderService
	) {}

	getFolders = async (
		req: IUserRequest<{}, {}, {}>,
		res: Response
	): Promise<Response> => {
		const userId = req.user!.id as IUserId
		const folders = await this.folderService.getFolders(userId)
		return ResponseBuilder.ok(res, folders, "Klasörler başarıyla getirildi")
	}

	getFolder = async (
		req: IUserRequest<IFolderId, {}, {}>,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const userId = req.user!.id as IUserId
		const folder = await this.folderService.getFolder({ id }, userId)
		return ResponseBuilder.ok(res, folder, "Klasör başarıyla getirildi")
	}

	createFolder = async (
		req: IUserRequest<{}, {}, ICreateFolderDto>,
		res: Response
	): Promise<Response> => {
		const dto = req.body
		const userId = req.user!.id as IUserId
		const folder = await this.folderService.createFolder(dto, userId)
		return ResponseBuilder.created(
			res,
			folder,
			"Klasör başarıyla oluşturuldu"
		)
	}

	updateFolder = async (
		req: IUserRequest<IFolderId, {}, IUpdateFolderDto>,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const dto = req.body
		const userId = req.user!.id as IUserId
		const folder = await this.folderService.updateFolder(
			{ id },
			dto,
			userId
		)
		return ResponseBuilder.ok(res, folder, "Klasör başarıyla güncellendi")
	}

	deleteFolder = async (
		req: IUserRequest<IFolderId, {}, {}>,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const userId = req.user!.id as IUserId
		await this.folderService.deleteFolder({ id }, userId)
		return ResponseBuilder.ok(res, null, "Klasör başarıyla silindi")
	}
}
