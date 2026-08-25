import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import cron from "node-cron";
import { Message } from "./models/Message.js";

dotenv.config()

const app = express()


const dns = require("dns")
console.log(dns.getServers());
dns.setServers(["8.8.8.8", "8.8.4.4"]);



app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  })
})

const startServer = async () => {
  await connectDB()

  console.log("Backend started")
};

startServer()

cron.schedule("0 0 * * *", async () => {
  try {
    await Message.deleteMany({});

    console.log("Messages cleared for the new day");
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
})

export default app;