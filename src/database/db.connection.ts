import mongoose from "mongoose"

const connectMongoDB = async (MONGODB_URL: string): Promise<void> => {
	try {
		await mongoose.connect(MONGODB_URL)
		console.log("MongoDB connected successfully")
	} catch (err) {
		console.error("MongoDB connection failed:", (err as Error).message)
		process.exit(1)
	}
}

export default connectMongoDB
