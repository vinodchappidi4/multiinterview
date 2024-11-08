
import React, { useState, useEffect } from 'react';

const RecordingIndicator = ({ isRecording, recordingStartTime }) => {
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);

  const formatRecordingDuration = () => {
    const minutes = Math.floor(recordingDuration / 60);
    const seconds = recordingDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`fixed top-20 left-5 bg-red-500 text-white px-3 py-1 rounded-md transition-opacity z-50 flex items-center space-x-2 ${
        isRecording ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
      <div className="flex items-center space-x-2">
        <span className="font-medium">Rec</span>
        <span className="font-medium">{isRecording ? formatRecordingDuration() : '00:00'}</span>
      </div>
    </div>
  );
};

export default RecordingIndicator;
