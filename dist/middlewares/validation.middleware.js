"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const api_error_1 = __importDefault(require("../shared/api.error"));
const validationMiddleware = (type, value, skipMissingProperties = false, whitelist = true, forbidNonWhitelisted = true) => {
    return (req, _res, next) => {
        const data = (0, class_transformer_1.plainToInstance)(type, req[value]);
        (0, class_validator_1.validate)(data, {
            skipMissingProperties,
            whitelist,
            forbidNonWhitelisted
        }).then((errors) => {
            if (errors.length > 0) {
                const messages = errors.map((error) => {
                    const error1 = {
                        field: error.property,
                        errors: []
                    };
                    for (const key of Object.keys(error?.constraints || {})) {
                        if (error.constraints?.[key]) {
                            error1.errors.push(error.constraints[key]);
                        }
                    }
                    return error1;
                });
                next(new api_error_1.default(400, "validation error", undefined, messages));
            }
            else {
                req[value] = data;
                next();
            }
        });
    };
};
exports.default = validationMiddleware;
