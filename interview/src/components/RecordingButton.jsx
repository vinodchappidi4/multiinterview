
import React, { useState, useRef, useEffect } from 'react';
import { Video, Square } from 'lucide-react';
import RecordingIndicator from './RecordingIndicator';

const RecordingButton = ({ onRecordingComplete, roomId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const recordedChunks = useRef([]);
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const [showToolbar, setShowToolbar] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingStartTime, setRecordingStartTime] = useState(null);

    const handleHover = (buttonType) => {
        setShowToolbar(buttonType);
    };

    const handleMouseLeave = () => {
        setShowToolbar(null);
    };

    useEffect(() => {
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const createCanvas = () => {
        const videoGrid = document.querySelector('.video-grid-container');
        if (!videoGrid) return null;
        const canvas = document.createElement('canvas');
        const { width, height } = videoGrid.getBoundingClientRect();
        const maxWidth = 1920;
        const maxHeight = 1080;
        const scale = Math.min(maxWidth / width, maxHeight / height);
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvasRef.current = canvas;
        return canvas;
    };

    const drawVideoGrid = (canvas, ctx) => {
        const videoGrid = document.querySelector('.video-grid-container');
        if (!videoGrid) return;
        const { width, height } = videoGrid.getBoundingClientRect();
        const scaleX = canvas.width / width;
        const scaleY = canvas.height / height;
        ctx.fillStyle = '#1F2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const videos = videoGrid.querySelectorAll('video');
        videos.forEach(video => {
            try {
                const rect = video.getBoundingClientRect();
                const gridRect = videoGrid.getBoundingClientRect();
                const x = (rect.left - gridRect.left) * scaleX;
                const y = (rect.top - gridRect.top) * scaleY;
                const w = rect.width * scaleX;
                const h = rect.height * scaleY;
                if (video.readyState >= 2 && video.videoWidth > 0) {
                    ctx.drawImage(video, x, y, w, h);
                }
            } catch (error) {
                console.error('Error drawing video:', error);
            }
        });
    };

    const startRecording = async () => {
        try {
            recordedChunks.current = [];
            const canvas = createCanvas();
            if (!canvas) {
                console.error('Failed to create canvas');
                return;
            }
            const ctx = canvas.getContext('2d');
            const stream = canvas.captureStream(30);
            const videoElements = document.querySelectorAll('video');
            const audioTracks = [];
            videoElements.forEach(video => {
                if (video.srcObject) {
                    const audioTrack = video.srcObject.getAudioTracks()[0];
                    if (audioTrack) {
                        audioTracks.push(audioTrack);
                    }
                }
            });
            const mediaStream = new MediaStream([
                ...stream.getVideoTracks(),
                ...audioTracks
            ]);
            const mediaRecorder = new MediaRecorder(mediaStream, {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 3000000
            });
            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };
            mediaRecorder.onstop = async () => {
                if (animationFrameId.current) {
                    cancelAnimationFrame(animationFrameId.current);
                    animationFrameId.current = null;
                }
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                if (blob.size > 0) {
                    await uploadRecording(blob);
                } else {
                    console.error('Recording blob is empty');
                }
                recordedChunks.current = [];
            };
            mediaRecorder.start(1000);
            setRecorder(mediaRecorder);
            setIsRecording(true);
            setRecordingStartTime(Date.now());
            const animate = () => {
                if (mediaRecorder.state === 'recording') {
                    drawVideoGrid(canvas, ctx);
                    animationFrameId.current = requestAnimationFrame(animate);
                }
            };
            animate();
            setRecordingStartTime(Date.now());
            setIsRecording(true);
          } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
          }
    };

    const stopRecording = () => {
        if (recorder && recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
          setRecordingStartTime(null);
        }
      };

    const uploadRecording = async (blob) => {
        try {
            if (blob.size === 0) {
                throw new Error('Empty recording blob');
            }
            const formData = new FormData();
            // Include roomId in the form data
            formData.append('roomId', roomId);
            formData.append('video', blob, `${roomId}_${Date.now()}.webm`);
            
            const response = await fetch('/api/upload-recording', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }
            const result = await response.json();
            console.log('Upload successful:', result);
            if (onRecordingComplete) {
                onRecordingComplete(result.path);
            }
        } catch (error) {
            console.error('Error uploading recording:', error);
        }
    };

    return (
        <div className="relative group">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                onMouseEnter={() => handleHover('recording')}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                    isRecording 
                      ? 'text-red-600 bg-red-100 hover:bg-red-500 hover:text-white' 
                      : 'text-gray-600 hover:bg-blue-500 hover:text-white'
                  }`}
            >
                {isRecording ? (
                    <Square size={18} />
                ) : (
                    <Video size={18} />
                )}
            </button>
            <RecordingIndicator isRecording={isRecording} recordingStartTime={recordingStartTime} />
            {showToolbar === 'recording' && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md px-4 py-2 whitespace-nowrap">
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </div>
            )}
        </div>
    );
};

export default RecordingButton;
