import { model, Schema, Types } from "mongoose"

export interface IProgramActivity {
	time: string
	activity: string
	duration?: string
	priority?: "low" | "medium" | "high"
	category?: string
	notes?: string
}

export interface IProgramContentJson {
	daily_routine: IProgramActivity[]
	summary?: string
	total_activities?: number
	estimated_duration?: string
	tags?: string[]
}

export interface IProgram {
	id: string
	userId: Types.ObjectId
	title: string
	content: string
	content_json: IProgramContentJson
	status: "processing" | "completed" | "failed"
	errorMessage?: string
	createdAt: Date
	updatedAt: Date
}

const programActivitySchema = new Schema(
	{
		time: { type: String, required: true },
		activity: { type: String, required: true },
		duration: { type: String, required: false },
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			required: false
		},
		category: { type: String, required: false },
		notes: { type: String, required: false }
	},
	{ _id: false }
)

const programContentJsonSchema = new Schema(
	{
		daily_routine: {
			type: [programActivitySchema],
			required: true,
			default: []
		},
		summary: { type: String, required: false },
		total_activities: { type: Number, required: false },
		estimated_duration: { type: String, required: false },
		tags: { type: [String], required: false, default: [] }
	},
	{ _id: false }
)

const programSchema = new Schema<IProgram>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	title: { type: String, required: true },
	content: { type: String, required: false, default: "" },
	content_json: {
		type: programContentJsonSchema,
		required: false,
		default: () => ({ daily_routine: [], tags: [] })
	},
	status: {
		type: String,
		enum: ["processing", "completed", "failed"],
		default: "processing"
	},
	errorMessage: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
})

programSchema.index({ userId: 1, createdAt: -1 })
programSchema.index({ userId: 1, status: 1 })

export const ProgramModel = model<IProgram>("Program", programSchema)
