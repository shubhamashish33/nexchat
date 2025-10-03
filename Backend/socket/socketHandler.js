const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

const activeUsers = new Map();

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decode.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    activeUsers.set(socket.userId, socket.id);

    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date(),
    });

    socket.brodcast.emit("user_online", { userId: socket.userId });

    const onlineUserIds = Array.from(activeUsers.keys());
    socket.emit("online_users", onlineUserIds);

    socket.on("send_message", async (data, callback) => {
      try {
        const { receiverId, content } = data;

        const message = await Message.create({
          sender: socket.id,
          receiver: receiverId,
          content: content,
          status: "sent",
        });

        await message.populate("sender", "username avatar");
        await message.populate("receiver", "username avatar");

        const receiverSocketId = activeUsers.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);

          message.status = "delivered";
          await message.save();
        }

        if (callback) {
          callback({ success: true, message });
        }
      } catch (error) {
        console.error("Send message error: ", error.message);
        if (callback) {
          callback({ success: false, error: error.message });
        }
      }
    });
  });
};
