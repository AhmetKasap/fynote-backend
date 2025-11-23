"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const inversify_config_1 = require("../inversify.config");
const api_error_1 = __importDefault(require("../shared/api.error"));
const service_types_1 = require("../service.types");
function authMiddleware() {
    const jwtService = inversify_config_1.container.get(service_types_1.SERVICE_TYPES.IJwtService);
    return async (req, _res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new api_error_1.default(400, "Token not found"));
        }
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        const tokenIsValid = await jwtService.tokenVerify(token);
        if (!tokenIsValid["result"]) {
            return next(new api_error_1.default(401, "Invalid token"));
        }
        req.user = tokenIsValid["result"];
        next();
    };
}
