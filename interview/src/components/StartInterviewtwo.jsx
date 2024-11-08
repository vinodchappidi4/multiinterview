// src/components/StartInterviewtwo.jsx

import React, { useState, useEffect } from 'react';
import { UserX, Users, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Settings, Share2, Copy, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoChat from './VideoChat';

export default function StartInterviewTwo() {
  const [roomId, setRoomId] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [participants, setParticipants] = useState(new Map());
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [participantControls, setParticipantControls] = useState(new Map());
  const [isAllMuted, setIsAllMuted] = useState(false);
  const [isAllVideoOff, setIsAllVideoOff] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showInterviewControls, setShowInterviewControls] = useState(false);

  const toggleInterviewControls = () => {
    setShowInterviewControls(!showInterviewControls);
  };

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

  const handleMediaStateChange = (participantId, type, enabled) => {
    setParticipantControls(prev => {
      const newControls = new Map(prev);
      const currentControls = newControls.get(participantId) || { mic: true, camera: true };
      newControls.set(participantId, { ...currentControls, [type]: enabled });
      return newControls;
    });
  };

  const handleParticipantsUpdate = (newParticipants) => {
    setParticipants(newParticipants);
    newParticipants.forEach((name, id) => {
      if (name !== 'Interviewer' && !participantControls.has(id)) {
        setParticipantControls(prev => {
          const newControls = new Map(prev);
          if (!newControls.has(id)) {
            newControls.set(id, { mic: true, camera: true });
          }
          return newControls;
        });
      }
    });
  };

  const handleRemoveParticipant = (participantId) => {
    setSelectedParticipant(participantId);
    setParticipantControls(prev => {
      const newControls = new Map(prev);
      newControls.delete(participantId);
      return newControls;
    });
  };

  const handleToggleMic = (participantId) => {
    const currentControls = participantControls.get(participantId);
    if (currentControls) {
      const newEnabled = !currentControls.mic;
      handleMediaStateChange(participantId, 'mic', newEnabled);
    }
  };

  const handleToggleCamera = (participantId) => {
    const currentControls = participantControls.get(participantId);
    if (currentControls) {
      const newEnabled = !currentControls.camera;
      handleMediaStateChange(participantId, 'camera', newEnabled);
    }
  };

  const handleToggleAllMics = () => {
    const newMuteState = !isAllMuted;
    setIsAllMuted(newMuteState);
    
    const newControls = new Map(participantControls);
    Array.from(participants.entries())
      .filter(([_, name]) => name !== 'Interviewer')
      .forEach(([id]) => {
        const currentControls = newControls.get(id) || { mic: true, camera: true };
        newControls.set(id, { ...currentControls, mic: !newMuteState });
        handleMediaStateChange(id, 'mic', !newMuteState);
      });
    setParticipantControls(newControls);
  };

  const handleToggleAllCameras = () => {
    const newVideoState = !isAllVideoOff;
    setIsAllVideoOff(newVideoState);
    
    const newControls = new Map(participantControls);
    Array.from(participants.entries())
      .filter(([_, name]) => name !== 'Interviewer')
      .forEach(([id]) => {
        const currentControls = newControls.get(id) || { mic: true, camera: true };
        newControls.set(id, { ...currentControls, camera: !newVideoState });
        handleMediaStateChange(id, 'camera', !newVideoState);
      });
    setParticipantControls(newControls);
  };

  const getParticipantCount = () => {
    return Array.from(participants.entries()).filter(([_, name]) => name !== 'Interviewer').length;
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Interview</h1>
            <p className="text-gray-600">Enter a room ID to start your interview session</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                Room ID
              </label>
              <div className="relative">
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>
            <button
              onClick={startInterview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Start Interview</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-hidden">
        <VideoChat
          roomId={roomId}
          role="interviewer"
          serverIP={ipAddress}
          onParticipantsUpdate={handleParticipantsUpdate}
          onRemoveParticipant={handleRemoveParticipant}
          selectedParticipant={selectedParticipant}
          participantControls={participantControls}
          onMediaStateChange={handleMediaStateChange}
        />
      </div>
      {showInterviewControls && (
      <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Interview Controls</h2>
            <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <Users size={16} className="mr-2" />
              <span>{getParticipantCount()} Participant{getParticipantCount() !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-blue-900">Room ID: {roomId}</p>
              </div>
              <button
                onClick={copyRoomId}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="Copy Room ID"
              >
                <Copy size={18} />
              </button>
            </div>
            {showCopyTooltip && (
              <div className="absolute top-0 right-0 mt-12 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg">
                Copied!
              </div>
            )}
          </div>

          {getParticipantCount() > 0 && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleToggleAllMics}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isAllMuted
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isAllMuted ? (
                  <>
                    <VolumeX size={18} className="mr-2" />
                    All Muted
                  </>
                ) : (
                  <>
                    <Volume2 size={18} className="mr-2" />
                    Mute All
                  </>
                )}
              </button>
              <button
                onClick={handleToggleAllCameras}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isAllVideoOff
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isAllVideoOff ? (
                  <>
                    <VideoOff size={18} className="mr-2" />
                    All Video Off
                  </>
                ) : (
                  <>
                    <Video size={18} className="mr-2" />
                    Disable All Video
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {Array.from(participants.entries()).filter(([_, name]) => name !== 'Interviewer').length > 0 ? (
              Array.from(participants.entries()).map(([id, name]) => (
                name !== 'Interviewer' && (
                  <div
                    key={id}
                    className={`group rounded-xl border ${
                      selectedParticipant === id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    } transition-all duration-200 shadow-sm`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">Participant</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleToggleMic(id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              participantControls.get(id)?.mic
                                ? 'text-blue-500 hover:bg-blue-100'
                                : 'text-red-500 hover:bg-red-100'
                            }`}
                            title={participantControls.get(id)?.mic ? 'Mute participant' : 'Unmute participant'}
                          >
                            {participantControls.get(id)?.mic ? <Mic size={20} /> : <MicOff size={20} />}
                          </button>
                          <button
                            onClick={() => handleToggleCamera(id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              participantControls.get(id)?.camera
                                ? 'text-blue-500 hover:bg-blue-100'
                                : 'text-red-500 hover:bg-red-100'
                            }`}
                            title={participantControls.get(id)?.camera ? 'Disable camera' : 'Enable camera'}
                          >
                            {participantControls.get(id)?.camera ? <Video size={20} /> : <VideoOff size={20} />}
                          </button>
                          <button
                            onClick={() => handleRemoveParticipant(id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-all duration-200"
                            title="Remove participant"
                          >
                            <UserX size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">Waiting for participants to join...</p>
                <p className="text-gray-500 text-sm mt-2">Share the room ID to invite participants</p>
              </div>
            )}
          </div>
        </div>
        </div>
      )}
      <button
        onClick={toggleInterviewControls}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-50"
      >
        {showInterviewControls ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
