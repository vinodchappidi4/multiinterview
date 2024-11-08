
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, GripHorizontal } from 'lucide-react';

const Chat = ({ isOpen, onClose, socket, roomId, userName, role, onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dragRef = useRef(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 384, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const initialSize = useRef({ width: 0, height: 0 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (message) => {
      setMessages(prev => [...prev, message]);
      // Notify parent component about new message if chat is closed
      if (!isOpen && message.sender !== (role === 'interviewer' ? 'Interviewer' : userName)) {
        onNewMessage();
      }
    };

    socket.on('chat-message', handleChatMessage);

    return () => {
      socket.off('chat-message');
    };
  }, [socket, isOpen, userName, role, onNewMessage]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      sender: role === 'interviewer' ? 'Interviewer' : userName,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit('send-message', { message: messageData, roomId });
    setNewMessage('');
  };

  const handleMouseDown = (e) => {
    if (e.target === dragRef.current) {
      setIsDragging(true);
      initialMousePos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - initialMousePos.current.x;
      const newY = e.clientY - initialMousePos.current.y;
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    } else if (isResizing) {
      const newWidth = initialSize.current.width + (e.clientX - initialMousePos.current.x);
      const newHeight = initialSize.current.height + (e.clientY - initialMousePos.current.y);
      
      // Minimum size constraints
      const minWidth = 300;
      const minHeight = 200;
      
      // Maximum size constraints
      const maxWidth = window.innerWidth - position.x;
      const maxHeight = window.innerHeight - position.y;

      setSize({
        width: Math.min(Math.max(minWidth, newWidth), maxWidth),
        height: Math.min(Math.max(minHeight, newHeight), maxHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { width: size.width, height: size.height };
  };

  // Handle click anywhere on the component to bring it to front
  const handleComponentClick = () => {
    setIsActive(true);
  };

  // Handle click outside to remove active state
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dragRef.current && !dragRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add event listeners when dragging starts
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (!isOpen) return null;

  return (
    <div
    className="fixed right-4 bottom-20 w-80 bg-white rounded-lg shadow-lg flex flex-col h-96 border border-gray-200"
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      cursor: isDragging ? 'grabbing' : 'auto',
      zIndex: isActive ? 9999 : 50, // Higher z-index when active
      transition: 'box-shadow 0.2s ease-in-out', // Smooth transition for shadow
      boxShadow: isActive 
        ? '0 0 0 2px rgba(59, 130, 246, 0.5), 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}
    onClick={handleComponentClick}
  >
    <div
      ref={dragRef}
      className={`flex justify-between items-center p-4 border-b border-gray-200 cursor-grab active:cursor-grabbing ${
        isActive ? 'bg-blue-50' : 'bg-gray-50'
      }`}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-2">
        <GripHorizontal size={18} className="text-gray-400" />
        <h3 className="font-semibold text-gray-700">Chat</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering handleComponentClick
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Container */}
      {/* <div className="flex-1 overflow-y-auto p-4 space-y-4"> */}
      <div className="overflow-y-auto" style={{ height: `calc(100% - 60px)` }}>
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
   {/* Resize handle */}
   <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #cbd5e1 50%)',
          borderBottomRightRadius: '0.5rem'
        }}
      />
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
        onMouseEnter={() => handleHover('chat')}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
          isOpen 
            ? 'text-blue-600 bg-blue-200 hover:bg-blue-500 hover:text-white' 
            : 'text-gray-600 hover:bg-blue-500 hover:text-white'
        }`}
      >
        <MessageSquare size={18} />
      </button>
      {showToolbar === 'chat' && (
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
