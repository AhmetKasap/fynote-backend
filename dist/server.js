"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("./inversify.config");
const service_types_1 = require("./service.types");
const app = inversify_config_1.container.get(service_types_1.SERVICE_TYPES.IApp);
app.start().then(() => {
    app.afterStart();
});
