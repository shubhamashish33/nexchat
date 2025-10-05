import { useState, useRef, useEffect } from "react";

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }

    if (!isTyping) {
      setIsTyping(true);
      onTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onStopTyping();
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim()) {
      onSend(message.trim());
      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      onStopTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form className="message-input-wrapper" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button type="submit" className="send-btn" disabled={!message.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
