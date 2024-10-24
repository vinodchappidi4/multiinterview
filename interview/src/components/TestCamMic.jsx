// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress } from '@mui/material';

// const TestCamMic = ({ onTestComplete, rollNumber }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [stream]);

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');

//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);

//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }

//       setTestStatus('Testing camera and microphone...');
      
//       // Wait for a moment to ensure the video is playing
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Check for low light
//       const lowLight = await checkLowLight();

//       if (lowLight) {
//         setTestStatus('Test failed: Low light detected. Please improve lighting.');
//         onTestComplete(false);
//       } else {
//         setTestStatus('All tests passed successfully!');
//         onTestComplete(true);
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const checkLowLight = () => {
//     return new Promise((resolve) => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) {
//         console.warn('Video not ready, skipping low light check');
//         resolve(false);
//         return;
//       }

//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);

//       try {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         let brightness = 0;
//         for (let i = 0; i < data.length; i += 4) {
//           brightness += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
//         }
//         brightness /= (data.length / 4);
//         console.log('Average brightness:', brightness);
//         resolve(brightness < 50); // Threshold for low light
//       } catch (error) {
//         console.error('Error checking low light:', error);
//         resolve(false);
//       }
//     });
//   };

//   return (
//     <Box sx={{ mt: 2, mb: 2 }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber}
//         sx={{ mb: 2 }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Test Cam/Mic'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: '100%',
//             maxWidth: '400px',
//             borderRadius: '8px',
//             display: stream ? 'block' : 'none'
//           }}
//         />
//         {isTesting && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               borderRadius: '8px',
//             }}
//           >
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {testStatus && (
//         <Typography
//           sx={{
//             mt: 1,
//             color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//           }}
//         >
//           {testStatus}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default TestCamMic;

//autoclosing videostream after testing

// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress } from '@mui/material';

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//     };
//   }, []);

//   useEffect(() => {
//     if (testPassed) {
//       stopStream();
//     }
//   }, [testPassed]);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');

//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);

//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }

//       setTestStatus('Testing camera and microphone...');
      
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       const lowLight = await checkLowLight();

//       if (lowLight) {
//         setTestStatus('Test failed: Low light detected. Please improve lighting.');
//         onTestComplete(false);
//       } else {
//         setTestStatus('All tests passed successfully!');
//         onTestComplete(true);
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const checkLowLight = () => {
//         return new Promise((resolve) => {
//           if (!videoRef.current || videoRef.current.readyState !== 4) {
//             console.warn('Video not ready, skipping low light check');
//             resolve(false);
//             return;
//           }
    
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           canvas.width = videoRef.current.videoWidth;
//           canvas.height = videoRef.current.videoHeight;
//           ctx.drawImage(videoRef.current, 0, 0);
    
//           try {
//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//             const data = imageData.data;
//             let brightness = 0;
//             for (let i = 0; i < data.length; i += 4) {
//               brightness += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
//             }
//             brightness /= (data.length / 4);
//             console.log('Average brightness:', brightness);
//             resolve(brightness < 50); // Threshold for low light
//           } catch (error) {
//             console.error('Error checking low light:', error);
//             resolve(false);
//           }
//         });
//       };

//   return (
//     <Box sx={{ mt: 2, mb: 2 }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2 }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Test Cam/Mic'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: '100%',
//             maxWidth: '400px',
//             borderRadius: '8px',
//             display: stream && !testPassed ? 'block' : 'none'
//           }}
//         />
//         {isTesting && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               borderRadius: '8px',
//             }}
//           >
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {testStatus && !testPassed && (
//         <Typography
//           sx={{
//             mt: 1,
//             color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//           }}
//         >
//           {testStatus}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default TestCamMic;

//added snackbar

// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//     };
//   }, []);

//   useEffect(() => {
//     if (testPassed) {
//       stopStream();
//       setSnackbarOpen(true);
//     }
//   }, [testPassed]);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }
//       setTestStatus('Testing camera and microphone...');
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       const lowLight = await checkLowLight();
//       if (lowLight) {
//         setTestStatus('Test failed: Low light detected. Please improve lighting.');
//         onTestComplete(false);
//       } else {
//         setTestStatus('All tests passed successfully!');
//         onTestComplete(true);
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const checkLowLight = () => {
//             return new Promise((resolve) => {
//               if (!videoRef.current || videoRef.current.readyState !== 4) {
//                 console.warn('Video not ready, skipping low light check');
//                 resolve(false);
//                 return;
//               }
        
//               const canvas = document.createElement('canvas');
//               const ctx = canvas.getContext('2d');
//               canvas.width = videoRef.current.videoWidth;
//               canvas.height = videoRef.current.videoHeight;
//               ctx.drawImage(videoRef.current, 0, 0);
        
//               try {
//                 const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//                 const data = imageData.data;
//                 let brightness = 0;
//                 for (let i = 0; i < data.length; i += 4) {
//                     brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
//                   }
//                   brightness /= (data.length / 4);
//                 console.log('Average brightness:', brightness);
//                 resolve(brightness < 50); // Threshold for low light
//               } catch (error) {
//                 console.error('Error checking low light:', error);
//                 resolve(false);
//               }
//             });
//           };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ mt: 2, mb: 2 }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2 }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Test Cam/Mic'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', display: stream && !testPassed ? 'block' : 'none' }}
//         />
//         {isTesting && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               borderRadius: '8px',
//             }}
//           >
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {testStatus && !testPassed && (
//         <Typography
//           sx={{
//             mt: 1,
//             color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//           }}
//         >
//           {testStatus}
//         </Typography>
//       )}
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Camera and microphone test passed successfully! You can now start the interview.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TestCamMic;


//

// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [micLevel, setMicLevel] = useState(0);
//   const [micTestPassed, setMicTestPassed] = useState(false);
//   const videoRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (testPassed) {
//       stopStream();
//       setSnackbarOpen(true);
//     }
//   }, [testPassed]);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }
//       setTestStatus('Testing camera and microphone...');
//       await testMicrophone(mediaStream);
//       const lowLight = await checkLowLight();
//       if (lowLight) {
//         setTestStatus('Test failed: Low light detected. Please improve lighting.');
//         onTestComplete(false);
//       } else if (!micTestPassed) {
//         setTestStatus('Test failed: Microphone not detecting sufficient audio. Please check your microphone.');
//         onTestComplete(false);
//       } else {
//         setTestStatus('All tests passed successfully!');
//         onTestComplete(true);
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const testMicrophone = (mediaStream) => {
//     return new Promise((resolve) => {
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       const source = audioContextRef.current.createMediaStreamSource(mediaStream);
//       source.connect(analyserRef.current);

//       analyserRef.current.fftSize = 256;
//       const bufferLength = analyserRef.current.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       let startTime = Date.now();
//       let maxLevel = 0;

//       const checkAudioLevel = () => {
//         analyserRef.current.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
//         const normalizedLevel = Math.min(average / 128, 1);
//         setMicLevel(normalizedLevel);
//         maxLevel = Math.max(maxLevel, normalizedLevel);

//         console.log('Current mic level:', normalizedLevel);
//         console.log('Max mic level:', maxLevel);

//         if (Date.now() - startTime < 5000) {
//           animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
//         } else {
//           const passed = maxLevel > 0.2; // Increased threshold for more reliable detection
//           setMicTestPassed(passed);
//           console.log('Microphone test passed:', passed);
//           console.log('Final max mic level:', maxLevel);
//           resolve();
//         }
//       };

//       checkAudioLevel();
//     });
//   };

//   const checkLowLight = () => {
//     return new Promise((resolve) => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) {
//         console.warn('Video not ready, skipping low light check');
//         resolve(false);
//         return;
//       }

//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);

//       try {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         let brightness = 0;

//         for (let i = 0; i < data.length; i += 4) {
//           // Using the luminance formula (0.299R + 0.587G + 0.114B)
//           brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
//         }

//         brightness /= (data.length / 4);
//         const lowLightThreshold = 0.3; // Adjust this value to fine-tune low light detection

//         console.log('Average brightness:', brightness);
//         console.log('Low light detected:', brightness < lowLightThreshold);

//         resolve(brightness < lowLightThreshold);
//       } catch (error) {
//         console.error('Error checking low light:', error);
//         resolve(false);
//       }
//     });
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ mt: 2, mb: 2 }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2 }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Test Cam/Mic'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', display: stream && !testPassed ? 'block' : 'none' }}
//         />
//         {isTesting && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               borderRadius: '8px',
//             }}
//           >
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {isTesting && (
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <Typography variant="body2" gutterBottom>
//             Microphone Level:
//           </Typography>
//           <LinearProgress variant="determinate" value={micLevel * 100} />
//         </Box>
//       )}
//       {testStatus && !testPassed && (
//         <Typography
//           sx={{
//             mt: 1,
//             color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//           }}
//         >
//           {testStatus}
//         </Typography>
//       )}
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Camera and microphone test passed successfully! You can now start the interview.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TestCamMic;



// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [micLevel, setMicLevel] = useState(0);
//   const [cameraTestPassed, setCameraTestPassed] = useState(false);
//   const [micTestPassed, setMicTestPassed] = useState(false);
//   const videoRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (testPassed) {
//       stopStream();
//       setSnackbarOpen(true);
//     }
//   }, [testPassed]);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }
//       setTestStatus('Testing camera and microphone...');
//       await testMicrophone(mediaStream);
//       const lowLight = await checkLowLight();
//       setCameraTestPassed(!lowLight);
      
//       updateTestStatus();
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const updateTestStatus = () => {
//     let status = '';
//     if (cameraTestPassed && micTestPassed) {
//       status = 'All tests passed successfully!';
//       onTestComplete(true);
//     } else {
//       if (cameraTestPassed) {
//         status += 'Camera test passed. ';
//       } else {
//         status += 'Camera test failed: Low light detected. Please improve lighting. ';
//       }
//       if (micTestPassed) {
//         status += 'Microphone test passed.';
//       } else {
//         status += 'Microphone test failed: Not detecting sufficient audio. Please check your microphone.';
//       }
//       onTestComplete(false);
//     }
//     setTestStatus(status);
//   };

//   const testMicrophone = (mediaStream) => {
//     return new Promise((resolve) => {
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       const source = audioContextRef.current.createMediaStreamSource(mediaStream);
//       source.connect(analyserRef.current);

//       analyserRef.current.fftSize = 256;
//       const bufferLength = analyserRef.current.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       let startTime = Date.now();
//       let maxLevel = 0;

//       const checkAudioLevel = () => {
//         analyserRef.current.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
//         const normalizedLevel = Math.min(average / 128, 1);
//         setMicLevel(normalizedLevel);
//         maxLevel = Math.max(maxLevel, normalizedLevel);

//         console.log('Current mic level:', normalizedLevel);
//         console.log('Max mic level:', maxLevel);

//         if (Date.now() - startTime < 5000) {
//           animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
//         } else {
//           const passed = maxLevel > 0.2; // Increased threshold for more reliable detection
//           setMicTestPassed(passed);
//           console.log('Microphone test passed:', passed);
//           console.log('Final max mic level:', maxLevel);
//           resolve();
//         }
//       };

//       checkAudioLevel();
//     });
//   };

//   const checkLowLight = () => {
//     return new Promise((resolve) => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) {
//         console.warn('Video not ready, skipping low light check');
//         resolve(false);
//         return;
//       }

//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);

//       try {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         let brightness = 0;

//         for (let i = 0; i < data.length; i += 4) {
//           // Using the luminance formula (0.299R + 0.587G + 0.114B)
//           brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
//         }

//         brightness /= (data.length / 4);
//         const lowLightThreshold = 0.3; // Adjust this value to fine-tune low light detection

//         console.log('Average brightness:', brightness);
//         console.log('Low light detected:', brightness < lowLightThreshold);

//         resolve(brightness < lowLightThreshold);
//       } catch (error) {
//         console.error('Error checking low light:', error);
//         resolve(false);
//       }
//     });
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ mt: 2, mb: 2 }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2 }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Test Cam/Mic'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', display: stream && !testPassed ? 'block' : 'none' }}
//         />
//         {isTesting && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//               borderRadius: '8px',
//             }}
//           >
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {isTesting && (
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <Typography variant="body2" gutterBottom>
//             Microphone Level:
//           </Typography>
//           <LinearProgress variant="determinate" value={micLevel * 100} />
//         </Box>
//       )}
//       {testStatus && (
//         <Typography
//           sx={{
//             mt: 1,
//             color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//           }}
//         >
//           {testStatus}
//         </Typography>
//       )}
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Camera and microphone test passed successfully! You can now start the interview.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TestCamMic;

//

// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [micLevel, setMicLevel] = useState(0);
//   const [cameraTestPassed, setCameraTestPassed] = useState(false);
//   const [micTestPassed, setMicTestPassed] = useState(false);

//   const videoRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (testPassed) {
//       stopStream();
//       setSnackbarOpen(true);
//     }
//   }, [testPassed]);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//   };

//   const testMicrophone = (mediaStream) => {
//     return new Promise((resolve) => {
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       const source = audioContextRef.current.createMediaStreamSource(mediaStream);
//       source.connect(analyserRef.current);
//       analyserRef.current.fftSize = 256;
//       const bufferLength = analyserRef.current.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       let startTime = Date.now();
//       let maxLevel = 0;

//       const checkAudioLevel = () => {
//         analyserRef.current.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
//         const normalizedLevel = Math.min(average / 128, 1);
//         setMicLevel(normalizedLevel);
//         maxLevel = Math.max(maxLevel, normalizedLevel);

//         if (Date.now() - startTime < 5000) {
//           animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
//         } else {
//           const passed = maxLevel > 0.4;
//           resolve(passed);
//         }
//       };

//       checkAudioLevel();
//     });
//   };

//   const checkLowLight = () => {
//     return new Promise((resolve) => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) {
//         console.warn('Video not ready, skipping low light check');
//         resolve(true);
//         return;
//       }

//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);

//       try {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         let brightness = 0;

//         for (let i = 0; i < data.length; i += 4) {
//           brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
//         }

//         brightness /= (data.length / 4);
//         const lowLightThreshold = 0.3;
//         const passed = brightness >= lowLightThreshold;
//         resolve(passed);
//       } catch (error) {
//         console.error('Error checking low light:', error);
//         resolve(true);
//       }
//     });
//   };

//   const updateTestStatus = (camPassed, micPassed) => {
//     let status = '';
//     const allTestsPassed = camPassed && micPassed;

//     if (allTestsPassed) {
//       status = 'All tests passed successfully!';
//     } else {
//       if (camPassed) {
//         status += 'Camera test passed. ';
//       } else {
//         status += 'Camera test failed: Low light detected. Please improve lighting. ';
//       }
//       if (micPassed) {
//         status += 'Microphone test passed.';
//       } else {
//         status += 'Microphone test failed: Not detecting sufficient audio. Please check your microphone.';
//       }
//     }

//     setTestStatus(status);
//     onTestComplete(allTestsPassed);
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');

//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);

//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }

//       setTestStatus('Testing camera and microphone...');

//       const micPassed = await testMicrophone(mediaStream);
//       const camPassed = await checkLowLight();

//       setCameraTestPassed(camPassed);
//       setMicTestPassed(micPassed);

//       updateTestStatus(camPassed, micPassed);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ mt: 2, mb: 2 }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2 }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Test Cam/Mic'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: '100%',
//             maxWidth: '400px',
//             borderRadius: '8px',
//             display: stream && !testPassed ? 'block' : 'none'
//           }}
//         />
//         {isTesting && (
//           <Box sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             borderRadius: '8px',
//           }}>
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {isTesting && (
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <Typography variant="body2" gutterBottom>
//             Microphone Level:
//           </Typography>
//           <LinearProgress variant="determinate" value={micLevel * 100} />
//         </Box>
//       )}
//       {testStatus && (
//         <Typography sx={{
//           mt: 1,
//           color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//         }}>
//           {testStatus}
//         </Typography>
//       )}
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Camera and microphone test passed successfully! You can now start the interview.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TestCamMic;


//updated new UI working 

// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [micLevel, setMicLevel] = useState(0);

//   const videoRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (testPassed) {
//       setSnackbarOpen(true);
//     }
//   }, [testPassed]);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//   };

//   const testMicrophone = (mediaStream) => {
//     return new Promise((resolve) => {
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       const source = audioContextRef.current.createMediaStreamSource(mediaStream);
//       source.connect(analyserRef.current);
//       analyserRef.current.fftSize = 256;
//       const bufferLength = analyserRef.current.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       let startTime = Date.now();
//       let maxLevel = 0;

//       const checkAudioLevel = () => {
//         analyserRef.current.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
//         const normalizedLevel = Math.min(average / 128, 1);
//         setMicLevel(normalizedLevel);
//         maxLevel = Math.max(maxLevel, normalizedLevel);

//         if (Date.now() - startTime < 5000) {
//           animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
//         } else {
//           const passed = maxLevel > 0.4;
//           resolve(passed);
//         }
//       };

//       checkAudioLevel();
//     });
//   };

//   const checkLowLight = () => {
//     return new Promise((resolve) => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) {
//         console.warn('Video not ready, skipping low light check');
//         resolve(true);
//         return;
//       }

//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);

//       try {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         let brightness = 0;

//         for (let i = 0; i < data.length; i += 4) {
//           brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
//         }

//         brightness /= (data.length / 4);
//         const lowLightThreshold = 0.3;
//         const passed = brightness >= lowLightThreshold;
//         resolve(passed);
//       } catch (error) {
//         console.error('Error checking low light:', error);
//         resolve(true);
//       }
//     });
//   };

//   const updateTestStatus = (camPassed, micPassed) => {
//     let status = '';
//     const allTestsPassed = camPassed && micPassed;

//     if (allTestsPassed) {
//       status = 'All tests passed successfully!';
//     } else {
//       if (camPassed) {
//         status += 'Camera test passed. ';
//       } else {
//         status += 'Camera test failed: Low light detected. Please improve lighting. ';
//       }
//       if (micPassed) {
//         status += 'Microphone test passed.';
//       } else {
//         status += 'Microphone test failed: Not detecting sufficient audio. Please check your microphone.';
//       }
//     }

//     setTestStatus(status);
//     onTestComplete(allTestsPassed);
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');

//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);

//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }

//       setTestStatus('Testing camera and microphone...');

//       const micPassed = await testMicrophone(mediaStream);
//       const camPassed = await checkLowLight();

//       updateTestStatus(camPassed, micPassed);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//       stopStream();
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2, width: '100%' }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Start Test'}
//       </Button>
//       <Box sx={{ mt: 2, mb: 2, position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//           }}
//         />
//         {isTesting && (
//           <Box sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           }}>
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {isTesting && (
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <Typography variant="body2" gutterBottom>
//             Microphone Level:
//           </Typography>
//           <LinearProgress variant="determinate" value={micLevel * 100} />
//         </Box>
//       )}
//       {testStatus && (
//         <Typography sx={{
//           mt: 1,
//           color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//         }}>
//           {testStatus}
//         </Typography>
//       )}
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Camera and microphone test passed successfully! You can now start the interview.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TestCamMic;


//

// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, Typography, CircularProgress, Snackbar, LinearProgress } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TestCamMic = ({ onTestComplete, rollNumber, testPassed }) => {
//   const [isTesting, setIsTesting] = useState(false);
//   const [testStatus, setTestStatus] = useState('');
//   const [stream, setStream] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [micLevel, setMicLevel] = useState(0);
//   const videoRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationFrameRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       stopStream();
//       cancelAnimationFrame(animationFrameRef.current);
//     };
//   }, []);

//   const stopStream = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//   };

//   const testMicrophone = (mediaStream) => {
//     return new Promise((resolve) => {
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       const source = audioContextRef.current.createMediaStreamSource(mediaStream);
//       source.connect(analyserRef.current);
//       analyserRef.current.fftSize = 256;
//       const bufferLength = analyserRef.current.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);
//       let startTime = Date.now();
//       let maxLevel = 0;

//       const checkAudioLevel = () => {
//         analyserRef.current.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
//         const normalizedLevel = Math.min(average / 128, 1);
//         setMicLevel(normalizedLevel);
//         maxLevel = Math.max(maxLevel, normalizedLevel);
//         if (Date.now() - startTime < 5000) {
//           animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
//         } else {
//           const passed = maxLevel > 0.4;
//           resolve(passed);
//         }
//       };
//       checkAudioLevel();
//     });
//   };

//   const checkLowLight = () => {
//     return new Promise((resolve) => {
//       if (!videoRef.current || videoRef.current.readyState !== 4) {
//         console.warn('Video not ready, skipping low light check');
//         resolve(true);
//         return;
//       }
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);
//       try {
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const data = imageData.data;
//         let brightness = 0;
//         for (let i = 0; i < data.length; i += 4) {
//           brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
//         }
//         brightness /= (data.length / 4);
//         const lowLightThreshold = 0.3;
//         const passed = brightness >= lowLightThreshold;
//         resolve(passed);
//       } catch (error) {
//         console.error('Error checking low light:', error);
//         resolve(true);
//       }
//     });
//   };

//   const updateTestStatus = (camPassed, micPassed) => {
//     let status = '';
//     const allTestsPassed = camPassed && micPassed;
//     if (allTestsPassed) {
//       status = 'All tests passed successfully!';
//       setSnackbarOpen(true);  // Ensure this line is executed when both tests pass
//     } else {
//       if (camPassed) {
//         status += 'Camera test passed. ';
//       } else {
//         status += 'Camera test failed: Low light detected. Please improve lighting. ';
//       }
//       if (micPassed) {
//         status += 'Microphone test passed.';
//       } else {
//         status += 'Microphone test failed: Not detecting sufficient audio. Please check your microphone.';
//       }
//     }
//     setTestStatus(status);
//     onTestComplete(allTestsPassed);
    
//     // Log the test results for debugging
//     console.log('Test Results:', { camPassed, micPassed, allTestsPassed, status });
//   };

//   const startTest = async () => {
//     setIsTesting(true);
//     setTestStatus('Accessing camera and microphone...');
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         await new Promise((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play();
//             resolve();
//           };
//         });
//       }
//       setTestStatus('Testing camera and microphone...');
//       const micPassed = await testMicrophone(mediaStream);
//       const camPassed = await checkLowLight();
//       updateTestStatus(camPassed, micPassed);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setTestStatus('Test failed: Unable to access camera or microphone.');
//       onTestComplete(false);
//     } finally {
//       setIsTesting(false);
//       stopStream();
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Button
//         variant="contained"
//         onClick={startTest}
//         disabled={isTesting || !rollNumber || testPassed}
//         sx={{ mb: 2, width: '100%' }}
//       >
//         {isTesting ? <CircularProgress size={24} /> : 'Start Test'}
//       </Button>
//       <Box
//         sx={{
//           mt: 2,
//           mb: 2,
//           position: 'relative',
//           width: '100%',
//           height: '300px',
//           backgroundColor: '#000',
//           borderRadius: '8px',
//           overflow: 'hidden'
//         }}
//       >
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//           }}
//         />
//         {isTesting && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             }}
//           >
//             <CircularProgress color="secondary" />
//           </Box>
//         )}
//       </Box>
//       {isTesting && (
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <Typography variant="body2" gutterBottom>
//             Microphone Level:
//           </Typography>
//           <LinearProgress variant="determinate" value={micLevel * 100} />
//         </Box>
//       )}
//       {testStatus && (
//         <Typography
//           sx={{
//             mt: 1,
//             color: testStatus.includes('failed') ? 'error.main' : 'success.main',
//           }}
//         >
//           {testStatus}
//         </Typography>
//       )}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//           Camera and microphone test passed successfully! You can now start the interview.
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default TestCamMic;


//


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



