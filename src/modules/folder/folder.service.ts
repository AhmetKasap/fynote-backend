import { injectable } from "inversify"
import { FolderModel } from "@/database/models/folder.model"
import { NoteModel } from "@/database/models/note.model"
import { IconModel } from "@/database/models/icon.model"
import ApiError from "@/shared/api.error"
import {
	ICreateFolderDto,
	IFolder,
	IFolderId,
	IUpdateFolderDto
} from "@/modules/folder/folder.dto"
import { IUserId } from "@/dtos/base.user.dto"
import { Types } from "mongoose"

@injectable()
export class FolderService {
	async getFolders(userId: IUserId): Promise<IFolder[]> {
		const folders = await FolderModel.find({ userId })
			.populate("icon")
			.lean()

		return folders.map((folder) => ({
			id: folder._id.toString(),
			userId: folder.userId.toString(),
			name: folder.name,
			icon: folder.icon
				? {
						id: (folder.icon as any)._id.toString(),
						name: (folder.icon as any).name,
						fileUrl: (folder.icon as any).fileUrl
					}
				: undefined,
			color: folder.color
		}))
	}

	async getFolder(folderId: IFolderId, userId: IUserId): Promise<IFolder> {
		const folder = await FolderModel.findOne({
			_id: folderId.id,
			userId
		})
			.populate("icon")
			.lean()

		if (!folder) {
			throw ApiError.NotFound("Klasör bulunamadı")
		}

		return {
			id: folder._id.toString(),
			userId: folder.userId.toString(),
			name: folder.name,
			icon: folder.icon
				? {
						id: (folder.icon as any)._id.toString(),
						name: (folder.icon as any).name,
						fileUrl: (folder.icon as any).fileUrl
					}
				: undefined,
			color: folder.color
		}
	}

	async createFolder(
		dto: ICreateFolderDto,
		userId: IUserId
	): Promise<IFolder> {
		if (dto.iconId) {
			const icon = await IconModel.findById(
				new Types.ObjectId(dto.iconId)
			)
			if (!icon) {
				throw ApiError.NotFound("İkon bulunamadı")
			}
		}

		const folder = await FolderModel.create({
			userId,
			name: dto.name,
			icon: dto.iconId,
			color: dto.color,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		const populatedFolder = await FolderModel.findById(folder._id)
			.populate("icon")
			.lean()

		if (!populatedFolder) {
			throw ApiError.InternalServerError("Klasör oluşturulamadı")
		}

		return {
			id: populatedFolder._id.toString(),
			userId: populatedFolder.userId.toString(),
			name: populatedFolder.name,
			icon: populatedFolder.icon
				? {
						id: (populatedFolder.icon as any)._id.toString(),
						name: (populatedFolder.icon as any).name,
						fileUrl: (populatedFolder.icon as any).fileUrl
					}
				: undefined,
			color: populatedFolder.color
		}
	}

	async updateFolder(
		folderId: IFolderId,
		dto: IUpdateFolderDto,
		userId: IUserId
	): Promise<IFolder> {
		const folder = await FolderModel.findOne({
			_id: folderId.id,
			userId
		})

		if (!folder) {
			throw ApiError.NotFound("Klasör bulunamadı")
		}

		if (dto.name) folder.name = dto.name
		if (dto.color !== undefined) folder.color = dto.color

		if (dto.iconId !== undefined) {
			if (dto.iconId) {
				const icon = await IconModel.findById(dto.iconId)
				if (!icon) {
					throw ApiError.NotFound("İkon bulunamadı")
				}
				folder.icon = dto.iconId as any
			} else {
				folder.icon = undefined as any
			}
		}

		folder.updatedAt = new Date()

		await folder.save()

		const populatedFolder = await FolderModel.findById(folder._id)
			.populate("icon")
			.lean()

		if (!populatedFolder) {
			throw ApiError.InternalServerError("Klasör güncellenemedi")
		}

		return {
			id: populatedFolder._id.toString(),
			userId: populatedFolder.userId.toString(),
			name: populatedFolder.name,
			icon: populatedFolder.icon
				? {
						id: (populatedFolder.icon as any)._id.toString(),
						name: (populatedFolder.icon as any).name,
						fileUrl: (populatedFolder.icon as any).fileUrl
					}
				: undefined,
			color: populatedFolder.color
		}
	}

	async deleteFolder(folderId: IFolderId, userId: IUserId): Promise<boolean> {
		const folder = await FolderModel.findOne({
			_id: folderId.id,
			userId
		})

		if (!folder) {
			throw ApiError.NotFound("Klasör bulunamadı")
		}

		await NoteModel.deleteMany({ folderId: folderId.id })

		await FolderModel.deleteOne({ _id: folderId.id })

		return true
	}
}
