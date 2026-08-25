import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../src/db/connection";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "Backend is running",
    });
  } catch (error) {
    console.error("Backend error:", error);

    res.status(500).json({
      success: false,
      message: "Backend error",
    });
  }
});

app.get("/api", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "Backend API is running",
    });
  } catch (error) {
    console.error("Backend error:", error);

    res.status(500).json({
      success: false,
      message: "Backend error",
    });
  }
});

export default app;