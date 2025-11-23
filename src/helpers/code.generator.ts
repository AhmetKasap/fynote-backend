import crypto from "crypto"

export const generateCode = (length = 6): string => {
	return crypto
		.randomInt(0, 10 ** length)
		.toString()
		.padStart(length, "0")
}

export const generateExpirationDate = (minutes = 10): Date => {
	return new Date(Date.now() + minutes * 60 * 1000) // 10 minutes
}
