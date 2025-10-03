require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require("cors");
const { Server } = require('socket.io');
const connectDB = require("./config/db");
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use('/api/chat', require('./routes/chat'));

app.get("/", (req, res) => {
  res.json({ messgae: "RTC Chat API is running" });
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
