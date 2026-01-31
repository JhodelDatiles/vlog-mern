import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the db!");
  } catch (error) {
    console.error("Failed to connect to the db!", error);
    process.exit(1);
  }
}