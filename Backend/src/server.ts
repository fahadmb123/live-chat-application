import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
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