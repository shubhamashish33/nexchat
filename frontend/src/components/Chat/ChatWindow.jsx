import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChatWindow = ({ messages, selectedUser, onlineUsers, typingUser }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getInitials = (username) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (!selectedUser) {
    return (
      <div className="chat-window">
        <div className="empty-chat">
          <div className="empty-chat-icon">💬</div>
          <h3>Select a conversation</h3>
          <p>Choose a user from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-avatar">
          {getInitials(selectedUser.username)}
        </div>
        <div className="chat-header-info">
          <h3>{selectedUser.username}</h3>
          <div className="chat-header-status">
            {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = msg.sender._id === user.id || msg.sender._id === user._id;
            return (
              <div key={msg._id} className={`message ${isSent ? 'sent' : 'received'}`}>
                <div className="message-avatar">
                  {getInitials(isSent ? user.username : selectedUser.username)}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  <div className="message-time">
                    {formatTime(msg.createdAt)}
                    {isSent && (
                      <span className="message-status" style={{
                        color: msg.status === 'read' ? '#4caf50' : 'inherit'
                      }}>
                        {getStatusIcon(msg.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {typingUser === selectedUser._id && (
          <div className="typing-indicator">
            {selectedUser.username} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;