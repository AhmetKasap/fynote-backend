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
exports.UserProfileController = void 0;
const inversify_1 = require("inversify");
const service_types_1 = require("../../service.types");
const response_builder_1 = __importDefault(require("../../shared/response.builder"));
const user_profile_service_1 = __importDefault(require("./user.profile.service"));
let UserProfileController = class UserProfileController {
    userProfileService;
    constructor(userProfileService) {
        this.userProfileService = userProfileService;
    }
    getUserProfile = async (req, res) => {
        const userId = req.user?.id;
        const userProfile = await this.userProfileService.getUserProfile(userId);
        return response_builder_1.default.ok(res, userProfile, "User profile retrieved successfully");
    };
    updateUserProfile = async (req, res) => {
        const userId = req.user?.id;
        const userProfile = await this.userProfileService.updateUserProfile(userId, req.body);
        return response_builder_1.default.ok(res, userProfile, "User profile updated successfully");
    };
    forgotPassword = async (req, res) => {
        const userProfile = await this.userProfileService.forgotPassword(req.body);
        return response_builder_1.default.ok(res, userProfile, "Password reset email sent");
    };
    resetPassword = async (req, res) => {
        const userProfile = await this.userProfileService.resetPassword(req.body);
        return response_builder_1.default.ok(res, userProfile, "Password reset successfully");
    };
};
exports.UserProfileController = UserProfileController;
exports.UserProfileController = UserProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.UserProfileService)),
    __metadata("design:paramtypes", [user_profile_service_1.default])
], UserProfileController);
