
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, IconButton, Typography, Fade, Menu, MenuItem } from '@mui/material';
import { Videocam, VideocamOff, Mic, MicOff, ClosedCaption, ClosedCaptionDisabled, Wallpaper } from '@mui/icons-material';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import LowLightAlert from './LowLightAlert';
import CountdownAlert from './CountdownAlert';

const VideoRecording = ({ isRecording, isCameraOn, setIsCameraOn, isMicOn, setIsMicOn, isCCOn, setIsCCOn, remainingTime, showWarning, transcript, onToggleCamera, onToggleMic, onToggleCC, theme, videoStream, onEndInterview, onFrameCapture  }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showLowLightAlert, setShowLowLightAlert] = useState(false);
  const [showCountdownAlert, setShowCountdownAlert] = useState(false);
  const lowLightTimeoutRef = useRef(null);
  const countdownTimeoutRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bodyPixNet, setBodyPixNet] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const backgroundImageRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [isBodyPixReady, setIsBodyPixReady] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const [lastSegmentation, setLastSegmentation] = useState(null);
  const segmentationInterval = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.onloadedmetadata = () => {
        const { videoWidth, videoHeight } = videoRef.current;
        if (videoWidth > 0 && videoHeight > 0) {
          setVideoDimensions({ width: videoWidth, height: videoHeight });
          setIsVideoReady(true);
        }
      };
    }
  }, [videoStream]);

  const backgrounds = useMemo(() => [
    { name: 'None', url: null },
    { name: 'Office', url: '/backgrounds/office.jpg' },
    { name: 'Beach', url: '/backgrounds/beach.jpg' },
    { name: 'Space', url: '/backgrounds/a.jpg' },
  ], []);

  useEffect(() => {
    const setupTensorFlow = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const net = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2
        });
        setBodyPixNet(net);
        setIsBodyPixReady(true);
      } catch (error) {
        console.error("Error setting up TensorFlow.js or loading BodyPix model:", error);
      }
    };

    setupTensorFlow();
  }, []);

  useEffect(() => {
    //console.log('isCameraOn changed:', isCameraOn);
    //console.log('isBodyPixReady changed:', isBodyPixReady);
    //console.log('isVideoReady changed:', isVideoReady);
  }, [isCameraOn, isBodyPixReady, isVideoReady]);

  const captureFrameWithBackground = () => {
    if (canvasRef.current && onFrameCapture) {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/webp');
      onFrameCapture(imageData);
    }
  };

  useEffect(() => {
    let captureInterval;
    if (isRecording && isCameraOn && onFrameCapture) {
      captureInterval = setInterval(captureFrameWithBackground, 100); // Capture every 100ms
    }
    return () => {
      if (captureInterval) {
        clearInterval(captureInterval);
      }
    };
  }, [isRecording, isCameraOn, onFrameCapture]);

  useEffect(() => {
    if (videoRef.current) {
      if (isCameraOn) {
        videoRef.current.play()
          .then(() => console.log('Video playback started after camera on'))
          .catch(error => console.error("Error playing video after camera on:", error));
      } else {
        videoRef.current.pause();
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [isCameraOn]);

  useEffect(() => {
        if (isRecording && isCameraOn) {
          const checkLighting = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
    
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
    
            let brightness = 0;
            for (let i = 0; i < data.length; i += 4) {
              brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
            }
            brightness /= (data.length / 4);
    
            if (brightness < 0.3) { // Adjust this threshold as needed
              setShowLowLightAlert(true);
              if (lowLightTimeoutRef.current === null) {
                lowLightTimeoutRef.current = setTimeout(() => {
                  setShowLowLightAlert(false);
                  setShowCountdownAlert(true);
                }, 10000);
              }
            } else {
              setShowLowLightAlert(false);
              setShowCountdownAlert(false);
              if (lowLightTimeoutRef.current !== null) {
                clearTimeout(lowLightTimeoutRef.current);
                lowLightTimeoutRef.current = null;
              }
              if (countdownTimeoutRef.current !== null) {
                clearTimeout(countdownTimeoutRef.current);
                countdownTimeoutRef.current = null;
              }
            }
          };
    
          const intervalId = setInterval(checkLighting, 1000);
          return () => {
            clearInterval(intervalId);
            if (lowLightTimeoutRef.current !== null) {
              clearTimeout(lowLightTimeoutRef.current);
              lowLightTimeoutRef.current = null;
            }
            if (countdownTimeoutRef.current !== null) {
              clearTimeout(countdownTimeoutRef.current);
              countdownTimeoutRef.current = null;
            }
          };
        }
      }, [isRecording, isCameraOn]);

  useEffect(() => {
    if (selectedBackground) {
      const img = new Image();
      img.onload = () => {
        backgroundImageRef.current = img;
      };
      img.src = selectedBackground;
    } else {
      backgroundImageRef.current = null;
    }
  }, [selectedBackground]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = videoDimensions.width;
      canvasRef.current.height = videoDimensions.height;
    }
  }, [videoDimensions]);

  useEffect(() => {
    const performSegmentation = async () => {
      if (bodyPixNet && videoRef.current && isCameraOn) {
        try {
          const segmentation = await bodyPixNet.segmentPerson(videoRef.current, {
            flipHorizontal: false,
            internalResolution: 'medium',
            segmentationThreshold: 0.7,
          });
          setLastSegmentation(segmentation);
        } catch (error) {
          console.error("Error performing segmentation:", error);
        }
      }
    };

    if (isCameraOn && bodyPixNet && isVideoReady && backgroundImageRef.current) {
      segmentationInterval.current = setInterval(performSegmentation, 200); // Perform segmentation every 200ms
    }

    return () => {
      if (segmentationInterval.current) {
        clearInterval(segmentationInterval.current);
      }
    };
  }, [isCameraOn, bodyPixNet, isVideoReady, backgroundImageRef.current]);

  useEffect(() => {
    let animationFrame;
    const drawFrame = () => {
      if (videoRef.current && canvasRef.current && isCameraOn) {
        const ctx = canvasRef.current.getContext('2d');
        
        if (backgroundImageRef.current && lastSegmentation) {
          // Draw virtual background
          ctx.drawImage(backgroundImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw person
          const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          const pixels = imageData.data;
          
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          const personImageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          const personPixels = personImageData.data;
          
          for (let i = 0; i < lastSegmentation.data.length; i++) {
            const pixelIndex = i * 4;
            if (lastSegmentation.data[i] === 1) { // If it's a person
              pixels[pixelIndex] = personPixels[pixelIndex];
              pixels[pixelIndex + 1] = personPixels[pixelIndex + 1];
              pixels[pixelIndex + 2] = personPixels[pixelIndex + 2];
              pixels[pixelIndex + 3] = 255; // Full opacity
            }
          }
          ctx.putImageData(imageData, 0, 0);
        } else {
          // If no virtual background or segmentation, just draw the video
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      animationFrame = requestAnimationFrame(drawFrame);
    };

    if (isCameraOn && isVideoReady) {
      drawFrame();
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isCameraOn, isVideoReady, lastSegmentation]);

  const handleCloseLowLightAlert = () => {
    setShowLowLightAlert(false);
  };

  const handleCountdownComplete = () => {
    setShowCountdownAlert(false);
    onEndInterview();
  };

  const handleBackgroundClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBackgroundClose = () => {
    setAnchorEl(null);
  };

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background.url);
    handleBackgroundClose();
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', boxShadow: 3, aspectRatio: '16 / 9' }}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000' }}>
        <video
          ref={videoRef}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: isCameraOn ? 'block' : 'none',
            border: '2px solid red' // Temporary: to make it visible for debugging
          }}
          autoPlay
          playsInline
          muted={!isMicOn}
        />
        <canvas
          ref={canvasRef}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: isCameraOn ? 'block' : 'none',
            border: '2px solid blue' // Temporary: to make it visible for debugging
          }}
        />
        {isRecording && (
          <Fade in={true}>
            <Box sx={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '20px', padding: '8px 16px' }}>
              <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'red', marginRight: '10px' }} />
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>REC</Typography>
            </Box>
          </Fade>
        )}
        <Box sx={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '20px', padding: '8px 16px' }}>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
            {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
        {showWarning && (
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255, 0, 0, 0.8)', borderRadius: '8px', padding: '12px 24px' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              10 seconds remaining
            </Typography>
          </Box>
        )}
        <Box sx={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, padding: '10px 20px', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '30px' }}>
          <IconButton onClick={onToggleCamera} sx={{ color: isCameraOn ? theme.palette.primary.main : 'white' }}>
            {isCameraOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
          <IconButton onClick={onToggleMic} sx={{ color: isMicOn ? theme.palette.primary.main : 'white' }}>
            {isMicOn ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton onClick={onToggleCC} sx={{ color: isCCOn ? theme.palette.primary.main : 'white' }}>
            {isCCOn ? <ClosedCaption /> : <ClosedCaptionDisabled />}
          </IconButton>
          <IconButton onClick={handleBackgroundClick} sx={{ color: 'white' }}>
            <Wallpaper />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleBackgroundClose}
        >
          {backgrounds.map((bg) => (
            <MenuItem key={bg.name} onClick={() => handleBackgroundSelect(bg)}>
              {bg.name}
            </MenuItem>
          ))}
        </Menu>
        {isCCOn && (
          <Box sx={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxHeight: '120px', overflowY: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '16px', borderRadius: '12px', fontFamily: theme.typography.fontFamily, fontSize: '18px', lineHeight: 1.5 }}>
            {transcript}
          </Box>
        )}
      </Box>
      <LowLightAlert open={showLowLightAlert} onClose={handleCloseLowLightAlert} />
      <CountdownAlert open={showCountdownAlert} onClose={() => setShowCountdownAlert(false)} duration={10} onComplete={handleCountdownComplete} />
    </Box>
  );
};

export default VideoRecording;
