//import React from "react";
import type { RealtimeChannel } from "ably";

export type JoinChatProps = {
  onJoin: (username: string) => void;
  error: string;
}


export type User = {
  userId: string;
  username: string;
};

export type Message = {
  userId?: string;
  username?: string;
  message: string;
  createdAt?: string;
};

export type ChatProps = {
  channel: RealtimeChannel;
  username: string;
  users: User[];
  messages: Message[];
};

export type OnlineUsersProps = {
  users: User[];
}



export type MessageListProps = {
  messages: Message[];
  username: string;
  onSend: (message: string) => void;
}
