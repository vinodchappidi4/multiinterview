// // src/components/VideoChat.jsx

import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const VideoChat = ({ 
  roomId, 
  role, 
  userName, 
  onEndInterview, 
  serverIP, 
  onParticipantsUpdate, 
  onRemoveParticipant,
  selectedParticipant 
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [participants, setParticipants] = useState(new Map());
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});
  const socketRef = useRef(null);
  const pendingCandidates = useRef({});

  // Function to get formatted participant count
  const getParticipantCount = () => {
    const count = participants.size;
    return { total: count, text: `${count} ${count === 1 ? 'Participant' : 'Participants'}` };
};

  const handleRemoveParticipant = (participantId) => {
    if (role === 'interviewer' && socketRef.current) {
      console.log('Attempting to remove participant:', participantId);
      socketRef.current.emit('remove-participant', { participantId, roomId });
    }
  };

  // Update participants in parent component
  useEffect(() => {
    if (role === 'interviewer' && onParticipantsUpdate) {
      onParticipantsUpdate(participants);
    }
  }, [participants, role, onParticipantsUpdate]);

  useEffect(() => {
    if (selectedParticipant && onRemoveParticipant) {
      handleRemoveParticipant(selectedParticipant);
    }
  }, [selectedParticipant]);

  useEffect(() => {
    socketRef.current = io(`http://${serverIP}:3001`);
    
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [serverIP]);

  const createPeerConnection = (peerId, isInitiator) => {
    if (peerConnections.current[peerId]) {
      peerConnections.current[peerId].close();
    }

    const peerConnection = new RTCPeerConnection({
      // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      iceServers: [
        {
          urls: "turn:62.146.178.245:3478",
          username: "test",
          credential: "test123",
        },
    ],
    });

    // Store pending candidates
    pendingCandidates.current[peerId] = [];

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          peerId
        }, roomId);
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [peerId]: event.streams[0]
      }));
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Only set up negotiation for the initiator
    if (isInitiator) {
      const negotiationTimeout = setTimeout(async () => {
        try {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socketRef.current?.emit('offer', { offer, peerId }, roomId);
        } catch (err) {
          console.error('Error in delayed negotiation:', err);
        }
      }, 1000);

      // Clean up timeout if component unmounts
      peerConnection.onclose = () => clearTimeout(negotiationTimeout);
    }

    peerConnections.current[peerId] = peerConnection;
    return peerConnection;
  };

  const addPendingCandidates = async (peerId) => {
    const pc = peerConnections.current[peerId];
    const candidates = pendingCandidates.current[peerId] || [];
    
    for (const candidate of candidates) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding pending candidate:', err);
      }
    }
    pendingCandidates.current[peerId] = [];
  };


  useEffect(() => {
    if (!socketRef.current || !localStream) return;
    
    const socket = socketRef.current;

    if (role === 'interviewer') {
      socket.emit('create-room', roomId);
    } else {
      socket.emit('join-room', { roomId, userName });
    }

    socket.on('room-created', (participantId) => {
      setParticipants(new Map([[participantId, 'Interviewer']]));
    });

    socket.on('user-joined', ({ participantId, userName: newUserName }) => {
      setParticipants(prev => new Map([...prev, [participantId, newUserName]]));
      createPeerConnection(participantId, true);
    });

    socket.on('participant-removed', (participantId) => {
      console.log('Participant removed:', participantId);
      setParticipants(prev => {
        const newParticipants = new Map(prev);
        newParticipants.delete(participantId);
        return newParticipants;
      });
      
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[participantId];
        return newStreams;
      });

      if (peerConnections.current[participantId]) {
        peerConnections.current[participantId].close();
        delete peerConnections.current[participantId];
      }
      delete pendingCandidates.current[participantId];
    });

    socket.on('force-disconnect', () => {
      console.log('You have been removed from the interview');
      if (onEndInterview) {
        onEndInterview();
      }
    });

    socket.on('existing-participants', (existingParticipants) => {
      const participantsMap = new Map(existingParticipants);
      setParticipants(participantsMap);
      existingParticipants.forEach(([participantId]) => {
        createPeerConnection(participantId, false);
      });
    });

    socket.on('offer', async ({ offer, peerId }) => {
      try {
        const peerConnection = peerConnections.current[peerId] || createPeerConnection(peerId, false);
        
        // Ensure we're in stable state before setting remote description
        if (peerConnection.signalingState === 'stable') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { answer, peerId }, roomId);
          
          // Add any pending candidates after setting descriptions
          await addPendingCandidates(peerId);
        }
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    socket.on('answer', async ({ answer, peerId }) => {
      try {
        const peerConnection = peerConnections.current[peerId];
        if (peerConnection && peerConnection.signalingState === 'have-local-offer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          await addPendingCandidates(peerId);
        }
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    socket.on('ice-candidate', async ({ candidate, peerId }) => {
      try {
        const peerConnection = peerConnections.current[peerId];
        if (!peerConnection) return;

        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          // Store candidate if remote description isn't set yet
          pendingCandidates.current[peerId] = pendingCandidates.current[peerId] || [];
          pendingCandidates.current[peerId].push(candidate);
        }
      } catch (err) {
        console.error('Error handling ICE candidate:', err);
      }
    });

    socket.on('user-disconnected', (participantId) => {
      setParticipants(prev => {
        const newParticipants = new Map(prev);
        newParticipants.delete(participantId);
        return newParticipants;
      });
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[participantId];
        return newStreams;
      });
      if (peerConnections.current[participantId]) {
        peerConnections.current[participantId].close();
        delete peerConnections.current[participantId];
      }
      delete pendingCandidates.current[participantId];
    });

    return () => {
      socket.off('participant-removed');
      socket.off('force-disconnect');
      Object.values(peerConnections.current).forEach(pc => {
        if (pc && pc.connectionState !== 'closed') {
          pc.close();
        }
      });
      peerConnections.current = {};
      pendingCandidates.current = {};
    };
  }, [localStream, roomId, role, userName]);

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

   return (
    <div className="flex flex-col items-center">
      {/* Participant Counter */}
      <div className="w-full max-w-4xl mb-4">
        <div className="bg-blue-100 p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div className="text-blue-800 font-medium">
              Room ID: {roomId}
            </div>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {getParticipantCount().text}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-48 bg-gray-200 rounded-lg"
          />
          <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {role === 'interviewer' ? 'Interviewer' : userName} (You)
          </p>
        </div>
        {Object.entries(remoteStreams).map(([peerId, stream]) => (
          <div key={peerId} className="relative">
            <video
              ref={el => {
                if (el) el.srcObject = stream;
              }}
              autoPlay
              playsInline
              className="w-full h-48 bg-gray-200 rounded-lg"
            />
            <p className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              {participants.get(peerId) || 'Participant'}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-full transition-colors ${
            isCameraOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-full transition-colors ${
            isMicOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        {role !== 'interviewer' && (
          <button
            onClick={onEndInterview}
            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Leave Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoChat;