import { injectable } from "inversify"
import { IconModel } from "@/database/models/icon.model"
import { type IIcon } from "@/modules/icon/icon.dto"

@injectable()
export class IconService {
	async getIcons(): Promise<IIcon[]> {
		const icons = await IconModel.find().lean()

		return icons.map((icon) => ({
			id: icon._id.toString(),
			name: icon.name,
			fileUrl: icon.fileUrl
		}))
	}
}
