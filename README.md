# Live Chat Application

## Link : https://live-chat-application-spqn.vercel.app/

A real-time chat application built with **React, TypeScript, Node.js, Express, WebSocket, and MongoDB**.

Users can join the chat using a username, see currently online users, send messages in real time, and view previously stored messages.

## Features

* User join system
* Real-time messaging using WebSocket
* Online users tracking
* MongoDB message storage
* Fetch previous messages when the application loads
* Automatic message broadcasting to connected users
* Responsive chat UI
* Dark mode support
* Automatic message cleanup every 24 hours
* REST API for message management

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS
* WebSocket

### Backend

* Node.js
* Express.js
* TypeScript
* WebSocket (`ws`)
* MongoDB
* Mongoose

## Application Flow

```text
User
  ↓
React Frontend
  ↓
REST API ─────────→ Express Backend ─────────→ MongoDB
  │
  └──────────────→ WebSocket ────────────────→ Other Users
```

### Message Flow

```text
User sends message
        ↓
Frontend
        ↓
POST /api/messages
        ↓
Express Backend
        ↓
MongoDB
        ↓
WebSocket broadcast
        ↓
All connected users
        ↓
Message appears in UI
```

## API Endpoints

### Get Messages

```http
GET /api/messages
```

Returns all stored chat messages.

### Create Message

```http
POST /api/messages
```

Request body:

```json
{
  "userId": "user123",
  "username": "Fahad",
  "message": "Hello everyone!"
}
```

## WebSocket Events

### New Message

```json
{
  "type": "new_message",
  "message": {
    "userId": "user123",
    "username": "Fahad",
    "message": "Hello everyone!"
  }
}
```

The backend broadcasts the message to all connected WebSocket clients.

## Database

The application uses **MongoDB** with **Mongoose**.

### Message

```text
Message
├── userId
├── username
├── message
└── createdAt
```

Messages are stored in MongoDB and retrieved when the application starts.

## Automatic Message Cleanup

A scheduled cron job clears the message collection every 24 hours.

```text
Every 24 hours
      ↓
Cron Job
      ↓
Message.deleteMany({})
      ↓
Messages collection cleared
```

## Environment Variables

### Backend

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Frontend

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

For production, replace the local URLs with the deployed backend URLs.

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Project Structure

```text
Live-Chat-Application
│
├── Backend
│   ├── src
│   │   ├── db
│   │   │   └── connection.ts
│   │   │
│   │   ├── models
│   │   │   ├── Message.ts
│   │   │   └── User.ts
│   │   │
│   │   └── server.ts
│   │
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Chat.tsx
│   │   │   ├── JoinChat.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── OnlineUsers.tsx
│   │   │
│   │   ├── types
│   │   │   └── app.type.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
└── README.md
```

## Deployment

The frontend and backend can be deployed separately.

```text
Frontend
React + Vite
     ↓
Vercel

Backend
Node.js + Express + WebSocket
     ↓
Vercel / Server Hosting

Database
MongoDB Atlas
```

## Future Improvements

* User authentication
* Private messaging
* Chat rooms
* Message deletion
* Message editing
* Typing indicators
* Read receipts
* Image and file sharing
* Persistent online user tracking
* Better WebSocket reconnection handling

## Author

**Fahad MB**

A full-stack real-time chat application built for learning and practicing **React, Node.js, WebSocket communication, REST APIs, and MongoDB**.
