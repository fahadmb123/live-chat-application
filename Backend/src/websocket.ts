import { WebSocketServer, WebSocket } from "ws";
import { User } from "./models/User";
import { Message } from "./models/Message";

const wss = new WebSocketServer({
  port: 8080,
});

console.log("WebSocket server running on port 8080");

wss.on("connection", (socket) => {
  console.log("New WebSocket connection");

  let userId: string | null = null;
  let username: string | null = null;

  socket.on("message", async (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());
      if (data.type === "get_messages") {
        const messages = await Message.find()
          .sort({ createdAt: 1 })
          .lean();
        socket.send(
          JSON.stringify({
            type: "messages",
            messages: messages.map((message) => ({
              userId: message.userId.toString(),
              username: message.username,
              message: message.message,
              createdAt: message.createdAt,
            })),
          })
        )
        return
      }
      if (data.type === "join") {
        const enteredUsername = data.username.trim();

        if (!enteredUsername) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Username is required",
            })
          );

          return;
        }

        const existingUser = await User.findOne({
          username: enteredUsername,
        })

        if (existingUser) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Username already taken",
            })
          )

          return
        }

        const user = await User.create({
          username: enteredUsername,
        });

        userId = user._id.toString()
        username = user.username

        socket.send(
          JSON.stringify({
            type: "joined",
            userId,
            username,
          })
        );

        await broadcastUsers()

        console.log(`${username} joined the chat`)
      }

      if (data.type === "message") {
        if (!userId || !username) {
          return;
        }

        const messageText = data.message.trim();

        if (!messageText) {
          return;
        }

        const newMessage = await Message.create({
          userId,
          username,
          message: messageText,
        });

        broadcast({
          type: "message",
          userId,
          username,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  })



  socket.on("close", async () => {
    console.log(`${username ?? "Unknown user"} disconnected`);

    if (userId) {
      await User.findByIdAndDelete(userId)

      await broadcastUsers()
    }
  })
})

function broadcast(data: object) {
  const message = JSON.stringify(data)

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}



async function broadcastUsers() {
  const users = await User.find()
    .select("_id username")
    .lean();

  broadcast({
    type: "users",
    users: users.map((user) => ({
      userId: user._id.toString(),
      username: user.username,
    })),
  })
}