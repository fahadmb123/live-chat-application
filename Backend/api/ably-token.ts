import Ably from "ably";

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const apiKey = process.env.ABLY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "ABLY_API_KEY is not configured",
      });
    }

    const ably = new Ably.Rest(apiKey);

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: "chat-user",
      capability: JSON.stringify({
        "chat-room": ["publish", "subscribe", "presence"],
      }),
    });

    return res.status(200).json(tokenRequest);
  } catch (error) {
    console.error("Ably token error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Ably token",
    });
  }
}