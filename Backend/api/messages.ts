import { connectDB } from "../src/db/connection";
import { Message } from "../src/models/Message";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const messages = await Message.find()
        .sort({ createdAt: 1 })
        .lean();

      return res.status(200).json({
        success: true,
        messages,
      });
    }

    if (req.method === "POST") {
      const { userId, username, message } = req.body;

      if (!userId || !username || !message) {
        return res.status(400).json({
          success: false,
          message: "userId, username and message are required",
        });
      }

      const newMessage = await Message.create({
        userId,
        username,
        message,
      });

      return res.status(201).json({
        success: true,
        message: newMessage,
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Message API error:", error);

    return res.status(500).json({
      success: false,
      message: "Message API error",
    });
  }
}