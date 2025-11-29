export interface IProgramActivity {
	time: string
	activity: string
	duration?: string
	priority?: "low" | "medium" | "high"
	category?: string
	notes?: string
}

export interface IOpenApiResponse {
	title: string
	content: string
	content_json: {
		daily_routine: IProgramActivity[]
		summary?: string
		total_activities?: number
		estimated_duration?: string
		tags?: string[]
	}
}
