import { useEffect, useRef, useState } from "react";
import type { User, Message } from "./types/app.type";
import JoinChat from "./components/JoinChat";
import Chat from "./components/Chat";
import "./App.css";

type MessagesResponse = {
  success: boolean;
  messages: Message[];
  message?: string;
};

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`)

        const data: MessagesResponse = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message ?? "Failed to load messages");
          return;
        }

        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setError("Failed to load messages");
      }
    };

    loadMessages();
  }, []);


  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("Received from WebSocket:", data);

        if (data.type === "new_message") {
          setMessages((previousMessages) => [
            ...previousMessages,
            data.message,
          ]);
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, []);

  const joinChat = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Username is required");
      return;
    }

    setError("");

    const user: User = {
      userId: trimmedName,
      username: trimmedName,
    };

    setUsername(trimmedName);

    setUsers((previousUsers) => {
      const alreadyExists = previousUsers.some(
        (existingUser) =>
          existingUser.username === trimmedName
      );

      if (alreadyExists) {
        return previousUsers;
      }

      return [...previousUsers, user];
    });
  };

  if (!username) {
    return (
      <JoinChat
        onJoin={joinChat}
        error={error}
      />
    );
  }

  return (
    <Chat
      username={username}
      users={users}
      messages={messages}
      socketRef={socketRef}
    />
  );
}

export default App;