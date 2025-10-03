const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const activeUsers = new Map();

const socketHandler = (io) => {
  
  // Middleware: Authenticate socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId || decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: ' + error.message));
    }
  });

  // Handle socket connections
  io.on('connection', async (socket) => {
    console.log(`✅ User connected: ${socket.userId} (Socket ID: ${socket.id})`);

    // Add user to active users
    activeUsers.set(socket.userId, socket.id);

    // Update user status to online
    await User.findByIdAndUpdate(socket.userId, { 
      isOnline: true,
      lastSeen: new Date()
    });

    socket.broadcast.emit('user_online', { userId: socket.userId });

    // Send list of online users to the newly connected user
    const onlineUserIds = Array.from(activeUsers.keys());
    socket.emit('online_users', onlineUserIds);

    
    // Event: Send message
    socket.on('send_message', async (data, callback) => {
      try {
        const { receiverId, content } = data;

        // Save message to database
        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          content: content,
          status: 'sent'
        });

        // Populate sender and receiver details
        await message.populate('sender', 'username avatar');
        await message.populate('receiver', 'username avatar');

        // Check if receiver is online
        const receiverSocketId = activeUsers.get(receiverId);
        
        if (receiverSocketId) {
          // Receiver is online - deliver message
          io.to(receiverSocketId).emit('receive_message', message);
          
          // Update message status to delivered
          message.status = 'delivered';
          await message.save();
        }

        // Send acknowledgment back to sender with updated message
        if (callback) {
          callback({ success: true, message });
        }

      } catch (error) {
        console.error('❌ Send message error:', error);
        if (callback) {
          callback({ success: false, error: error.message });
        }
      }
    });


    // Event: Mark messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { senderId } = data;

        // Update all unread messages from sender to current user
        const updatedMessages = await Message.updateMany(
          { 
            sender: senderId, 
            receiver: socket.userId,
            status: { $ne: 'read' }
          },
          { status: 'read' }
        );

        // Notify sender that messages were read
        const senderSocketId = activeUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages_read', {
            readBy: socket.userId,
            count: updatedMessages.modifiedCount
          });
        }

      } catch (error) {
        console.error('❌ Mark read error:', error);
      }
    });


    // Event: Typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId: socket.userId
        });
      }
    });


    // Event: Stop typing indicator
    socket.on('stop_typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', {
          userId: socket.userId
        });
      }
    });


    // Event: Disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.userId} (Socket ID: ${socket.id})`);

      // Remove from active users
      activeUsers.delete(socket.userId);

      // Update user status to offline
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Broadcast to all users that this user is offline
      socket.broadcast.emit('user_offline', { userId: socket.userId });
    });

  });
};

module.exports = socketHandler;