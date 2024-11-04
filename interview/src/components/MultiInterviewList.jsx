import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { PlayArrow, Delete } from '@mui/icons-material';
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from '../components/keys';

function InterviewList({ interviews, onPlayVideo, onDeleteInterview }) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState('');

  const handleDeleteInterview = async () => {
    setDeleteConfirmOpen(false);
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "test1",
        Prefix: `Multi_Interview/${deleteRoomId}/`,
      });

      const listResponse = await s3Client.send(listCommand);

      if (listResponse.Contents) {
        await Promise.all(
          listResponse.Contents.map(async (item) => {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: "test1",
              Key: item.Key,
            });
            await s3Client.send(deleteCommand);
          })
        );
      }
      onDeleteInterview();
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  // Sort interviews by roomId
  const sortedInterviews = [...interviews].sort((a, b) => {
    return a.roomId.localeCompare(b.roomId, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

  return (
    <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}
      >
        Available Multi-Interviews
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Room ID</TableCell>
              <TableCell>Date and Time</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedInterviews.map((interview) => (
              <TableRow key={interview.roomId}>
                <TableCell>{interview.roomId}</TableCell>
                <TableCell>{interview.dateTime}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => onPlayVideo(interview.roomId)}
                    color="primary"
                  >
                    <PlayArrow />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeleteRoomId(interview.roomId);
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the interview for Room ID {deleteRoomId}?
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