
import React, { useState, useRef } from 'react';
import { HelpCircle, X, ChevronDown, ChevronUp, GripHorizontal } from 'lucide-react';

const Questions = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 400 });
  const [size, setSize] = useState({ width: 384, height: 400 }); // Initial size (384px = w-96)
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dragRef = useRef(null);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });

  const questions = [
    {
      id: 1,
      question: "What is your experience with React and its ecosystem?",
      answer: "Look for knowledge of: React hooks, state management (Redux/Context), component lifecycle, virtual DOM, and popular React libraries. Also assess their understanding of React best practices and performance optimization."
    },
    {
      id: 2,
      question: "Can you explain the concept of closures in JavaScript?",
      answer: "Candidate should explain: A closure is the combination of a function and the lexical environment within which that function was declared. They should discuss scope, practical uses of closures, and potential memory considerations."
    },
    {
      id: 3,
      question: "How do you handle error boundaries in React applications?",
      answer: "Listen for: Understanding of React's error boundary components, how they catch JavaScript errors, their limitations (async code, event handlers), and how to implement fallback UI. Also discuss error logging and monitoring strategies."
    },
    {
      id: 1,
      question: "What is your experience with React and its ecosystem?",
      answer: "Look for knowledge of: React hooks, state management (Redux/Context), component lifecycle, virtual DOM, and popular React libraries. Also assess their understanding of React best practices and performance optimization."
    },
    {
      id: 2,
      question: "Can you explain the concept of closures in JavaScript?",
      answer: "Candidate should explain: A closure is the combination of a function and the lexical environment within which that function was declared. They should discuss scope, practical uses of closures, and potential memory considerations."
    },
    {
      id: 3,
      question: "How do you handle error boundaries in React applications?",
      answer: "Listen for: Understanding of React's error boundary components, how they catch JavaScript errors, their limitations (async code, event handlers), and how to implement fallback UI. Also discuss error logging and monitoring strategies."
    }
  ];

  // Dragging handlers
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

  // Resize handler
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
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'auto',
        zIndex: isActive ? 9999 : 50,
        transition: 'box-shadow 0.2s ease-in-out',
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
          <GripHorizontal size={18} className={`${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-800">Interview Questions</h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto" style={{ height: `calc(100% - 60px)` }}>
        {questions.map((item, index) => (
          <div key={item.id} className="border-b border-gray-100 last:border-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedIndex(expandedIndex === index ? null : index);
              }}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-700">{item.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>
            {expandedIndex === index && (
              <div
                className="px-4 py-3 bg-gray-50 text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

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

export default Questions;
