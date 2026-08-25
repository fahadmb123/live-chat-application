import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import "./websocket.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  console.log("Backend started");
};

startServer()