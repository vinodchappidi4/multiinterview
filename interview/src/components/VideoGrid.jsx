
import React, { useState } from 'react';
import { Hand, Pin, PinOff } from 'lucide-react';
import RecordingIndicator from './RecordingIndicator';

const VideoGrid = ({
  localStream,
  remoteStreams,
  participants,
  localUserRole,
  localUserName,
  handRaisedStates = new Map(),
  localHandRaised = false,
  socketId,
  isRecording,
  recordingStartTime,
}) => {
  const [pinnedParticipant, setPinnedParticipant] = useState(null);
  const totalParticipants = Object.keys(remoteStreams).length + 1;

  const getGridLayout = () => {
    if (pinnedParticipant) {
      return {
        containerStyle: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'auto',
          gap: '0.75rem',
          padding: '0.75rem',
          height: '100%',
        },
        pinnedStyle: {
          gridColumn: '1 / -1',
          height: '70vh',
        },
        smallGridStyle: {
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
          gap: '0.75rem',
          height: 'calc(30vh - 1.5rem)',
        }
      };
    }

    // Regular grid layout
    const getGridDimensions = (count) => {
      if (count <= 1) return { cols: 1, rows: 1 };
      if (count <= 2) return { cols: 2, rows: 1 };
      if (count <= 4) return { cols: 2, rows: 2 };
      if (count <= 6) return { cols: 3, rows: 2 };
      if (count <= 9) return { cols: 3, rows: 3 };
      return { cols: 4, rows: Math.ceil(count / 4) };
    };

    const { cols, rows } = getGridDimensions(totalParticipants);
    
    return {
      containerStyle: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '0.75rem',
        padding: '0.75rem',
        height: '100%',
      }
    };
  };

  const VideoContainer = ({
    stream,
    participantId,
    name,
    isLocal,
    isHandRaised,
    isPinned,
    isRecording,
    recordingStartTime,
  }) => {
    const handlePinClick = () => {
      setPinnedParticipant(pinnedParticipant === participantId ? null : participantId);
    };

    return (
      <div className={`relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group
        ${isPinned ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-400/50'}`}>
        <video
          ref={el => { if (el) el.srcObject = stream; }}
          autoPlay
          muted={isLocal}
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top controls */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isLocal && (
            <button
              onClick={handlePinClick}
              className="p-2 rounded-lg bg-gray-900/80 text-white hover:bg-gray-800 transition-colors"
            >
              {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
            </button>
          )}
        </div>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                {(name || 'User').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium tracking-wide">
                  {name}{isLocal ? ' (You)' : ''}
                </span>
                {isLocal && (
                  <span className="text-gray-300 text-xs">
                    {localUserRole}
                  </span>
                )}
              </div>
            </div>
            {isHandRaised && (
              <Hand className="text-yellow-400 drop-shadow-glow" size={20} />
            )}
          </div>
        </div>
        <RecordingIndicator isRecording={isRecording} recordingStartTime={recordingStartTime} />
      </div>
    );
  };

  const { containerStyle, pinnedStyle, smallGridStyle } = getGridLayout();

  if (pinnedParticipant) {
    return (
      <div className="w-full h-full bg-gray-900" style={containerStyle}>
        {/* Pinned participant */}
        <div style={pinnedStyle}>
          {pinnedParticipant === 'local' ? (
            <VideoContainer
              stream={localStream}
              participantId="local"
              name={localUserRole === 'interviewer' ? 'Interviewer' : localUserName}
              isLocal={true}
              isHandRaised={localHandRaised}
              isPinned={true}
            />
          ) : (
            <VideoContainer
              stream={remoteStreams[pinnedParticipant]}
              participantId={pinnedParticipant}
              name={participants.get(pinnedParticipant)}
              isLocal={false}
              isHandRaised={handRaisedStates.get(pinnedParticipant)}
              isPinned={true}
            />
          )}
        </div>

        {/* Other participants */}
        <div style={smallGridStyle}>
          {pinnedParticipant !== 'local' && (
            <VideoContainer
              stream={localStream}
              participantId="local"
              name={localUserRole === 'interviewer' ? 'Interviewer' : localUserName}
              isLocal={true}
              isHandRaised={localHandRaised}
              isPinned={false}
            />
          )}
          {Object.entries(remoteStreams).map(([peerId, stream]) => {
            if (peerId === pinnedParticipant) return null;
            return (
              <VideoContainer
                key={peerId}
                stream={stream}
                participantId={peerId}
                name={participants.get(peerId)}
                isLocal={false}
                isHandRaised={handRaisedStates.get(peerId)}
                isPinned={false}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 video-grid-container" style={containerStyle}>
      
       <VideoContainer
        stream={localStream}
        participantId="local"
        name={localUserRole === 'interviewer' ? 'Interviewer' : localUserName}
        isLocal={true}
        isHandRaised={localHandRaised}
        isPinned={false}
        isRecording={isRecording}
        recordingStartTime={recordingStartTime}
      />
      <RecordingIndicator isRecording={isRecording} recordingStartTime={recordingStartTime} />
      {Object.entries(remoteStreams).map(([peerId, stream]) => (
        <VideoContainer
          key={peerId}
          stream={stream}
          participantId={peerId}
          name={participants.get(peerId)}
          isLocal={false}
          isHandRaised={handRaisedStates.get(peerId)}
          isPinned={false}
          isRecording={isRecording}
          recordingStartTime={recordingStartTime}
        />
      ))}
      
    </div>
  );
};

export default VideoGrid;
