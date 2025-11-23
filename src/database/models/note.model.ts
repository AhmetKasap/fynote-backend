import { model, ObjectId, Schema } from "mongoose"

export interface INote {
	id: string
	userId: ObjectId
	folderId?: ObjectId
	icon?: ObjectId
	title: string
	contentText: string
	contentJson: object
	createdAt: Date
	updatedAt: Date
}

const noteSchema = new Schema<INote>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	folderId: { type: Schema.Types.ObjectId, ref: "Folder", required: false },
	icon: { type: Schema.Types.ObjectId, ref: "Icon", required: false },
	title: { type: String, required: true },
	contentText: { type: String, required: true },
	contentJson: { type: Object, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
})

export const NoteModel = model<INote>("Note", noteSchema)
