import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";

const Chat = ({
  isOpen,
  onClose,
  socket,
  roomId,
  userName,
  role,
  onNewMessage,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      // Notify parent component about new message if chat is closed
      if (
        !isOpen &&
        message.sender !== (role === "interviewer" ? "Interviewer" : userName)
      ) {
        onNewMessage();
      }
    };

    socket.on("chat-message", handleChatMessage);

    return () => {
      socket.off("chat-message");
    };
  }, [socket, isOpen, userName, role, onNewMessage]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      sender: role === "interviewer" ? "Interviewer" : userName,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("send-message", { message: messageData, roomId });
    setNewMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-20 w-80 bg-white rounded-lg shadow-lg flex flex-col h-96 border border-gray-200 z-50">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700">Chat</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold text-sm text-blue-600">
                {message.sender}
              </span>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
            <p className="text-gray-700 ml-2 mt-1">{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

// Create a separate ChatButton component for better organization
const ChatButton = ({ onClick, isOpen, hasUnreadMessages }) => {
  const [showToolbar, setShowToolbar] = useState(null);

  const handleHover = (buttonType) => {
    setShowToolbar(buttonType);
  };

  const handleMouseLeave = () => {
    setShowToolbar(null);
  };
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onMouseEnter={() => handleHover("chat")}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors text-gray-600 hover:bg-blue-500 hover:text-white`}
      >
        <MessageSquare size={18} />
      </button>
      {showToolbar === "chat" && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
          Chat
        </div>
      )}
      {hasUnreadMessages && !isOpen && (
        <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-ping absolute"></div>
          <span className="text-white text-xs">!</span>
        </div>
      )}
    </div>
  );
};

export { Chat, ChatButton };
