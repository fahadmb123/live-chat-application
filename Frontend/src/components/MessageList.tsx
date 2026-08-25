import { useState } from "react";
import type { MessageListProps } from "../types/app.type";


function MessageList({messages,username,onSend,}: MessageListProps) {

  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    onSend(message);

    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <main className="messages-panel">

      <div className="messages">

        {messages.length === 0 && (
          <div className="empty-message">
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((item, index) => {
          const isMine = item.username === username;

          return (
            <div
              className={`message ${
                isMine ? "my-message" : "other-message"
              }`}
              key={index}
            >
              <div className="message-username">
                {item.username}
              </div>

              <div className="message-text">
                {item.message}
              </div>
            </div>
          );
        })}

      </div>

      <div className="message-input">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </main>
  );
}

export default MessageList;