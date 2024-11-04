import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/startinterview');
  };

  const handleFetchInterview = () => {
    navigate('/fetchinterview');
  };

  const handleStartInterviewtwo = () => {
    navigate('/startinterviewtwo');
  };

  const handleJoinInterviewtwo = () => {
    navigate('/joininterviewtwo');
  };

  const handleFetchMultiInterview = () => {
    navigate('/fetchmultiinterview');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          AI Interview
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" color="primary" size="large" fullWidth onClick={handleStartInterview}>
            Start Interview
          </Button>
          <Button variant="outlined" color="primary" size="large" fullWidth onClick={handleFetchInterview}>
            Fetch Interview
          </Button>
          <Button variant="contained" color="primary" size="large" fullWidth onClick={handleStartInterviewtwo}>
            Start Interview Multi
          </Button>
          <Button variant="outlined" color="primary" size="large" fullWidth onClick={handleJoinInterviewtwo}>
            Join Interview Multi
          </Button>
          <Button variant="contained" color="primary" size="large" fullWidth onClick={handleFetchMultiInterview}>
            Fetch Multi Interview
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Home;

//for micro-frontend

// import React from 'react';
// import { Box, Button, Typography, Paper } from '@mui/material';

// function Home({ onNavigate }) {
//   const handleStartInterview = () => {
//     onNavigate('/startinterview');
//   };

//   const handleFetchInterview = () => {
//     onNavigate('/fetchinterview');
//   };

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
//       <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
//         <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
//           AI Interview
//         </Typography>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//           <Button variant="contained" color="primary" size="large" fullWidth onClick={handleStartInterview}>
//             Start Interview
//           </Button>
//           <Button variant="outlined" color="primary" size="large" fullWidth onClick={handleFetchInterview}>
//             Fetch Interview
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }

// export default Home;