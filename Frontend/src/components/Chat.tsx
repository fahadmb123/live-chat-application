import MessageList from "./MessageList";
import OnlineUsers from "./OnlineUsers";
import type {ChatProps } from "../types/app.type"




function Chat({
  socket,
  username,
  users,
  messages,
}: ChatProps) {
  const sendMessage = (message: string) => {
    if (!socket || !message.trim()) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "message",
        message: message.trim(),
      })
    );
  };

  return (
    <div className="chat-page">

      <header className="chat-header">
        <div>
          <h1>Live Chat</h1>
          <p>
            You are chatting as <strong>{username}</strong>
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

export default Chat