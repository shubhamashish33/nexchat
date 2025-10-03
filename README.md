# NexChat: Real-time Chat Application Backend

A real-time chat application backend built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- Real-time messaging using Socket.IO
- User authentication with JWT
- User online/offline status tracking
- Message delivery status (sent, delivered, read)
- Conversation management
- User avatars
- Message history
- Unread message counts

## Architecture Visualization
                Port 5000
                     |
              HTTP Server (server)
                     |
        ┌────────────┴────────────┐
        |                         |
    Express App                Socket.IO
    (REST APIs)              (WebSockets)
        |                         |
    /api/auth/*              Real-time events
    /api/chat/*              (messages, typing)

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- bcrypt.js

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- MongoDB
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```sh
cd Backend
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rtc-chat
JWT_SECRET=your_super_secret_key_change_this_in_production
```

4. Start the development server:
```sh
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user details

### Chat
- `GET /api/chat/users` - Get all users
- `GET /api/chat/messages/:userId` - Get messages with specific user
- `GET /api/chat/unread-count` - Get unread messages count
- `GET /api/chat/conversations` - Get user conversations

## Socket Events

### Client Events
- `connection` - User connects
- `send_message` - Send new message

### Server Events
- `user_online` - User comes online
- `online_users` - List of online users
- `receive_message` - Receive new message

## Project Structure

```
Backend/
├── config/
│   └── db.js          # Database configuration
├── middleware/
│   └── auth.js        # Authentication middleware
├── models/
│   ├── Message.js     # Message model
│   └── User.js        # User model
├── routes/
│   ├── auth.js        # Authentication routes
│   └── chat.js        # Chat routes
├── socket/
│   └── socketHandler.js # Socket.IO event handlers
├── .env               # Environment variables
├── package.json       # Project dependencies
└── server.js         # Entry point
```

## License

This project is licensed under the ISC License.

