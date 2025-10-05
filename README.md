<img width="2301" height="864" alt="banner" src="https://github.com/user-attachments/assets/add1034c-13ee-44a6-8042-26fcc84c91ea" />

# NexChat: Real-time Chat Application

A modern, full-stack real-time messaging application built with React frontend and Node.js backend. NexChat provides seamless real-time communication with features like instant messaging, user authentication, online status tracking, and message history.

## ✨ Features

### Frontend Features
- 🔐 **User Authentication** - Secure login and registration system
- 💬 **Real-time Messaging** - Instant message delivery using Socket.IO
- 👥 **User Management** - View online/offline status of users
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔄 **Message History** - Access to conversation history
- 📧 **Unread Messages** - Track unread message counts
- ⚡ **Live Updates** - Real-time user status and message notifications

### Backend Features
- 🚀 **Real-time messaging** using Socket.IO WebSockets
- 🔒 **JWT Authentication** for secure user sessions
- 👤 **User online/offline status** tracking
- 📨 **Message delivery status** (sent, delivered, read)
- 💾 **Conversation management** with MongoDB
- 🖼️ **User avatars** support
- 📚 **Message history** persistence
- 🔢 **Unread message counts** tracking

## 🏗️ Architecture Overview

```
    Frontend (React)          Backend (Node.js)
    Port 3000                 Port 5000
         |                         |
    ┌────┴────┐              ┌────┴────┐
    │ React   │◄────────────►│ Express │
    │ App     │   HTTP/REST  │ Server  │
    │         │              │         │
    │Socket.IO│◄────────────►│Socket.IO│
    │ Client  │  WebSockets  │ Server  │
    └─────────┘              └────┬────┘
                                  │
                              ┌───┴───┐
                              │MongoDB│
                              │Database│
                              └───────┘
```

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - Frontend framework
- **React Router DOM** (v7.9.3) - Client-side routing
- **Socket.IO Client** (v4.8.1) - Real-time communication
- **Axios** (v1.12.2) - HTTP client for API requests
- **React Testing Library** - Testing utilities
- **Create React App** - Build toolchain

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nexchat
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration:**
   
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rtc-chat
   JWT_SECRET=your_super_secret_key_change_this_in_production
   ```

5. **Start the Application:**
   
   **Terminal 1 - Backend:**
   ```bash
   cd Backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📡 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/user` | Get current user details | ✅ |

#### Request/Response Examples

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login User:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Chat Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/chat/users` | Get all users | ✅ |
| `GET` | `/api/chat/messages/:userId` | Get messages with specific user | ✅ |
| `GET` | `/api/chat/unread-count` | Get unread messages count | ✅ |
| `GET` | `/api/chat/conversations` | Get user conversations | ✅ |

## 🔌 Socket Events

### Client-to-Server Events
| Event | Description | Payload |
|-------|-------------|----------|
| `connection` | User connects to Socket.IO | - |
| `send_message` | Send new message | `{ recipientId, content }` |
| `join_room` | Join user-specific room | `{ userId }` |

### Server-to-Client Events
| Event | Description | Payload |
|-------|-------------|----------|
| `user_online` | User comes online | `{ userId, userName }` |
| `online_users` | List of online users | `[{ userId, userName }]` |
| `receive_message` | Receive new message | `{ senderId, content, timestamp }` |
| `user_offline` | User goes offline | `{ userId }` |

### Socket Connection Example
```javascript
// Client-side (React)
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Send message
socket.emit('send_message', {
  recipientId: 'user_id',
  content: 'Hello World!'
});

// Listen for messages
socket.on('receive_message', (data) => {
  console.log('New message:', data);
});
```

## 📁 Project Structure

```
nexchat/
├── Backend/                    # Node.js Backend
│   ├── config/
│   │   └── db.js               # Database configuration
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── models/
│   │   ├── Message.js          # Message model
│   │   └── User.js             # User model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── chat.js             # Chat routes
│   ├── socket/
│   │   └── socketHandler.js    # Socket.IO event handlers
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js              # Backend entry point
│
├── frontend/                   # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Authentication components
│   │   │   │   ├── Login.jsx   # Login form
│   │   │   │   └── Register.jsx # Registration form
│   │   │   └── Chat/           # Chat-related components
│   │   │       ├── ChatScreen.jsx   # Main chat interface
│   │   │       ├── ChatWindow.jsx   # Message display area
│   │   │       ├── MessageInput.jsx # Message input component
│   │   │       └── Sidebar.jsx      # User list and conversations
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication state management
│   │   ├── services/
│   │   │   ├── api.js             # API service functions
│   │   │   └── socket.js          # Socket.IO configuration
│   │   ├── App.jsx                # Main application component
│   │   └── index.js              # Frontend entry point
│   └── package.json            # Frontend dependencies
│
└── README.md                   # Project documentation
```

## 🛠️ Development

### Code Style & Best Practices

**Frontend (React):**
- Functional components with hooks
- Context API for state management
- Modern ES6+ JavaScript syntax
- Component-based architecture
- Responsive design principles

**Backend (Node.js):**
- RESTful API design
- JWT-based authentication
- MongoDB with Mongoose ODM
- Socket.IO for real-time features
- Environment-based configuration

### Available Scripts

**Frontend:**
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run eject      # Eject from Create React App
```

**Backend:**
```bash
npm run dev        # Start with nodemon (development)
npm start          # Start production server
npm test           # Run tests (if configured)
```

### Testing

**Frontend Testing:**
```bash
cd frontend
npm test
```

**Backend Testing:**
```bash
cd Backend
npm test
```

## 🚀 Deployment

### Frontend Deployment

1. **Build the React app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to hosting platforms:**
   - **Netlify:** Connect repository and deploy from `frontend/build`
   - **Vercel:** Deploy with automatic builds
   - **GitHub Pages:** Use `gh-pages` package
   - **AWS S3:** Upload build folder to S3 bucket

### Backend Deployment

1. **Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Deploy to platforms:**
   - **Heroku:** Connect repository and deploy
   - **Railway:** One-click deployment
   - **DigitalOcean:** Use App Platform
   - **AWS:** Use Elastic Beanstalk or EC2

### Docker Deployment (Optional)

Create `Dockerfile` for containerized deployment:

**Frontend Dockerfile:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation for new features
- Ensure responsive design compatibility
- Test both frontend and backend changes

## 🐛 Issues & Troubleshooting

### Common Issues

**Frontend won't start:**
- Check Node.js version (should be v14+)
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check for port conflicts (default: 3000)

**Backend connection issues:**
- Verify MongoDB is running
- Check `.env` configuration
- Ensure port 5000 is available
- Verify JWT_SECRET is set

**Socket.IO connection problems:**
- Check CORS configuration
- Verify backend is running before frontend
- Check browser console for WebSocket errors

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Review the troubleshooting section above
3. Search existing GitHub issues
4. Create a new issue with detailed information

## 📋 Roadmap

### Planned Features
- [ ] File sharing and media uploads
- [ ] Group chat functionality
- [ ] Message encryption
- [ ] Push notifications
- [ ] Dark/Light theme toggle
- [ ] Message reactions and emojis
- [ ] Voice and video calling
- [ ] Message search functionality
- [ ] User presence indicators
- [ ] Mobile app (React Native)

### Recent Updates
- ✅ Real-time messaging
- ✅ User authentication
- ✅ Online/offline status
- ✅ Message history
- ✅ Responsive design

## 📜 License

This project is licensed under the **ISC License**. See the LICENSE file for details.

## 🚀 About NexChat

NexChat is a modern real-time messaging application built to demonstrate full-stack development skills with React and Node.js. It showcases:

- Modern web development practices
- Real-time communication with WebSockets
- RESTful API design
- React hooks and Context API
- JWT authentication
- MongoDB integration
- Responsive web design

---

**Made with ❤️ by Shubham Ashish**

*Star ⭐ this repository if you found it helpful!*

