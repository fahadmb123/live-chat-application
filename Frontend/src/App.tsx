import { useEffect, useRef, useState } from "react";
import type { User, Message } from "./types/app.type";
import JoinChat from "./components/JoinChat";
import Chat from "./components/Chat";
import "./App.css";

function App() {
  const socket = useRef<WebSocket | null>(null);

  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.current = newSocket;

    newSocket.addEventListener("open", () => {
      console.log("Connected to WebSocket server");

   
      newSocket.send(
        JSON.stringify({
          type: "get_messages",
        })
      );
    });

    newSocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "joined") {
        setUsername(data.username);
        setError("");
      }
      if (data.type === "error") {
        setError(data.message);
      }
      if (data.type === "users") {
        setUsers(data.users);
      }
      if (data.type === "messages") {
        setMessages(data.messages);
      }
      if (data.type === "message") {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            userId: data.userId,
            username: data.username,
            message: data.message,
            createdAt: data.createdAt,
          },
        ]);
      }
    });

    newSocket.addEventListener("close", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinChat = (name: string) => {
    if (!socket.current) {
      return;
    }

    socket.current.send(
      JSON.stringify({
        type: "join",
        username: name,
      })
    );
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
      socket={socket}
      username={username}
      users={users}
      messages={messages}
    />
  );
}

export default App;