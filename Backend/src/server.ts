import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend started",
  });
});

export default app;