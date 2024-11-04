
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState('');
  const [stream, setStream] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      stopStream();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (testResults && testResults.allTestsPassed) {
      setSnackbarOpen(true);
    }
  }, [testResults]);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const testMicrophone = useCallback((mediaStream) => {
    return new Promise((resolve) => {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let startTime = Date.now();
      let maxLevel = 0;

      const checkAudioLevel = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
        const normalizedLevel = Math.min(average / 128, 1);
        setMicLevel(normalizedLevel);
        maxLevel = Math.max(maxLevel, normalizedLevel);
        if (Date.now() - startTime < 5000) {
          animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        } else {
          const passed = maxLevel > 0.4;
          resolve(passed);
        }
      };
      checkAudioLevel();
    });
  }, []);

  const checkLowLight = useCallback(() => {
    return new Promise((resolve) => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        console.warn('Video not ready, skipping low light check');
        resolve(true);
        return;
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        }
        brightness /= (data.length / 4);
        const lowLightThreshold = 0.3;
        const passed = brightness >= lowLightThreshold;
        resolve(passed);
      } catch (error) {
        console.error('Error checking low light:', error);
        resolve(true);
      }
    });
  }, []);

  const updateTestStatus = useCallback((camPassed, micPassed) => {
    let status = '';
    const allTestsPassed = camPassed && micPassed;
    if (allTestsPassed) {
      status = 'All tests passed successfully!';
    } else {
      if (camPassed) {
        status += 'Camera test passed. ';
      } else {
        status += 'Camera test failed: Low light detected. Please improve lighting. ';
      }
      if (micPassed) {
        status += 'Microphone test passed.';
      } else {
        status += 'Microphone test failed: Not detecting sufficient audio. Please check your microphone.';
      }
    }
    setTestStatus(status);
    onTestComplete(allTestsPassed);
    
    const results = { camPassed, micPassed, allTestsPassed, status };
    console.log('Test Results:', results);
    setTestResults(results);
  }, [onTestComplete]);

  const startTest = useCallback(async () => {
    setIsTesting(true);
    setTestStatus('Accessing camera and microphone...');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });
      }
      setTestStatus('Testing camera and microphone...');
      const micPassed = await testMicrophone(mediaStream);
      const camPassed = await checkLowLight();
      updateTestStatus(camPassed, micPassed);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setTestStatus('Test failed: Unable to access camera or microphone.');
      onTestComplete(false);
    } finally {
      setIsTesting(false);
      stopStream();
    }
  }, [checkLowLight, onTestComplete, stopStream, testMicrophone, updateTestStatus]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant="contained"
        onClick={startTest}
        disabled={isTesting || !rollNumber || testPassed}
        sx={{ mb: 2, width: '100%' }}
      >
        {isTesting ? <CircularProgress size={24} /> : 'Start Test'}
      </Button>
      <Box
        sx={{
          mt: 2,
          mb: 2,
          position: 'relative',
          width: '100%',
          height: '300px',
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {isTesting && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        )}
      </Box>
      {isTesting && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Microphone Level:
          </Typography>
          <LinearProgress variant="determinate" value={micLevel * 100} />
        </Box>
      )}
      {testStatus && (
        <Typography
          sx={{
            mt: 1,
            color: testStatus.includes('failed') ? 'error.main' : 'success.main',
          }}
        >
          {testStatus}
        </Typography>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Camera and microphone test passed successfully! You can now start the interview.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TestCamMic;



