import express from "express";
import dotenv from "dotenv";
import { Message } from "./models/Message";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend started",
  });
});

// Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Failed to load messages:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load messages",
    });
  }
});

export default app;