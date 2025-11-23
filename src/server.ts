import type App from "./app"
import { container } from "./inversify.config"
import { SERVICE_TYPES } from "./service.types"

const app = container.get<App>(SERVICE_TYPES.IApp)
app.start().then(() => {
	app.afterStart()
})
