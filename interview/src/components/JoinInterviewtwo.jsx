// src/components/JoinInterviewTwo.jsx
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import VideoChat from './VideoChat';

export default function JoinInterviewTwo() {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [interviewJoined, setInterviewJoined] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const [participants, setParticipants] = useState(new Map());

    useEffect(() => {
        fetch('/api/get-ip')
            .then(response => response.text())
            .then(ip => setIpAddress(ip))
            .catch(error => console.error('Error fetching IP:', error));
    }, []);

    const joinInterview = () => {
        if (roomId && userName.trim()) {
            setInterviewJoined(true);
        } else {
            alert('Please enter both Room ID and your name');
        }
    };

    const endInterview = () => {
        setInterviewJoined(false);
        setRoomId('');
        setUserName('');
    };

    const handleParticipantsUpdate = (newParticipants) => {
        setParticipants(newParticipants);
    };

    const getParticipantCount = () => {
        const count = Array.from(participants.entries()).filter(([_, name]) => name !== 'Interviewer').length;
        return count;
    };

    if (!interviewJoined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Join Interview</h1>
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
                        <div className="space-y-2">
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                Your Name
                            </label>
                            <input
                                id="userName"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter Your Name"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={joinInterview}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Join Interview
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
                    role="interviewee"
                    userName={userName}
                    onEndInterview={endInterview}
                    serverIP={ipAddress}
                    onParticipantsUpdate={handleParticipantsUpdate}
                />
            </div>
        </div>
    );
}