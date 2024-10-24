
// src/components/StartInterviewtwo.jsx

//updated control panel UI

import React, { useState, useEffect } from 'react';
import { UserX, Users } from 'lucide-react';
import VideoChat from './VideoChat';

export default function StartInterviewTwo() {
  const [roomId, setRoomId] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [participants, setParticipants] = useState(new Map());
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    fetch('/api/get-ip')
      .then(response => response.text())
      .then(ip => setIpAddress(ip))
      .catch(error => console.error('Error fetching IP:', error));
  }, []);

  const startInterview = () => {
    if (roomId) {
      setInterviewStarted(true);
    } else {
      alert('Please enter a room ID');
    }
  };

  const handleParticipantsUpdate = (newParticipants) => {
    setParticipants(newParticipants);
  };

  const handleRemoveParticipant = (participantId) => {
    setSelectedParticipant(participantId);
  };

  const getParticipantCount = () => {
    const count = Array.from(participants.entries()).filter(([_, name]) => name !== 'Interviewer').length;
    return count;
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Start Interview</h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                Room ID
              </label>
              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <button
              onClick={startInterview}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <VideoChat
          roomId={roomId}
          role="interviewer"
          serverIP={ipAddress}
          onParticipantsUpdate={handleParticipantsUpdate}
          onRemoveParticipant={handleRemoveParticipant}
          selectedParticipant={selectedParticipant}
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Interview Controls</h2>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2" />
            <span>{getParticipantCount()} Participant{getParticipantCount() !== 1 ? 's' : ''}</span>
          </div>
          <div className="mt-2 px-3 py-1 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">Room ID: {roomId}</p>
          </div>
        </div>

        {/* Participants List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {Array.from(participants.entries()).filter(([_, name]) => name !== 'Interviewer').length > 0 ? (
              Array.from(participants.entries()).map(([id, name]) => (
                name !== 'Interviewer' && (
                  <div
                    key={id}
                    className={`group relative rounded-lg border ${
                      selectedParticipant === id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    } transition-colors`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Participant</p>
                        </div>
                        <button
                          onClick={() => handleRemoveParticipant(id)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-full text-red-500 transition-all"
                          title="Remove participant"
                        >
                          <UserX size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="text-center py-8">
                <Users size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Waiting for participants to join...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Click on a participant card to select them
          </p>
        </div>
      </div>
    </div>
  );
}