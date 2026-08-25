import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import cron from "node-cron"
import { Message } from "./models/Message.js";
import "./websocket.js"




const dns = require("dns")
console.log(dns.getServers());
dns.setServers(["8.8.8.8", "8.8.4.4"])

dotenv.config();

const startServer = async () => {
  await connectDB();

  console.log("Backend started");
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