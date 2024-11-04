
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
