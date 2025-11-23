"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const inversify_1 = require("inversify");
dotenv_1.default.config();
let Config = class Config {
    PORT;
    MONGODB_URL;
    JWT_SECRET;
    JWT_TOKEN_EXPIRATION;
    SERVER_URL;
    MAIL_HOST;
    MAIL_PORT;
    MAIL_USER;
    MAIL_PASSWORD;
    MAIL_FROM;
    MAIL_SECURE;
    constructor() {
        this.PORT = process.env["PORT"];
        this.MONGODB_URL = process.env["MONGODB_URL"];
        this.JWT_SECRET = process.env["JWT_SECRET"];
        this.JWT_TOKEN_EXPIRATION = process.env["JWT_TOKEN_EXPIRATION"];
        this.SERVER_URL = process.env["SERVER_URL"];
        this.MAIL_HOST = process.env["MAIL_HOST"];
        this.MAIL_PORT = process.env["MAIL_PORT"];
        this.MAIL_USER = process.env["MAIL_USER"];
        this.MAIL_PASSWORD = process.env["MAIL_PASSWORD"];
        this.MAIL_FROM = process.env["MAIL_FROM"];
        this.MAIL_SECURE = process.env["MAIL_SECURE"] === "true";
    }
};
exports.Config = Config;
exports.Config = Config = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], Config);
