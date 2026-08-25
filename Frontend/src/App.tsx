import { useEffect, useRef, useState } from "react";
import type { Message } from "./types/app.type";
import "./App.css";






function App() {
    const socket  = useRef<WebSocket | null>(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<string[]>([])



    useEffect(() => {
      const newSocket = new WebSocket("ws://localhost:8080")
      socket.current = newSocket
      newSocket.addEventListener("open", () => {
        console.log("Connected to chat server")
      })
      newSocket.addEventListener("message", (event) => {
        const data: Message = JSON.parse(event.data)
        setMessages((previousMessages) => [
          ...previousMessages,
          data.message,
        ])
      })
      newSocket.addEventListener("close", () => {
        console.log("Disconnected")
      })
    
      return () => {
        newSocket.close()
      }
    }, [])




    const sendMessage = () => {
      if (!socket || !message.trim()) {
        return
      }
      socket.current?.send(
        JSON.stringify({
          message,
        })
      )
      setMessage("");
    }


    return (
      <div className="chat">
        <h1>Real-Time Chat</h1>

        <div className="messages">
          {messages.map((message, index) => (
            <div className="message" key={index}>
              {message}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type a message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    )
}

export default App;