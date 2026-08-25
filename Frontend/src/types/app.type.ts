
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
  socket: WebSocket | null;
  username: string;
  users: User[];
  messages: Message[];
};