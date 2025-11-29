import { NextFunction, Response, RequestHandler } from "express"
import multer from "multer"
import ApiError from "../shared/api.error"
import IUserRequest from "../shared/user.request"

const storage = multer.memoryStorage()

const mimeTypes = [
	"audio/mpeg",
	"audio/mp3",
	"audio/wav",
	"audio/wave",
	"audio/ogg",
	"audio/webm",
	"audio/mp4",
	"audio/aac"
]

const upload = multer({
	storage,
	limits: {
		fileSize: 20 * 1024 * 1024 // 20MB limit
	},
	fileFilter: (_req, file, cb) => {
		if (!mimeTypes.includes(file.mimetype)) {
			return cb(new Error("Only audio files are allowed") as any, false)
		}
		cb(null, true)
	}
})

export default function audioUploadMiddleware(): RequestHandler {
	return (req: IUserRequest, res: Response, next: NextFunction) => {
		const uploadSingle = upload.single("audio")

		uploadSingle(req, res, (err: any) => {
			if (err instanceof multer.MulterError) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return next(
						ApiError.RequestEntityTooLarge(
							"Dosya boyutu 20MB'dan büyük olamaz"
						)
					)
				}
				return next(
					ApiError.BadRequest(`Dosya yükleme hatası: ${err.message}`)
				)
			} else if (err) {
				return next(ApiError.BadRequest(err.message))
			}

			if (!req.file) {
				return next(ApiError.BadRequest("Ses dosyası yüklenmedi"))
			}

			req.body = req.file.buffer

			next()
		})
	}
}
