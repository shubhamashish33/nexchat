const express = require("express");
const User = require("../models/User");
const Message = require("../models/Message");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/chat/users
// @desc    Get all users except current user
// @access  Private

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select("-password")
      .sort({ isOnline: -1, lastSeen: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/chat/messages/:userId
// @desc    Get all messages between current user and specified user
// @access  Private

router.get("/messages/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const message = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate("sender", "username avatar isOnline")
      .populate("receiver", "username avatar isOnline")
      .sort({ createdAt: -1 });

    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        status: "sent",
      },
      { status: "delivered" }
    );

    res.json(message);
  } catch (error) {
    console.error("Get Message error", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get count of unread messages for current user
// @access  Private
router.get("/unread-count", auth, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.userId,
      status: { $in: ["sent", "delivered"] },
    });

    res.json({ count: unreadCount });
  } catch (error) {
    console.error("Get unread count error: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get list of users with whom current user has conversations
// @access  Private
router.get("/conversations", auth, async (req, res) => {
  try {
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate("sender", "username avatar isOnline lastSeen")
      .populate("receiver", "username avatar isOnline lastSeen")
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach((message) => {
      const otherUser =
        message.sender._id.toString() === currentUserId
          ? message.receiver
          : message.sender;

      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    for (let conversation of conversations) {
      const unreadCount = await Message.countDocuments({
        sender: conversation.user._id,
        receiver: currentUserId,
        status: { $in: ["sent", "delivered"] },
      });
      conversation.unreadCount = unreadCount;
    }

    conversations.sort(
      (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
    );

    res.json(conversations);
  } catch (error) {
    console.error();
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
