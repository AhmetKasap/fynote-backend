"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpirationDate = exports.generateCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateCode = (length = 6) => {
    return crypto_1.default
        .randomInt(0, 10 ** length)
        .toString()
        .padStart(length, "0");
};
exports.generateCode = generateCode;
const generateExpirationDate = (minutes = 10) => {
    return new Date(Date.now() + minutes * 60 * 1000); // 10 minutes
};
exports.generateExpirationDate = generateExpirationDate;
