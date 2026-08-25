import express from "express";
import dotenv from "dotenv";
import { Message } from "./models/Message";
import { connectDB } from "./db/connection";

dotenv.config();

const app = express();

const dns = require("dns")
console.log(dns.getServers());
dns.setServers(["8.8.8.8", "8.8.4.4"]);



const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend started",
  });
});

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

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
}

startServer();