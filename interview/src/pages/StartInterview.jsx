// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Grid, Paper, ThemeProvider } from '@mui/material';
// import VideoRecording from '../components/VideoRecording';
// import QuestionCard from '../components/QuestionCard';
// import { useInterviewLogic } from '../components/useInterviewLogic';
// import { theme } from '../components/Theme';
// import { questions } from '../components/questions';
// import TestCamMic from '../components/TestCamMic';

// export default function StartInterview() {
//   const {
//     rollNumber,
//     setRollNumber,
//     interviewStatus,
//     isRecording,
//     isCameraOn,
//     setIsCameraOn,
//     isMicOn,
//     setIsMicOn,
//     isCCOn,
//     setIsCCOn,
//     transcript,
//     currentQuestionIndex,
//     remainingTime,
//     showWarning,
//     interviewStarted,
//     isTTSEnabled,
//     isTTSPlaying,
//     videoStream,
//     setVideoStream,
//     startInterview,
//     handleNextQuestion,
//     endInterview,
//     toggleCamera,
//     toggleMic,
//     toggleCC,
//     toggleTTS,
//     handleLowLightEndInterview
//   } = useInterviewLogic();

//   const [testPassed, setTestPassed] = useState(false);

//   const handleTestComplete = (passed) => {
//     setTestPassed(passed);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
//         <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f8f8f8', borderRadius: '12px' }}>
//           <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
//             Start Interview
//           </Typography>
//           <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Candidate Roll Number"
//                 variant="outlined"
//                 value={rollNumber}
//                 onChange={(e) => setRollNumber(e.target.value)}
//                 disabled={isRecording}
//                 sx={{ backgroundColor: 'white', '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, }, }, }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TestCamMic
//                 onTestComplete={handleTestComplete}
//                 rollNumber={rollNumber}
//                 testPassed={testPassed}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={isRecording ? endInterview : startInterview}
//                 disabled={!rollNumber || !testPassed || (isRecording && currentQuestionIndex !== questions.length - 1)}
//                 sx={{ height: '56px', backgroundColor: isRecording ? theme.palette.secondary.main : theme.palette.primary.main, '&:hover': { backgroundColor: isRecording ? theme.palette.secondary.dark : theme.palette.primary.dark, }, fontWeight: 'bold', fontSize: '1rem', }}
//               >
//                 {isRecording ? 'End Interview' : 'Start Interview'}
//               </Button>
//             </Grid>
//           </Grid>

//           {interviewStatus && (
//             <Typography
//               sx={{
//                 mt: 2,
//                 mb: 3,
//                 textAlign: 'center',
//                 fontWeight: 'medium',
//                 fontSize: '1.1rem',
//                 color: interviewStatus.includes('Error') ? theme.palette.error.main : theme.palette.success.main,
//                 padding: '10px',
//                 backgroundColor: interviewStatus.includes('Error') ? '#ffebee' : '#e8f5e9',
//                 borderRadius: '8px',
//               }}
//             >
//               {interviewStatus}
//             </Typography>
//           )}

//           {interviewStarted && (
//             <Grid container spacing={4}>
//               <Grid item xs={12} md={8}>
//                 <VideoRecording
//                   isRecording={isRecording}
//                   isCameraOn={isCameraOn}
//                   setIsCameraOn={setIsCameraOn}
//                   isMicOn={isMicOn}
//                   setIsMicOn={setIsMicOn}
//                   isCCOn={isCCOn}
//                   setIsCCOn={setIsCCOn}
//                   remainingTime={remainingTime}
//                   showWarning={showWarning}
//                   transcript={transcript}
//                   onToggleCamera={toggleCamera}
//                   onToggleMic={toggleMic}
//                   onToggleCC={toggleCC}
//                   theme={theme}
//                   videoStream={videoStream}
//                   onEndInterview={handleLowLightEndInterview}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <QuestionCard
//                   isRecording={isRecording}
//                   currentQuestionIndex={currentQuestionIndex}
//                   questions={questions}
//                   isTTSEnabled={isTTSEnabled}
//                   isTTSPlaying={isTTSPlaying}
//                   toggleTTS={toggleTTS}
//                   handleNextQuestion={handleNextQuestion}
//                   interviewStatus={interviewStatus}
//                   theme={theme}
//                 />
//               </Grid>
//             </Grid>
//           )}
//         </Paper>
//       </Box>
//     </ThemeProvider>
//   );
// }

//updated UI 


// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Grid, Paper, ThemeProvider } from '@mui/material';
// import VideoRecording from '../components/VideoRecording';
// import QuestionCard from '../components/QuestionCard';
// import { useInterviewLogic } from '../components/useInterviewLogic';
// import { theme } from '../components/Theme';
// import { questions } from '../components/questions';
// import TestCamMic from '../components/TestCamMic';

// export default function StartInterview() {
//   const {
//     rollNumber,
//     setRollNumber,
//     interviewStatus,
//     isRecording,
//     isCameraOn,
//     setIsCameraOn,
//     isMicOn,
//     setIsMicOn,
//     isCCOn,
//     setIsCCOn,
//     transcript,
//     currentQuestionIndex,
//     remainingTime,
//     showWarning,
//     interviewStarted,
//     isTTSEnabled,
//     isTTSPlaying,
//     videoStream,
//     setVideoStream,
//     startInterview,
//     handleNextQuestion,
//     endInterview,
//     toggleCamera,
//     toggleMic,
//     toggleCC,
//     toggleTTS,
//     handleLowLightEndInterview
//   } = useInterviewLogic();

//   const [testPassed, setTestPassed] = useState(false);
//   const [showTestVideo, setShowTestVideo] = useState(false);

//   const handleTestComplete = (passed) => {
//     setTestPassed(passed);
//     if (passed) {
//       setShowTestVideo(false);
//     }
//   };

//   const handleStartTest = () => {
//     setShowTestVideo(true);
//     setTestPassed(false);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
//         <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f8f8f8', borderRadius: '12px' }}>
//           <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
//             Start Interview
//           </Typography>
//           <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Candidate Roll Number"
//                 variant="outlined"
//                 value={rollNumber}
//                 onChange={(e) => setRollNumber(e.target.value)}
//                 disabled={isRecording}
//                 sx={{
//                   backgroundColor: 'white',
//                   '& .MuiOutlinedInput-root': {
//                     height: '56px',
//                     '&.Mui-focused fieldset': {
//                       borderColor: theme.palette.primary.main,
//                     },
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={handleStartTest}
//                 disabled={!rollNumber || isRecording}
//                 sx={{
//                   height: '56px',
//                   backgroundColor: theme.palette.secondary.main,
//                   '&:hover': {
//                     backgroundColor: theme.palette.secondary.dark,
//                   },
//                   fontWeight: 'bold',
//                   fontSize: '1rem',
//                 }}
//               >
//                 Test Cam/Mic
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={isRecording ? endInterview : startInterview}
//                 disabled={!rollNumber || !testPassed || (isRecording && currentQuestionIndex !== questions.length - 1)}
//                 sx={{
//                   height: '56px',
//                   backgroundColor: isRecording ? theme.palette.secondary.main : theme.palette.primary.main,
//                   '&:hover': {
//                     backgroundColor: isRecording ? theme.palette.secondary.dark : theme.palette.primary.dark,
//                   },
//                   fontWeight: 'bold',
//                   fontSize: '1rem',
//                 }}
//               >
//                 {isRecording ? 'End Interview' : 'Start Interview'}
//               </Button>
//             </Grid>
//           </Grid>

//           {showTestVideo && (
//             <Box sx={{ mt: 4, mb: 4 }}>
//               <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fff', borderRadius: '8px' }}>
//                 <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
//                   Camera and Microphone Test
//                 </Typography>
//                 <TestCamMic
//                   onTestComplete={handleTestComplete}
//                   rollNumber={rollNumber}
//                   testPassed={testPassed}
//                 />
//               </Paper>
//             </Box>
//           )}

//           {interviewStatus && (
//             <Typography
//               sx={{
//                 mt: 2,
//                 mb: 3,
//                 textAlign: 'center',
//                 fontWeight: 'medium',
//                 fontSize: '1.1rem',
//                 color: interviewStatus.includes('Error') ? theme.palette.error.main : theme.palette.success.main,
//                 padding: '10px',
//                 backgroundColor: interviewStatus.includes('Error') ? '#ffebee' : '#e8f5e9',
//                 borderRadius: '8px',
//               }}
//             >
//               {interviewStatus}
//             </Typography>
//           )}
//           {interviewStarted && (
//             <Grid container spacing={4}>
//               <Grid item xs={12} md={8}>
//                 <VideoRecording
//                   isRecording={isRecording}
//                   isCameraOn={isCameraOn}
//                   setIsCameraOn={setIsCameraOn}
//                   isMicOn={isMicOn}
//                   setIsMicOn={setIsMicOn}
//                   isCCOn={isCCOn}
//                   setIsCCOn={setIsCCOn}
//                   remainingTime={remainingTime}
//                   showWarning={showWarning}
//                   transcript={transcript}
//                   onToggleCamera={toggleCamera}
//                   onToggleMic={toggleMic}
//                   onToggleCC={toggleCC}
//                   theme={theme}
//                   videoStream={videoStream}
//                   onEndInterview={handleLowLightEndInterview}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <QuestionCard
//                   isRecording={isRecording}
//                   currentQuestionIndex={currentQuestionIndex}
//                   questions={questions}
//                   isTTSEnabled={isTTSEnabled}
//                   isTTSPlaying={isTTSPlaying}
//                   toggleTTS={toggleTTS}
//                   handleNextQuestion={handleNextQuestion}
//                   interviewStatus={interviewStatus}
//                   theme={theme}
//                 />
//               </Grid>
//             </Grid>
//           )}
//         </Paper>
//       </Box>
//     </ThemeProvider>
//   );
// }


// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Grid, Paper, ThemeProvider, Snackbar } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';
// import VideoRecording from '../components/VideoRecording';
// import QuestionCard from '../components/QuestionCard';
// import { useInterviewLogic } from '../components/useInterviewLogic';
// import { theme } from '../components/Theme';
// import { questions } from '../components/questions';
// import TestCamMic from '../components/TestCamMic';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// export default function StartInterview() {
//   const {
//     rollNumber,
//     setRollNumber,
//     interviewStatus,
//     isRecording,
//     isCameraOn,
//     setIsCameraOn,
//     isMicOn,
//     setIsMicOn,
//     isCCOn,
//     setIsCCOn,
//     transcript,
//     currentQuestionIndex,
//     remainingTime,
//     showWarning,
//     interviewStarted,
//     isTTSEnabled,
//     isTTSPlaying,
//     videoStream,
//     setVideoStream,
//     startInterview,
//     handleNextQuestion,
//     endInterview,
//     toggleCamera,
//     toggleMic,
//     toggleCC,
//     toggleTTS,
//     handleLowLightEndInterview
//   } = useInterviewLogic();

//   const [testPassed, setTestPassed] = useState(false);
//   const [showTestVideo, setShowTestVideo] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const handleTestComplete = (passed) => {
//     setTestPassed(passed);
//     if (passed) {
//       setShowTestVideo(false);
//       setSnackbarOpen(true);
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   const handleStartTest = () => {
//     setShowTestVideo(true);
//     setTestPassed(false);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
//         <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f8f8f8', borderRadius: '12px' }}>
//           <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
//             Start Interview
//           </Typography>
//           <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Candidate Roll Number"
//                 variant="outlined"
//                 value={rollNumber}
//                 onChange={(e) => setRollNumber(e.target.value)}
//                 disabled={isRecording}
//                 sx={{
//                   backgroundColor: 'white',
//                   '& .MuiOutlinedInput-root': {
//                     height: '56px',
//                     '&.Mui-focused fieldset': {
//                       borderColor: theme.palette.primary.main,
//                     },
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={handleStartTest}
//                 disabled={!rollNumber || isRecording}
//                 sx={{
//                   height: '56px',
//                   backgroundColor: theme.palette.secondary.main,
//                   '&:hover': {
//                     backgroundColor: theme.palette.secondary.dark,
//                   },
//                   fontWeight: 'bold',
//                   fontSize: '1rem',
//                 }}
//               >
//                 Test Cam/Mic
//               </Button>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 onClick={isRecording ? endInterview : startInterview}
//                 disabled={!rollNumber || !testPassed || (isRecording && currentQuestionIndex !== questions.length - 1)}
//                 //disabled={!rollNumber  || (isRecording && currentQuestionIndex !== questions.length - 1)}
//                 sx={{
//                   height: '56px',
//                   backgroundColor: isRecording ? theme.palette.secondary.main : theme.palette.primary.main,
//                   '&:hover': {
//                     backgroundColor: isRecording ? theme.palette.secondary.dark : theme.palette.primary.dark,
//                   },
//                   fontWeight: 'bold',
//                   fontSize: '1rem',
//                 }}
//               >
//                 {isRecording ? 'End Interview' : 'Start Interview'}
//               </Button>
//             </Grid>
//           </Grid>

//           {showTestVideo && (
//             <Box sx={{ mt: 4, mb: 4 }}>
//               <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fff', borderRadius: '8px' }}>
//                 <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
//                   Camera and Microphone Test
//                 </Typography>
//                 <TestCamMic
//                   onTestComplete={handleTestComplete}
//                   rollNumber={rollNumber}
//                   testPassed={testPassed}
//                 />
//               </Paper>
//             </Box>
//           )}

//           {interviewStatus && (
//             <Typography
//               sx={{
//                 mt: 2,
//                 mb: 3,
//                 textAlign: 'center',
//                 fontWeight: 'medium',
//                 fontSize: '1.1rem',
//                 color: interviewStatus.includes('Error') ? theme.palette.error.main : theme.palette.success.main,
//                 padding: '10px',
//                 backgroundColor: interviewStatus.includes('Error') ? '#ffebee' : '#e8f5e9',
//                 borderRadius: '8px',
//               }}
//             >
//               {interviewStatus}
//             </Typography>
//           )}
//           {interviewStarted && (
//             <Grid container spacing={4}>
//               <Grid item xs={12} md={8}>
//                 <VideoRecording
//                   isRecording={isRecording}
//                   isCameraOn={isCameraOn}
//                   setIsCameraOn={setIsCameraOn}
//                   isMicOn={isMicOn}
//                   setIsMicOn={setIsMicOn}
//                   isCCOn={isCCOn}
//                   setIsCCOn={setIsCCOn}
//                   remainingTime={remainingTime}
//                   showWarning={showWarning}
//                   transcript={transcript}
//                   onToggleCamera={toggleCamera}
//                   onToggleMic={toggleMic}
//                   onToggleCC={toggleCC}
//                   theme={theme}
//                   videoStream={videoStream}
//                   onEndInterview={handleLowLightEndInterview}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <QuestionCard
//                   isRecording={isRecording}
//                   currentQuestionIndex={currentQuestionIndex}
//                   questions={questions}
//                   isTTSEnabled={isTTSEnabled}
//                   isTTSPlaying={isTTSPlaying}
//                   toggleTTS={toggleTTS}
//                   handleNextQuestion={handleNextQuestion}
//                   interviewStatus={interviewStatus}
//                   theme={theme}
//                 />
//               </Grid>
//             </Grid>
//           )}
//         </Paper>
//         <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//   <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
//     Camera and microphone test passed successfully! You can now start the interview.
//   </Alert>
// </Snackbar>
//       </Box>
//     </ThemeProvider>
//   );
// }

//updated VB to save in minio

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, ThemeProvider, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import VideoRecording from '../components/VideoRecording';
import QuestionCard from '../components/QuestionCard';
import { useInterviewLogic } from '../components/useInterviewLogic';
import { theme } from '../components/Theme';
import { questions } from '../components/questions';
import TestCamMic from '../components/TestCamMic';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StartInterview() {
  const {
    rollNumber,
    setRollNumber,
    interviewStatus,
    isRecording,
    isCameraOn,
    setIsCameraOn,
    isMicOn,
    setIsMicOn,
    isCCOn,
    setIsCCOn,
    transcript,
    currentQuestionIndex,
    remainingTime,
    showWarning,
    interviewStarted,
    isTTSEnabled,
    isTTSPlaying,
    videoStream,
    setVideoStream,
    startInterview,
    handleNextQuestion,
    endInterview,
    toggleCamera,
    toggleMic,
    toggleCC,
    toggleTTS,
    handleLowLightEndInterview,
    handleFrameCapture,
  } = useInterviewLogic();

  const [testPassed, setTestPassed] = useState(false);
  const [showTestVideo, setShowTestVideo] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTestComplete = (passed) => {
    setTestPassed(passed);
    if (passed) {
      setShowTestVideo(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleStartTest = () => {
    setShowTestVideo(true);
    setTestPassed(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f8f8f8', borderRadius: '12px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
            Start Interview
          </Typography>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Candidate Roll Number"
                variant="outlined"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                disabled={isRecording}
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleStartTest}
                disabled={!rollNumber || isRecording}
                sx={{
                  height: '56px',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Test Cam/Mic
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={isRecording ? endInterview : startInterview}
                disabled={!rollNumber || !testPassed || (isRecording && currentQuestionIndex !== questions.length - 1)}
                //to skip 
                //disabled={!rollNumber  || (isRecording && currentQuestionIndex !== questions.length - 1)}
                sx={{
                  height: '56px',
                  backgroundColor: isRecording ? theme.palette.secondary.main : theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: isRecording ? theme.palette.secondary.dark : theme.palette.primary.dark,
                  },
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {isRecording ? 'End Interview' : 'Start Interview'}
              </Button>
            </Grid>
          </Grid>

          {showTestVideo && (
            <Box sx={{ mt: 4, mb: 4 }}>
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fff', borderRadius: '8px' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                  Camera and Microphone Test
                </Typography>
                <TestCamMic
                  onTestComplete={handleTestComplete}
                  rollNumber={rollNumber}
                  testPassed={testPassed}
                />
              </Paper>
            </Box>
          )}

          {interviewStatus && (
            <Typography
              sx={{
                mt: 2,
                mb: 3,
                textAlign: 'center',
                fontWeight: 'medium',
                fontSize: '1.1rem',
                color: interviewStatus.includes('Error') ? theme.palette.error.main : theme.palette.success.main,
                padding: '10px',
                backgroundColor: interviewStatus.includes('Error') ? '#ffebee' : '#e8f5e9',
                borderRadius: '8px',
              }}
            >
              {interviewStatus}
            </Typography>
          )}
          {interviewStarted && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <VideoRecording
                  isRecording={isRecording}
                  isCameraOn={isCameraOn}
                  setIsCameraOn={setIsCameraOn}
                  isMicOn={isMicOn}
                  setIsMicOn={setIsMicOn}
                  isCCOn={isCCOn}
                  setIsCCOn={setIsCCOn}
                  remainingTime={remainingTime}
                  showWarning={showWarning}
                  transcript={transcript}
                  onToggleCamera={toggleCamera}
                  onToggleMic={toggleMic}
                  onToggleCC={toggleCC}
                  theme={theme}
                  videoStream={videoStream}
                  onEndInterview={handleLowLightEndInterview}
                  onFrameCapture={handleFrameCapture}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <QuestionCard
                  isRecording={isRecording}
                  currentQuestionIndex={currentQuestionIndex}
                  questions={questions}
                  isTTSEnabled={isTTSEnabled}
                  isTTSPlaying={isTTSPlaying}
                  toggleTTS={toggleTTS}
                  handleNextQuestion={handleNextQuestion}
                  interviewStatus={interviewStatus}
                  theme={theme}
                />
              </Grid>
            </Grid>
          )}
        </Paper>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
  <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
    Camera and microphone test passed successfully! You can now start the interview.
  </Alert>
</Snackbar>
      </Box>
    </ThemeProvider>
  );
}