import mongoose from "mongoose";

const URL = process.env.DB_URL;

if (!URL) {
  throw new Error("DB_URL is not defined in environment variables");
}

export const dbConnect = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};