import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../src/db/connection";
import cron from "node-cron";
import { Message } from "../src/models/Message";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running",
  });
});

connectDB()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

cron.schedule("0 0 * * *", async () => {
  try {
    await Message.deleteMany({});
    console.log("Messages cleared for the new day");
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
});

export default app;