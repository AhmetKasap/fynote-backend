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
exports.MailService = void 0;
const inversify_1 = require("inversify");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_dto_1 = require("../dtos/mail.dto");
const service_types_1 = require("../service.types");
const api_error_1 = __importDefault(require("../shared/api.error"));
let MailService = class MailService {
    config;
    transporter;
    constructor(config) {
        this.config = config;
        this.transporter = nodemailer_1.default.createTransport({
            host: this.config.MAIL_HOST,
            port: this.config.MAIL_PORT,
            secure: this.config.MAIL_SECURE,
            auth: {
                user: this.config.MAIL_USER,
                pass: this.config.MAIL_PASSWORD
            }
        });
    }
    async sendMail(to, code, type, lang = mail_dto_1.Lang.TR) {
        const mailOptions = {
            from: this.config.MAIL_FROM,
            to: to,
            subject: this.getMailSubject(type, lang),
            text: this.getMailText(type, code, lang),
            html: this.getMailTemplate(type, code, lang)
        };
        const info = await this.transporter.sendMail(mailOptions);
        if (!info.messageId) {
            throw api_error_1.default.InternalServerError("Mail gönderilemedi");
        }
        return true;
    }
    getMailSubject(type, lang) {
        const subjects = {
            tr: {
                [mail_dto_1.MailType.VERIFICATION]: "Fynote - Hesap Doğrulama Kodu",
                [mail_dto_1.MailType.PASSWORD_RESET]: "Fynote - Şifre Sıfırlama Kodu",
                [mail_dto_1.MailType.PASSWORD_CHANGED]: "Fynote - Şifreniz Değiştirildi",
                [mail_dto_1.MailType.ACCOUNT_DELETED]: "Fynote - Hesabınız Silindi"
            },
            en: {
                [mail_dto_1.MailType.VERIFICATION]: "Fynote - Account Verification Code",
                [mail_dto_1.MailType.PASSWORD_RESET]: "Fynote - Password Reset Code",
                [mail_dto_1.MailType.PASSWORD_CHANGED]: "Fynote - Your Password Has Changed",
                [mail_dto_1.MailType.ACCOUNT_DELETED]: "Fynote - Account Deleted"
            }
        };
        return subjects[lang][type] || "Fynote";
    }
    getMailText(type, code, lang) {
        const texts = {
            tr: {
                [mail_dto_1.MailType.VERIFICATION]: `Fynote hesabınızı doğrulamak için kodunuz: ${code}`,
                [mail_dto_1.MailType.PASSWORD_RESET]: `Fynote hesabınızın şifresini sıfırlamak için kodunuz: ${code}`,
                [mail_dto_1.MailType.PASSWORD_CHANGED]: `Fynote hesabınızın şifresi başarıyla değiştirildi.`,
                [mail_dto_1.MailType.ACCOUNT_DELETED]: `Fynote hesabınız silindi.`
            },
            en: {
                [mail_dto_1.MailType.VERIFICATION]: `Your Fynote verification code is: ${code}`,
                [mail_dto_1.MailType.PASSWORD_RESET]: `Your Fynote password reset code is: ${code}`,
                [mail_dto_1.MailType.PASSWORD_CHANGED]: `Your Fynote account password has been changed successfully.`,
                [mail_dto_1.MailType.ACCOUNT_DELETED]: `Your Fynote account has been deleted.`
            }
        };
        return texts[lang][type] || `Fynote message: ${code}`;
    }
    getMailTemplate(type, code, lang) {
        const primaryColor = "#2e6ef7";
        const secondaryColor = "#f39c12";
        const borderRadius = "8px";
        const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        const content = {
            tr: {
                [mail_dto_1.MailType.VERIFICATION]: {
                    title: "Fynote Hesap Doğrulama",
                    description: "Hesabınızı doğrulamak için aşağıdaki kodu kullanın:",
                    footer: "Bu kod 10 dakika geçerlidir. Kodunuzu kimseyle paylaşmayın.",
                    color: primaryColor
                },
                [mail_dto_1.MailType.PASSWORD_RESET]: {
                    title: "Fynote Şifre Sıfırlama",
                    description: "Hesabınızın şifresini sıfırlamak için aşağıdaki kodu kullanın:",
                    footer: "Bu kod 10 dakika geçerlidir. Kodunuzu kimseyle paylaşmayın.",
                    color: secondaryColor
                },
                [mail_dto_1.MailType.PASSWORD_CHANGED]: {
                    title: "Fynote Şifre Değişikliği",
                    description: "Hesabınızın şifresi başarıyla değiştirildi.",
                    footer: `Eğer bu işlem size ait değilse hemen <a href="mailto:support@fynote.com" style="color:${primaryColor}; text-decoration:none;">destek ekibimizle</a> iletişime geçin.`,
                    color: primaryColor
                },
                [mail_dto_1.MailType.ACCOUNT_DELETED]: {
                    title: "Fynote Hesap Silindi",
                    description: "Hesabınız kalıcı olarak silindi.",
                    footer: `Eğer bu işlem size ait değilse hemen <a href="mailto:support@fynote.com" style="color:#e74c3c; text-decoration:none;">destek ekibimizle</a> iletişime geçin.`,
                    color: "#e74c3c"
                }
            },
            en: {
                [mail_dto_1.MailType.VERIFICATION]: {
                    title: "Fynote Account Verification",
                    description: "Use the following code to verify your account:",
                    footer: "This code is valid for 10 minutes. Do not share it with anyone.",
                    color: primaryColor
                },
                [mail_dto_1.MailType.PASSWORD_RESET]: {
                    title: "Fynote Password Reset",
                    description: "Use the following code to reset your account password:",
                    footer: "This code is valid for 10 minutes. Do not share it with anyone.",
                    color: secondaryColor
                },
                [mail_dto_1.MailType.PASSWORD_CHANGED]: {
                    title: "Fynote Password Changed",
                    description: "Your account password has been changed successfully.",
                    footer: `If you did not perform this action, contact <a href="mailto:support@fynote.com" style="color:${primaryColor}; text-decoration:none;">support</a>.`,
                    color: primaryColor
                },
                [mail_dto_1.MailType.ACCOUNT_DELETED]: {
                    title: "Fynote Account Deleted",
                    description: "Your account has been permanently deleted.",
                    footer: `If you did not perform this action, contact <a href="mailto:support@fynote.com" style="color:#e74c3c; text-decoration:none;">support</a>.`,
                    color: "#e74c3c"
                }
            }
        };
        const c = content[lang][type] || {
            title: "Fynote",
            description: code,
            footer: "",
            color: primaryColor
        };
        return `
      <div style="font-family: ${fontFamily}; color:#333; padding:20px; background:#f9f9f9;">
        <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:${borderRadius}; box-shadow:0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color:${c.color}; margin-bottom:20px;">${c.title}</h2>
          <p>${c.description}</p>
          ${type === mail_dto_1.MailType.VERIFICATION ||
            type === mail_dto_1.MailType.PASSWORD_RESET
            ? `<div style="margin:20px 0; text-align:center;">
                <span style="display:inline-block; padding:10px 20px; font-size:24px; font-weight:bold; color:#fff; background:${c.color}; border-radius:${borderRadius}; letter-spacing:2px;">${code}</span>
              </div>`
            : ""}
          <p>${c.footer}</p>
        </div>
      </div>
    `;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IConfig)),
    __metadata("design:paramtypes", [Object])
], MailService);
