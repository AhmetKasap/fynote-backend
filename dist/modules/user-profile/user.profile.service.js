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
const user_model_1 = require("../../database/models/user.model");
const inversify_1 = require("inversify");
const api_error_1 = __importDefault(require("../../shared/api.error"));
const code_generator_1 = require("../../helpers/code.generator");
const mail_service_1 = require("../../services/mail.service");
const service_types_1 = require("../../service.types");
const mail_dto_1 = require("../../dtos/mail.dto");
let UserProfileService = class UserProfileService {
    mailService;
    jwtService;
    constructor(mailService, jwtService) {
        this.mailService = mailService;
        this.jwtService = jwtService;
    }
    async getUserProfile(userId) {
        const user = await user_model_1.UserModel.findOne({ _id: userId }).select("-password");
        if (!user) {
            throw api_error_1.default.NotFound("Kullanıcı bulunamadı");
        }
        return user;
    }
    async updateUserProfile(userId, dto) {
        const user = await user_model_1.UserModel.findOne({ _id: userId });
        if (!user) {
            throw api_error_1.default.NotFound("Kullanıcı bulunamadı");
        }
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.updatedAt = new Date();
        await user.save();
        const populatedUser = await user_model_1.UserModel.findById(user._id).select("-password");
        if (!populatedUser) {
            throw api_error_1.default.InternalServerError("Kullanıcı güncellenemedi");
        }
        return populatedUser;
    }
    async forgotPassword(dto) {
        const user = await user_model_1.UserModel.findOne({
            email: dto.email
        });
        if (!user) {
            throw api_error_1.default.Unauthorized("Invalid email");
        }
        const code = (0, code_generator_1.generateCode)();
        const codeExpires = (0, code_generator_1.generateExpirationDate)();
        user.passwordResetCode = code;
        user.passwordResetExpires = codeExpires;
        await user.save();
        await this.mailService.sendMail(user.email, code, mail_dto_1.MailType.PASSWORD_RESET);
        return true;
    }
    async resetPassword(dto) {
        const user = await user_model_1.UserModel.findOne({
            passwordResetCode: dto.code,
            email: dto.email
        });
        if (!user) {
            throw api_error_1.default.Unauthorized("Invalid code or email");
        }
        if (user.passwordResetExpires &&
            user.passwordResetExpires < new Date()) {
            throw api_error_1.default.BadRequest("Code expired");
        }
        user.password = this.jwtService.hashPassword(dto.password);
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.updatedAt = new Date();
        await user.save();
        return true;
    }
};
UserProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.MailService)),
    __param(1, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IJwtService)),
    __metadata("design:paramtypes", [mail_service_1.MailService, Object])
], UserProfileService);
exports.default = UserProfileService;
