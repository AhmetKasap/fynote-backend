import { model, ObjectId, Schema } from "mongoose"

export interface IFolder {
	id: string
	userId: ObjectId
	name: string
	icon?: ObjectId
	color?: string
	createdAt: Date
	updatedAt: Date
}

const folderSchema = new Schema<IFolder>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	name: { type: String, required: true },
	icon: { type: Schema.Types.ObjectId, ref: "Icon", required: false },
	color: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
})

export const FolderModel = model<IFolder>("Folder", folderSchema)
