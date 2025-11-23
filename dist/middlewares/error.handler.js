"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("../shared/api.error"));
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof api_error_1.default) {
        if (err.validationErrors) {
            return res.status(err.statusCode || 400).json({
                success: false,
                message: err.message,
                validationErrors: err.validationErrors
            });
        }
        return res.status(err.statusCode || 400).json({
            success: false,
            message: err.message
        });
    }
    else {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            details: `MongoDB Error: ${err.message}`
        });
    }
};
exports.default = errorHandler;
