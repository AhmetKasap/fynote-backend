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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jose_1 = require("jose");
const sha256_1 = __importDefault(require("sha256"));
const inversify_1 = require("inversify");
const service_types_1 = require("../service.types");
const user_model_1 = require("../database/models/user.model");
const api_error_1 = __importDefault(require("../shared/api.error"));
let JwtService = class JwtService {
    config;
    secret;
    alg;
    constructor(config) {
        this.config = config;
        this.secret = new TextEncoder().encode(this.config.JWT_SECRET);
        this.alg = "HS256";
    }
    jwtGenerate(payload, expiresIn) {
        const jwt = new jose_1.SignJWT(payload)
            .setIssuedAt()
            .setProtectedHeader({ alg: this.alg })
            .setExpirationTime(expiresIn)
            .sign(this.secret);
        return jwt;
    }
    async jwtVerify(token) {
        const { payload } = await (0, jose_1.jwtVerify)(token, this.secret, {
            algorithms: [this.alg]
        });
        return payload;
    }
    hashPassword(password) {
        return (0, sha256_1.default)(password);
    }
    comparePassword(password, hash) {
        return (0, sha256_1.default)(password) === hash;
    }
    async tokenVerify(token) {
        if (token.includes("Bearer"))
            token = token.split(" ")[1];
        try {
            const decoded = await this.jwtVerify(token);
            const user = await user_model_1.UserModel.findOne({
                _id: decoded.id
            });
            if (!user)
                throw new api_error_1.default(404, "User not found");
            return {
                message: "User found",
                result: decoded,
                success: true
            };
        }
        catch (error) {
            throw new api_error_1.default(400, "Invalid token");
        }
    }
};
JwtService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IConfig)),
    __metadata("design:paramtypes", [Object])
], JwtService);
exports.default = JwtService;
