import { Config } from "../config"
import { IconModel } from "./models/icon.model"

const iconsData = [
	{ name: "brain", fileUrl: "/icons/brain.svg" },
	{ name: "calendar", fileUrl: "/icons/calender.svg" },
	{ name: "camera", fileUrl: "/icons/camera.svg" },
	{ name: "chart", fileUrl: "/icons/chart.svg" },
	{ name: "checklist", fileUrl: "/icons/checklist.svg" },
	{ name: "cloud", fileUrl: "/icons/cloud.svg" },
	{ name: "coffee", fileUrl: "/icons/coffe.svg" },
	{ name: "dashboard", fileUrl: "/icons/dashboard.svg" },
	{ name: "document", fileUrl: "/icons/document.svg" },
	{ name: "edit", fileUrl: "/icons/edit.svg" },
	{ name: "film", fileUrl: "/icons/film.svg" },
	{ name: "fitness", fileUrl: "/icons/fit.svg" },
	{ name: "flag", fileUrl: "/icons/flag.svg" },
	{ name: "goals", fileUrl: "/icons/goals.svg" },
	{ name: "heart", fileUrl: "/icons/heart.svg" },
	{ name: "home", fileUrl: "/icons/home.svg" },
	{ name: "kanban", fileUrl: "/icons/kanban.svg" },
	{ name: "lock", fileUrl: "/icons/lock.svg" },
	{ name: "music", fileUrl: "/icons/music.svg" },
	{ name: "notebook", fileUrl: "/icons/notebook.svg" },
	{ name: "notes", fileUrl: "/icons/notes.svg" },
	{ name: "project", fileUrl: "/icons/project.svg" },
	{ name: "search", fileUrl: "/icons/search.svg" },
	{ name: "short", fileUrl: "/icons/short.svg" },
	{ name: "start", fileUrl: "/icons/start.svg" },
	{ name: "sync", fileUrl: "/icons/sync.svg" },
	{ name: "task", fileUrl: "/icons/task.svg" },
	{ name: "timeline", fileUrl: "/icons/timeline.svg" },
	{ name: "todo", fileUrl: "/icons/todo.svg" },
	{ name: "travel", fileUrl: "/icons/travel.svg" },
	{ name: "upload", fileUrl: "/icons/upload.svg" },
	{ name: "workspace", fileUrl: "/icons/workspace.svg" },
	{ name: "writing", fileUrl: "/icons/writing.svg" }
]

const config = new Config()

const iconsDataWithUrl = iconsData.map((icon) => ({
	...icon,
	fileUrl: `${config.SERVER_URL}${icon.fileUrl}`
}))

const iconSeeder = async () => {
	const icons = await IconModel.insertMany(iconsDataWithUrl)
	return icons
}

export default iconSeeder
