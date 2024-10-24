//Start Interview

import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, IconButton } from '@mui/material';
import { RecordVoiceOver } from '@mui/icons-material';

const QuestionCard = ({
  isRecording,
  currentQuestionIndex,
  questions,
  isTTSEnabled,
  isTTSPlaying,
  toggleTTS,
  handleNextQuestion,
  interviewStatus,
  theme
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {isRecording ? (
        <>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <IconButton
                onClick={toggleTTS}
                sx={{ color: isTTSEnabled ? (isTTSPlaying ? theme.palette.primary.main : 'inherit') : 'grey' }}
              >
                <RecordVoiceOver />
              </IconButton>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', fontWeight: 'medium' }}>
              "{questions[currentQuestionIndex]}"
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', padding: '16px' }}>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: '10px 30px',
              }}
            >
              Next Question
            </Button>
          </CardActions>
        </>
      ) : (
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: theme.palette.text.secondary, textAlign: 'center' }}>
            {interviewStatus}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default QuestionCard;