import MessageList from "./MessageList";
import OnlineUsers from "./OnlineUsers";
import type { ChatProps } from "../types/app.type";

function Chat({
  channel,
  username,
  users,
  messages,
}: ChatProps) {
  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    try {
 
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: username,
          username,
          message: trimmedMessage,
        }),
      });

      const data: {
        success: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !data.success) {
        console.error(
          data.message ?? "Failed to save message"
        );
        return;
      }

      await channel.publish("message", {
        userId: username,
        username,
        message: trimmedMessage,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div>
          <h1>Live Chat</h1>

          <p>
            You are chatting as{" "}
            <strong>{username}</strong>
          </p>
        </div>

        <div className="online-count">
          🟢 {users.length} online
        </div>
      </header>

      <div className="chat-container">
        <OnlineUsers users={users} />

        <MessageList
          messages={messages}
          username={username}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;