import { useEffect, useState } from "react";
import type { User, Message } from "./types/app.type";
import JoinChat from "./components/JoinChat";
import Chat from "./components/Chat";
import { chatChannel } from "./services/ably";
import type { Message as AblyMessage } from "ably";
import "./App.css";

type RealtimeMessage = {
  userId: string;
  username: string;
  message: string;
  createdAt: string;
};

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

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch("/api/messages");

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
    const handleMessage = (event: AblyMessage) => {
      if (!event.data) {
        return;
      }

      const data = event.data as RealtimeMessage;

      const newMessage: Message = {
        userId: data.userId,
        username: data.username,
        message: data.message,
        createdAt: data.createdAt,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);
    };

    chatChannel.subscribe("message", handleMessage);

    return () => {
      chatChannel.unsubscribe("message", handleMessage);
    };
  }, []);

 
  const joinChat = async (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Username is required");
      return;
    }

    try {
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

      
      await chatChannel.publish("user_joined", {
        userId: trimmedName,
        username: trimmedName,
      });
    } catch (error) {
      console.error("Failed to join chat:", error);
      setError("Unable to join chat");
    }
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
      channel={chatChannel}
    />
  );
}

export default App;