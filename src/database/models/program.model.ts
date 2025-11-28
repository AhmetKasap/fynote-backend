import { model, Schema, Types } from "mongoose"

export interface IProgram {
	id: string
	userId: Types.ObjectId
	title: string
	content: string
	status: "processing" | "completed" | "failed"
	createdAt: Date
	updatedAt: Date
}

const programSchema = new Schema<IProgram>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	title: { type: String, required: true },
	content: { type: String, required: false, default: "" },
	status: {
		type: String,
		enum: ["processing", "completed", "failed"],
		default: "processing"
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
})

export const ProgramModel = model<IProgram>("Program", programSchema)
