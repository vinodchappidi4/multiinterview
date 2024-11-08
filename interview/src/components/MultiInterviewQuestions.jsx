import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Questions = ({ isOpen, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Hardcoded questions and answers
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
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-20 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Interview Questions</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {questions.map((item, index) => (
          <div key={item.id} className="border-b border-gray-100 last:border-0">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
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
              <div className="px-4 py-3 bg-gray-50 text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
