import { inject, injectable } from "inversify"
import nodemailer, { Transporter } from "nodemailer"
import { Lang, MailType } from "../dtos/mail.dto"
import { IConfig } from "../config"
import { SERVICE_TYPES } from "../service.types"
import ApiError from "../shared/api.error"

@injectable()
export class MailService {
	private transporter: Transporter

	constructor(
		@inject(SERVICE_TYPES.IConfig)
		private readonly config: IConfig
	) {
		this.transporter = nodemailer.createTransport({
			host: this.config.MAIL_HOST,
			port: this.config.MAIL_PORT,
			secure: this.config.MAIL_SECURE,
			auth: {
				user: this.config.MAIL_USER,
				pass: this.config.MAIL_PASSWORD
			}
		})
	}

	async sendMail(
		to: string,
		code: string,
		type: MailType,
		lang: Lang = Lang.TR
	): Promise<boolean> {
		const mailOptions = {
			from: this.config.MAIL_FROM,
			to: to,
			subject: this.getMailSubject(type, lang),
			text: this.getMailText(type, code, lang),
			html: this.getMailTemplate(type, code, lang)
		}

		const info = await this.transporter.sendMail(mailOptions)

		if (!info.messageId) {
			throw ApiError.InternalServerError("Mail gönderilemedi")
		}

		return true
	}

	private getMailSubject(type: MailType, lang: Lang): string {
		const subjects = {
			tr: {
				[MailType.VERIFICATION]: "Fynote - Hesap Doğrulama Kodu",
				[MailType.PASSWORD_RESET]: "Fynote - Şifre Sıfırlama Kodu",
				[MailType.PASSWORD_CHANGED]: "Fynote - Şifreniz Değiştirildi",
				[MailType.ACCOUNT_DELETED]: "Fynote - Hesabınız Silindi"
			},
			en: {
				[MailType.VERIFICATION]: "Fynote - Account Verification Code",
				[MailType.PASSWORD_RESET]: "Fynote - Password Reset Code",
				[MailType.PASSWORD_CHANGED]:
					"Fynote - Your Password Has Changed",
				[MailType.ACCOUNT_DELETED]: "Fynote - Account Deleted"
			}
		}

		return subjects[lang][type] || "Fynote"
	}

	private getMailText(type: MailType, code: string, lang: Lang): string {
		const texts = {
			tr: {
				[MailType.VERIFICATION]: `Fynote hesabınızı doğrulamak için kodunuz: ${code}`,
				[MailType.PASSWORD_RESET]: `Fynote hesabınızın şifresini sıfırlamak için kodunuz: ${code}`,
				[MailType.PASSWORD_CHANGED]: `Fynote hesabınızın şifresi başarıyla değiştirildi.`,
				[MailType.ACCOUNT_DELETED]: `Fynote hesabınız silindi.`
			},
			en: {
				[MailType.VERIFICATION]: `Your Fynote verification code is: ${code}`,
				[MailType.PASSWORD_RESET]: `Your Fynote password reset code is: ${code}`,
				[MailType.PASSWORD_CHANGED]: `Your Fynote account password has been changed successfully.`,
				[MailType.ACCOUNT_DELETED]: `Your Fynote account has been deleted.`
			}
		}

		return texts[lang][type] || `Fynote message: ${code}`
	}

	private getMailTemplate(type: MailType, code: string, lang: Lang): string {
		const primaryColor = "#2e6ef7"
		const secondaryColor = "#f39c12"
		const borderRadius = "8px"
		const fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"

		const content = {
			tr: {
				[MailType.VERIFICATION]: {
					title: "Fynote Hesap Doğrulama",
					description:
						"Hesabınızı doğrulamak için aşağıdaki kodu kullanın:",
					footer: "Bu kod 10 dakika geçerlidir. Kodunuzu kimseyle paylaşmayın.",
					color: primaryColor
				},
				[MailType.PASSWORD_RESET]: {
					title: "Fynote Şifre Sıfırlama",
					description:
						"Hesabınızın şifresini sıfırlamak için aşağıdaki kodu kullanın:",
					footer: "Bu kod 10 dakika geçerlidir. Kodunuzu kimseyle paylaşmayın.",
					color: secondaryColor
				},
				[MailType.PASSWORD_CHANGED]: {
					title: "Fynote Şifre Değişikliği",
					description: "Hesabınızın şifresi başarıyla değiştirildi.",
					footer: `Eğer bu işlem size ait değilse hemen <a href="mailto:support@fynote.com" style="color:${primaryColor}; text-decoration:none;">destek ekibimizle</a> iletişime geçin.`,
					color: primaryColor
				},
				[MailType.ACCOUNT_DELETED]: {
					title: "Fynote Hesap Silindi",
					description: "Hesabınız kalıcı olarak silindi.",
					footer: `Eğer bu işlem size ait değilse hemen <a href="mailto:support@fynote.com" style="color:#e74c3c; text-decoration:none;">destek ekibimizle</a> iletişime geçin.`,
					color: "#e74c3c"
				}
			},
			en: {
				[MailType.VERIFICATION]: {
					title: "Fynote Account Verification",
					description:
						"Use the following code to verify your account:",
					footer: "This code is valid for 10 minutes. Do not share it with anyone.",
					color: primaryColor
				},
				[MailType.PASSWORD_RESET]: {
					title: "Fynote Password Reset",
					description:
						"Use the following code to reset your account password:",
					footer: "This code is valid for 10 minutes. Do not share it with anyone.",
					color: secondaryColor
				},
				[MailType.PASSWORD_CHANGED]: {
					title: "Fynote Password Changed",
					description:
						"Your account password has been changed successfully.",
					footer: `If you did not perform this action, contact <a href="mailto:support@fynote.com" style="color:${primaryColor}; text-decoration:none;">support</a>.`,
					color: primaryColor
				},
				[MailType.ACCOUNT_DELETED]: {
					title: "Fynote Account Deleted",
					description: "Your account has been permanently deleted.",
					footer: `If you did not perform this action, contact <a href="mailto:support@fynote.com" style="color:#e74c3c; text-decoration:none;">support</a>.`,
					color: "#e74c3c"
				}
			}
		}

		const c = content[lang][type] || {
			title: "Fynote",
			description: code,
			footer: "",
			color: primaryColor
		}

		return `
      <div style="font-family: ${fontFamily}; color:#333; padding:20px; background:#f9f9f9;">
        <div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:${borderRadius}; box-shadow:0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color:${c.color}; margin-bottom:20px;">${c.title}</h2>
          <p>${c.description}</p>
          ${
				type === MailType.VERIFICATION ||
				type === MailType.PASSWORD_RESET
					? `<div style="margin:20px 0; text-align:center;">
                <span style="display:inline-block; padding:10px 20px; font-size:24px; font-weight:bold; color:#fff; background:${c.color}; border-radius:${borderRadius}; letter-spacing:2px;">${code}</span>
              </div>`
					: ""
			}
          <p>${c.footer}</p>
        </div>
      </div>
    `
	}
}
