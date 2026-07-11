import mongoose from "mongoose";
import { Note } from "../models/note.js";

export const connectMongoDB = async () => {
  try {
    const url = process.env.MONGO_URL;
    await mongoose.connect(url);
    console.log("✅ MongoDB connection established successfully");
    await Note.syncIndexes(); // Ensure indexes are created for the Note model
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};
