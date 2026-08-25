import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(mongoURI);

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    isConnected = false;

    console.error("MongoDB connection failed", error);

    throw error;
  }
}