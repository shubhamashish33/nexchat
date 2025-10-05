import { useState, useEffect } from "react";
import { chatAPI } from "../../services/api";
import socketService from "../../services/socket";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    loadUsers();
    setupSocketListeners();

    return () => {
      socketService.off("receive_message");
      socketService.off("user_online");
      socketService.off("user_offline");
      socketService.off("online_users");
      socketService.off("messages_read");
      socketService.off("user_typing");
      socketService.off("user_stop_typing");
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser._id);
      socketService.markAsRead(selectedUser._id);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const response = await chatAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await chatAPI.getMessages(userId);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const setupSocketListeners = () => {
    socketService.onReceiveMessage((message) => {
      setMessages((prev) => [...prev, message]);

      if (selectedUser && message.sender._id === selectedUser._id) {
        socketService.markAsRead(selectedUser._id);
      }
    });

    socketService.onUserOnline((data) => {
      setOnlineUsers((prev) => [...prev, data.userId]);

      setUsers((prev) =>
        prev.map((u) => (u._id === data.userId ? { ...u, isOnline: true } : u))
      );
    });

    socketService.onUserOffline((data) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));

      setUsers((prev) =>
        prev.map((u) => (u._id === data.userId ? { ...u, isOnline: false } : u))
      );
    });

    socketService.onOnlineUsers((userIds) => {
      setOnlineUsers(userIds);
    });

    socketService.onMessagesRead((data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiver._id === data.readBy || msg.receiver === data.readBy
            ? { ...msg, status: "read" }
            : msg
        )
      );
    });

    socketService.onUserTyping((data) => {
      setTypingUser(data.userId);
    });

    socketService.onUserStopTyping((data) => {
      setTypingUser(null);
    });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (content) => {
    if (!selectedUser) return;

    socketService.sendMessage(selectedUser._id, content, (response) => {
      if (response.success) {
        setMessages((prev) => [...prev, response.message]);
      } else {
        console.error("Error sending message:", response.error);
      }
    });
  };

  const handleTyping = () => {
    if (selectedUser) {
      socketService.startTyping(selectedUser._id);
    }
  };

  const handleStopTyping = () => {
    if (selectedUser) {
      socketService.stopTyping(selectedUser._id);
    }
  };

  return (
    <div className="chat-container">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onlineUsers={onlineUsers}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatWindow
          messages={messages}
          selectedUser={selectedUser}
          onlineUsers={onlineUsers}
          typingUser={typingUser}
        />
        {selectedUser && (
          <MessageInput
            onSend={handleSendMessage}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
          />
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
