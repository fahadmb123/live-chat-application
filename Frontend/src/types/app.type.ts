export type Message = {
  message: string;
}
export type JoinChatProps = {
  onJoin: (username: string) => void;
  error: string;
}