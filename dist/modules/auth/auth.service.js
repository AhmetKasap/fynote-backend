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
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const user_model_1 = require("../../database/models/user.model");
const api_error_1 = __importDefault(require("../../shared/api.error"));
const service_types_1 = require("../../service.types");
const mail_service_1 = require("../../services/mail.service");
const mail_dto_1 = require("../../dtos/mail.dto");
const code_generator_1 = require("../../helpers/code.generator");
let AuthService = class AuthService {
    jwtService;
    config;
    mailService;
    constructor(jwtService, config, mailService) {
        this.jwtService = jwtService;
        this.config = config;
        this.mailService = mailService;
    }
    async login(login) {
        const userPassword = this.jwtService.hashPassword(login.password);
        const user = await user_model_1.UserModel.findOne({
            email: login.email,
            password: userPassword
        });
        if (!user) {
            throw api_error_1.default.NotFound("User email or password is incorrect");
        }
        if (!user.isEmailActivated) {
            throw api_error_1.default.Unauthorized("Please verify your email first");
        }
        const jwtPayload = {
            id: user.id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };
        const token = await this.jwtService.jwtGenerate(jwtPayload, this.config.JWT_TOKEN_EXPIRATION);
        return {
            id: user.id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: token
        };
    }
    async register(dto) {
        const userIsExists = await user_model_1.UserModel.findOne({ email: dto.email });
        if (userIsExists) {
            throw api_error_1.default.BadRequest("User already exists");
        }
        const userPassword = this.jwtService.hashPassword(dto.password);
        const emailActivationCode = (0, code_generator_1.generateCode)();
        const emailActivationExpires = (0, code_generator_1.generateExpirationDate)();
        const user = await user_model_1.UserModel.create({
            ...dto,
            password: userPassword,
            emailActivationCode: emailActivationCode,
            emailActivationExpires: emailActivationExpires,
            isEmailActivated: false
        });
        await this.mailService.sendMail(user.email, emailActivationCode, mail_dto_1.MailType.VERIFICATION);
        return true;
    }
    async verifyEmail(email, code) {
        const user = await user_model_1.UserModel.findOne({
            email: email,
            emailActivationCode: code,
            emailActivationExpires: { $gt: new Date() }
        });
        if (!user) {
            throw api_error_1.default.NotFound("User not found or code is incorrect");
        }
        user.isEmailActivated = true;
        user.emailActivationCode = undefined;
        user.emailActivationExpires = undefined;
        await user.save();
        return true;
    }
    async resendVerificationEmail(email) {
        const user = await user_model_1.UserModel.findOne({
            email: email,
            isEmailActivated: false
        });
        if (!user) {
            throw api_error_1.default.NotFound("User not found or email is already verified");
        }
        const emailActivationCode = (0, code_generator_1.generateCode)();
        const emailActivationExpires = (0, code_generator_1.generateExpirationDate)();
        user.emailActivationCode = emailActivationCode;
        user.emailActivationExpires = emailActivationExpires;
        await user.save();
        await this.mailService.sendMail(user.email, emailActivationCode, mail_dto_1.MailType.VERIFICATION);
        return true;
    }
    async authTest() {
        return {
            success: true,
            message: "Auth test successful"
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IJwtService)),
    __param(1, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IConfig)),
    __param(2, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.MailService)),
    __metadata("design:paramtypes", [Object, Object, mail_service_1.MailService])
], AuthService);
