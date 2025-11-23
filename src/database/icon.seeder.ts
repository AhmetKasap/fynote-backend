import { Config } from "../config"
import { IconModel } from "./models/icon.model"

const iconsData = [
	{ name: "fitness", fileUrl: "/icons/fit.svg" },
	{ name: "trip-bag", fileUrl: "/icons/trip-bag.svg" }
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
