import { model, Schema } from "mongoose"

export interface IIcon {
	id: string
	name: string
	fileUrl: string
}

const iconSchema = new Schema<IIcon>({
	name: { type: String, required: true },
	fileUrl: { type: String, required: true }
})

export const IconModel = model<IIcon>("Icon", iconSchema)
