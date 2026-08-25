import React from "react";


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
  socket:React.RefObject<WebSocket | null>;
  username: string;
  users: User[];
  messages: Message[];
}

export type OnlineUsersProps = {
  users: User[];
}



export type MessageListProps = {
  messages: Message[];
  username: string;
  onSend: (message: string) => void;
}
