import React from 'react';
import { TextField, Button, Grid, CircularProgress, Paper, Typography } from '@mui/material';

const InterviewForm = ({ roomId, setRoomId, handlePlayVideo, isLoading }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5', mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
        Fetch Multi-Interview
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Room ID"
            variant="outlined"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handlePlayVideo(roomId)}
            disabled={!roomId || isLoading}
            sx={{ height: '56px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Retrieve Interview'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InterviewForm;