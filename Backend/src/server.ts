import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { Message } from "./models/Message";
import { connectDB } from "./db/connection";

dotenv.config();

const app = express();
const dns = require("dns")
console.log(dns.getServers());
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const PORT = Number(process.env.PORT) || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend started",
  });
});


app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: 1,
    });

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


app.post("/api/messages", async (req, res) => {
  try {
    console.log("Received message:", req.body);

    const { userId, username, message } = req.body;

    if (!userId || !username || !message) {
      res.status(400).json({
        success: false,
        message: "userId, username and message are required",
      });
      return;
    }

    const newMessage = await Message.create({
      userId,
      username,
      message,
    });

    console.log("Message saved:", newMessage);

    res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Failed to save message:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save message",
    });
  }
});

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`HTTP server running on http://localhost:${PORT}`);
    });

   
    const wss = new WebSocketServer({
      server,
    });

    wss.on("connection", (socket) => {
      console.log("WebSocket client connected");

      socket.on("message", (rawMessage) => {
        try {
          const data = JSON.parse(rawMessage.toString());

          console.log("WebSocket received:", data);

          if (data.type === "new_message") {
            
            wss.clients.forEach((client) => {
              if (client.readyState === 1) {
                client.send(
                  JSON.stringify({
                    type: "new_message",
                    message: data.message,
                  })
                );
              }
            });
          }
        } catch (error) {
          console.error(
            "Invalid WebSocket message:",
            error
          );
        }
      });

      socket.on("close", () => {
        console.log("WebSocket client disconnected");
      });
    });
  } catch (error) {
    console.error("Server failed to start:", error);
  }
}

startServer();

