import MessageList from "./MessageList";
import OnlineUsers from "./OnlineUsers";
import type { ChatProps } from "../types/app.type";

function Chat({
  username,
  users,
  messages,
  socketRef,
}: ChatProps) {
  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: username,
            username,
            message: trimmedMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(
          data.message ?? "Failed to save message"
        );
        return;
      }

      console.log("Saved in MongoDB:", data.data);

      if (
        socketRef.current &&
        socketRef.current.readyState ===
          WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "new_message",
            message: data.data,
          })
        );
      }
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
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
            .       .........   .  In every 24 Hr we will clear the Messages
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