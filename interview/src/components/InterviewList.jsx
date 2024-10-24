//fetch interview 
import React, { useState } from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { PlayArrow, Delete } from '@mui/icons-material';
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from '../components/keys';

function InterviewList({ interviews, onPlayVideo, onDeleteInterview }) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteRollNumber, setDeleteRollNumber] = useState('');

  const handleDeleteInterview = async () => {
    setDeleteConfirmOpen(false);
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "test1",
        Prefix: `interviews/${deleteRollNumber}/`,
      });
      const listResponse = await s3Client.send(listCommand);
      if (listResponse.Contents) {
        await Promise.all(listResponse.Contents.map(async (item) => {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: "test1",
            Key: item.Key,
          });
          await s3Client.send(deleteCommand);
        }));
      }
      onDeleteInterview();
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  const sortedInterviews = [...interviews].sort((a, b) => {
    return a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
        Available Interviews
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Roll Number</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedInterviews.map((interview) => (
              <TableRow key={interview.rollNumber}>
                <TableCell>{interview.rollNumber}</TableCell>
                <TableCell>{interview.dateTime}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onPlayVideo(interview.rollNumber)} color="primary">
                    <PlayArrow />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeleteRollNumber(interview.rollNumber);
                      setDeleteConfirmOpen(true);
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the interview for Roll Number {deleteRollNumber}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteInterview} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default InterviewList;