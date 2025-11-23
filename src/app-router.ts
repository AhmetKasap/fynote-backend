import type { IRouter } from "./shared/router.interface"
import { injectable, multiInject } from "inversify"
import type { Express } from "express"
import { SERVICE_TYPES } from "./service.types"
@injectable()
class AppRouter {
	constructor(
		@multiInject(SERVICE_TYPES.IRouter) private readonly routers: IRouter[]
	) {}
	run(app: Express) {
		this.routers.forEach((router) => {
			router.setupRoutes()
			app.use(router.path, router.router)
		})
	}
}
export default AppRouter
