import { useState } from "react";
import type { JoinChatProps } from "../types/app.type";


function JoinChat({ onJoin, error }: JoinChatProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!username.trim()) {
      return;
    }

    onJoin(username.trim())
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <h1>Live Chat</h1>

        <p>Enter a username to join the chat</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <button type="submit">
            Join Chat
          </button>
        </form>

        {error && (
          <p className="error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default JoinChat