// //Fetch Interview
// import React from 'react';
// import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
// import { ChevronLeft, ChevronRight } from '@mui/icons-material';
// import VideoPlayer from './VideoPlayer';

// const VideoViewer = ({ selectedRollNumber, fetchedVideos, currentVideoIndex, handlePrevVideo, handleNextVideo, handleGoBack, interviewStatus }) => {
//   return (
//     <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Button variant="outlined" onClick={handleGoBack}>
//           Go Back
//         </Button>
//         <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center', flexGrow: 1, mr: 10 }}>
//           Interview videos for Roll number: {selectedRollNumber}
//         </Typography>
//       </Box>
//       {fetchedVideos.length > 0 ? (
//         <Box>
//           <Box sx={{ mt: 2, maxWidth: '600px', margin: '0 auto' }}>
//             <VideoPlayer 
//               src={fetchedVideos[currentVideoIndex].url} 
//               captionsContent={fetchedVideos[currentVideoIndex].captions} 
//             />
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
//               <IconButton onClick={handlePrevVideo} disabled={currentVideoIndex === 0}>
//                 <ChevronLeft />
//               </IconButton>
//               <Typography variant="subtitle1" sx={{ mx: 2 }}>
//                 Video {currentVideoIndex + 1} of {fetchedVideos.length}
//               </Typography>
//               <IconButton onClick={handleNextVideo} disabled={currentVideoIndex === fetchedVideos.length - 1}>
//                 <ChevronRight />
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>
//       ) : (
//         <Typography sx={{ textAlign: 'center' }} color="error">
//           {interviewStatus}
//         </Typography>
//       )}
//     </Paper>
//   );
// };

// export default VideoViewer;

//added with topbar 

// import React from 'react';
// import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
// import { ChevronLeft, ChevronRight } from '@mui/icons-material';
// import VideoPlayer from './VideoPlayer';

// const VideoViewer = ({ selectedRollNumber, fetchedVideos, currentVideoIndex, handlePrevVideo, handleNextVideo, handleGoBack, interviewStatus }) => {
//   return (
//     <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
//       <Box sx={{
//         backgroundColor: '#1a3f6e',
//         color: 'white',
//         padding: '10px 20px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//           {selectedRollNumber}
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ marginRight: 2 }}>
//             Technology/Skill
//           </Typography>
//           <Typography variant="body2" sx={{ marginRight: 2 }}>
//             Position Applied for
//           </Typography>
//         </Box>
//       </Box>
      
//       <Button 
//         onClick={handleGoBack}
//         sx={{
//           position: 'absolute',
//           top: 10,
//           right: 10,
//           backgroundColor: '#4285f4',
//           color: 'white',
//           '&:hover': {
//             backgroundColor: '#3367d6',
//           },
//         }}
//       >
//         Close
//       </Button>

//       {fetchedVideos.length > 0 ? (
//         <Box>
//           {/* <Box sx={{ width: '100%' }}> */}
//           <Box sx={{ mt: 2, maxWidth: '700px', margin: '0 auto' }}>
//             <VideoPlayer 
//               src={fetchedVideos[currentVideoIndex].url} 
//               captionsContent={fetchedVideos[currentVideoIndex].captions} 
//             />
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 2 }}>
//               <IconButton onClick={handlePrevVideo} disabled={currentVideoIndex === 0}>
//                 <ChevronLeft />
//               </IconButton>
//               <Typography variant="subtitle1" sx={{ mx: 2 }}>
//                 Video {currentVideoIndex + 1} of {fetchedVideos.length}
//               </Typography>
//               <IconButton onClick={handleNextVideo} disabled={currentVideoIndex === fetchedVideos.length - 1}>
//                 <ChevronRight />
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>
//       ) : (
//         <Typography sx={{ textAlign: 'center', p: 2 }} color="error">
//           {interviewStatus}
//         </Typography>
//       )}
//     </Paper>
//   );
// };

// export default VideoViewer;

//updated video top bar with component 

import React from 'react';
import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import VideoPlayer from './VideoPlayer';
import TopBar from './VideoViewerTopBar';

const VideoViewer = ({ selectedRollNumber, fetchedVideos, currentVideoIndex, handlePrevVideo, handleNextVideo, handleGoBack, interviewStatus }) => {
  return (
    <Paper elevation={3} sx={{ overflow: 'hidden', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <TopBar selectedRollNumber={selectedRollNumber} />
      <Button
        onClick={handleGoBack}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: '#4285f4',
          color: 'white',
          '&:hover': {
            backgroundColor: '#3367d6',
          },
        }}
      >
        Close
      </Button>
      {fetchedVideos.length > 0 ? (
        <Box>
          <Box sx={{ mt: 2, maxWidth: '700px', margin: '0 auto' }}>
            <VideoPlayer
              src={fetchedVideos[currentVideoIndex].url}
              captionsContent={fetchedVideos[currentVideoIndex].captions}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 2 }}>
              <IconButton onClick={handlePrevVideo} disabled={currentVideoIndex === 0}>
                <ChevronLeft />
              </IconButton>
              <Typography variant="subtitle1" sx={{ mx: 2 }}>
                Video {currentVideoIndex + 1} of {fetchedVideos.length}
              </Typography>
              <IconButton onClick={handleNextVideo} disabled={currentVideoIndex === fetchedVideos.length - 1}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ textAlign: 'center', p: 2 }} color="error">
          {interviewStatus}
        </Typography>
      )}
    </Paper>
  );
};

export default VideoViewer;