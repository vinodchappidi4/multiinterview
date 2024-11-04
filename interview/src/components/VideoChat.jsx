
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import VideoGrid from './VideoGrid';
import { Camera, CameraOff, Mic, MicOff, Hand, MessageSquare, Monitor, MonitorOff, LogOut } from 'lucide-react';
import RecordingButton from './RecordingButton';
import { Chat, ChatButton } from './Chat';

const VideoChat = ({ roomId, role, userName, onEndInterview, serverIP, onParticipantsUpdate, onRemoveParticipant, selectedParticipant, participantControls, onMediaStateChange }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [notification, setNotification] = useState(null);
  const [participants, setParticipants] = useState(new Map());
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});
  const socketRef = useRef(null);
  const pendingCandidates = useRef({});
  const notificationTimeout = useRef(null);
  const [handRaisedStates, setHandRaisedStates] = useState(new Map());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const screenTrackRef = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [showToolbar, setShowToolbar] = useState(null);

  const handleHover = (buttonType) => {
    setShowToolbar(buttonType);
  };

  const handleMouseLeave = () => {
    setShowToolbar(null);
  };

  const handleNewMessage = () => {
    setHasUnreadMessages(true);
  };

  useEffect(() => {
    if (isChatOpen) {
      setHasUnreadMessages(false);
    }
  }, [isChatOpen]);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      setScreenStream(stream);
      setIsScreenSharing(true);

      // Save screen track reference for later cleanup
      screenTrackRef.current = stream.getVideoTracks()[0];

      // Add screen track to all peer connections
      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(stream.getVideoTracks()[0]);
        }
      });

      // Listen for when user stops sharing screen
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      // Notify other participants
      socketRef.current?.emit('screen-share-started', { roomId });

    } catch (error) {
      console.error('Error starting screen share:', error);
      showNotification('Failed to start screen sharing');
    }
  };

  const stopScreenShare = async () => {
    try {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }

      if (localStream) {
        // Replace screen share track with camera track in all peer connections
        const videoTrack = localStream.getVideoTracks()[0];
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
      }

      setScreenStream(null);
      setIsScreenSharing(false);

      // Notify other participants
      socketRef.current?.emit('screen-share-stopped', { roomId });

    } catch (error) {
      console.error('Error stopping screen share:', error);
      showNotification('Failed to stop screen sharing');
    }
  };

  const toggleScreenShare = () => {
    if (!isScreenSharing) {
      startScreenShare();
    } else {
      stopScreenShare();
    }
  };

  // Function to show notification
  const showNotification = (message) => {
    setNotification(message);
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current);
    }
    notificationTimeout.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Handle hand raise
  const toggleHand = () => {
    setIsHandRaised(!isHandRaised);
    if (socketRef.current) {
      socketRef.current.emit('hand-raised', {
        roomId,
        userName: role === 'interviewer' ? 'Interviewer' : userName,
        participantId: socketRef.current.id,
        isRaised: !isHandRaised
      });
    }
  };

  // Function to get formatted participant count
  const getParticipantCount = () => {
    const count = participants.size;
    return {
      total: count,
      text: `${count} ${count === 1 ? 'Participant' : 'Participants'}`
    };
  };

  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
  
    socket.on('hand-raise-notification', ({ userName, participantId, isRaised }) => {
      setHandRaisedStates(prev => {
        const newStates = new Map(prev);
        if (isRaised) {
          newStates.set(participantId, true);
        } else {
          newStates.delete(participantId);
        }
        return newStates;
      });
      
      const message = isRaised ? `${userName} raised their hand` : `${userName} lowered their hand`;
      showNotification(message);
    });
  
    return () => {
      socket.off('hand-raise-notification');
    };
  }, [localStream]);

  // Handle media control events from interviewer
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('toggle-mic', ({ enabled }) => {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = enabled;
          setIsMicOn(enabled);
        }
      }
    });

    socketRef.current.on('toggle-camera', ({ enabled }) => {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = enabled;
          setIsCameraOn(enabled);
        }
      }
    });

    return () => {
      socketRef.current?.off('toggle-mic');
      socketRef.current?.off('toggle-camera');
    };
  }, [localStream]);

  // Handle participant controls changes
  useEffect(() => {
    if (role === 'interviewer' && participantControls && socketRef.current) {
      participantControls.forEach((controls, participantId) => {
        socketRef.current.emit('toggle-participant-mic', {
          participantId,
          enabled: controls.mic,
          roomId
        });
        socketRef.current.emit('toggle-participant-camera', {
          participantId,
          enabled: controls.camera,
          roomId
        });
      });
    }
  }, [participantControls, role, roomId]);

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
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [serverIP]);

  const createPeerConnection = (peerId, isInitiator) => {
    if (peerConnections.current[peerId]) {
      peerConnections.current[peerId].close();
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "turn:62.146.178.245:3478",
          username: "test",
          credential: "test123",
        },
      ],
    });

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
      const streamToUse = screenStream || localStream;
      streamToUse.getTracks().forEach(track => {
        peerConnection.addTrack(track, streamToUse);
      });
    }

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
      peerConnection.onclose = () => clearTimeout(negotiationTimeout);
    }

    peerConnections.current[peerId] = peerConnection;
    return peerConnection;
  };

  // Add socket listeners for screen sharing events
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('screen-share-started', ({ participantId }) => {
      showNotification(`${participants.get(participantId) || 'A participant'} started screen sharing`);
    });

    socketRef.current.on('screen-share-stopped', ({ participantId }) => {
      showNotification(`${participants.get(participantId) || 'A participant'} stopped screen sharing`);
    });

    return () => {
      socketRef.current.off('screen-share-started');
      socketRef.current.off('screen-share-stopped');
    };
  }, [participants]);

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

  const handleRemoveParticipant = (participantId) => {
    if (role === 'interviewer' && socketRef.current) {
      console.log('Attempting to remove participant:', participantId);
      socketRef.current.emit('remove-participant', { participantId, roomId });
    }
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
      handleParticipantRemoval(participantId);
    });

    socket.on('force-disconnect', () => {
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
        if (peerConnection.signalingState === 'stable') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { answer, peerId }, roomId);
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
          pendingCandidates.current[peerId] = pendingCandidates.current[peerId] || [];
          pendingCandidates.current[peerId].push(candidate);
        }
      } catch (err) {
        console.error('Error handling ICE candidate:', err);
      }
    });

    socket.on('user-disconnected', (participantId) => {
      handleParticipantRemoval(participantId);
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

  const handleParticipantRemoval = (participantId) => {
    setParticipants(prev => {
      const newParticipants = new Map(prev);
      newParticipants.delete(participantId);
      return newParticipants;
    });
    
    setHandRaisedStates(prev => {
      const newStates = new Map(prev);
      newStates.delete(participantId);
      return newStates;
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
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
      
      // Emit state change to other participants
      socketRef.current?.emit('media-state-update', {
        roomId,
        type: 'camera',
        enabled: videoTrack.enabled
      });

      // Update control panel if user is not the interviewer
      if (role !== 'interviewer' && onMediaStateChange) {
        onMediaStateChange(socketRef.current?.id, 'camera', videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
      
      // Emit state change to other participants
      socketRef.current?.emit('media-state-update', {
        roomId,
        type: 'mic',
        enabled: audioTrack.enabled
      });

      // Update control panel if user is not the interviewer
      if (role !== 'interviewer' && onMediaStateChange) {
        onMediaStateChange(socketRef.current?.id, 'mic', audioTrack.enabled);
      }
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;

    // Listen for media state updates from other participants
    socketRef.current.on('participant-media-update', ({ participantId, type, enabled }) => {
      if (role === 'interviewer' && onMediaStateChange) {
        onMediaStateChange(participantId, type, enabled);
      }
    });

    return () => {
      socketRef.current?.off('participant-media-update');
    };
  }, [role, onMediaStateChange]);

  useEffect(() => {
    if (role === 'interviewer' && onParticipantsUpdate) {
      onParticipantsUpdate(participants);
    }
  }, [participants, role, onParticipantsUpdate]);

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      {/* Room info bar - fixed height */}
      <div className="h-14 bg-white shadow-sm flex items-center px-4">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Room ID: {roomId}</span>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {getParticipantCount().text}
            </div>
          </div>
        </div>
      </div>

      {/* Main video grid - fills remaining space */}
      <div className="flex-1 bg-gray-900 min-h-0">
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          participants={participants}
          localUserRole={role}
          localUserName={userName}
          handRaisedStates={handRaisedStates}
          localHandRaised={isHandRaised}
          socketId={socketRef.current?.id}
        />
      </div>

      {/* Controls bar - fixed height */}
      <div className="h-16 bg-white border-t flex items-center px-4">
        <div className="w-full max-w-7xl mx-auto flex justify-center space-x-4">
        <div className="relative group">
            <button
              onMouseEnter={() => handleHover('camera')}
              onMouseLeave={handleMouseLeave}
              onClick={toggleCamera}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-colors text-gray-600 hover:bg-blue-500 hover:text-white"
            >
              {isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
            </button>
            {showToolbar === 'camera' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
              </div>
            )}
          </div>
          <div className="relative group">
            <button
            onMouseEnter={() => handleHover('mic')}
            onMouseLeave={handleMouseLeave}
              onClick={toggleMic}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-colors text-gray-600 hover:bg-blue-500 hover:text-white"
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            {showToolbar === 'mic' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              </div>
            )}
          </div>

          <div className="relative group">
            <button
            onMouseEnter={() => handleHover('screenshare')}
            onMouseLeave={handleMouseLeave}
              onClick={toggleScreenShare}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-colors text-gray-600 hover:bg-blue-500 hover:text-white"
            >
              {isScreenSharing ? <MonitorOff size={18} /> : <Monitor size={18} />}
            </button>
            {showToolbar === 'screenshare' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
              </div>
            )}
          </div>

          <div className="relative group">
            <button
            onMouseEnter={() => handleHover('hand')}
            onMouseLeave={handleMouseLeave}
              onClick={toggleHand}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-colors text-gray-600 hover:bg-yellow-500 hover:text-white"
            >
              <Hand size={18} />
            </button>
            {showToolbar === 'hand' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
              </div>
            )}
          </div>
          {
  <RecordingButton 
    onRecordingComplete={(path) => {
        showNotification(`Recording saved to ${path}`);
    }}
    roomId={roomId}
/>
}
      <ChatButton
        onClick={() => setIsChatOpen(!isChatOpen)}
        isOpen={isChatOpen}
        hasUnreadMessages={hasUnreadMessages}
      />
          {role !== 'interviewer' && (
            <div className="relative group">
            <button
            onMouseEnter={() => handleHover('leave')}
            onMouseLeave={handleMouseLeave}
              onClick={onEndInterview}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-colors text-gray-600 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} />
            </button>
            {showToolbar === 'leave' && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                Leave Interview
              </div>
            )}
          </div>
          )}
        </div>
      </div>
      <Chat
    isOpen={isChatOpen}
    onClose={() => setIsChatOpen(false)}
    socket={socketRef.current}
    roomId={roomId}
    userName={userName}
    role={role}
    onNewMessage={handleNewMessage}
  />
    </div>
  );
};

export default VideoChat;