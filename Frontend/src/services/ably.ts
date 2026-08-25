import * as Ably from "ably";

export const ably = new Ably.Realtime({
  authUrl: "/api/ably-token",
});

export const chatChannel = ably.channels.get("chat-room");