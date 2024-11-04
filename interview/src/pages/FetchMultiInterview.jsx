import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from '../components/keys';
import InterviewList from '../components/MultiInterviewList';
import InterviewForm from '../components/MultiInterviewForm';
import VideoViewer from '../components/VideoViewer';

function FetchMultiInterview() {
  const [roomId, setRoomId] = useState('');
  const [interviewStatus, setInterviewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [interviews, setInterviews] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  useEffect(() => {
    fetchAllInterviews();
  }, []);

  const fetchAllInterviews = async () => {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "test1",
        Prefix: "Multi_Interview/",
        Delimiter: "/",
      });
      
      const listResponse = await s3Client.send(listCommand);
      
      if (listResponse.CommonPrefixes) {
        const interviewList = await Promise.all(
          listResponse.CommonPrefixes.map(async (prefix) => {
            const roomId = prefix.Prefix.split('/')[1];
            const dateTimeCommand = new ListObjectsV2Command({
              Bucket: "test1",
              Prefix: `Multi_Interview/${roomId}/`,
              MaxKeys: 1,
            });
            const dateTimeResponse = await s3Client.send(dateTimeCommand);
            const dateTime = dateTimeResponse.Contents?.[0]?.LastModified?.toLocaleString() || 'Unknown';
            return { roomId, dateTime };
          })
        );
        setInterviews(interviewList);
      }
    } catch (error) {
      console.error('Error fetching all interviews:', error);
    }
  };

  const fetchInterview = async (roomIdToFetch) => {
    setIsLoading(true);
    setInterviewStatus(`Fetching interview for Room ID: ${roomIdToFetch}`);
    setFetchedVideos([]);
    setCurrentVideoIndex(0);

    const folderPrefix = `Multi_Interview/${roomIdToFetch}/`;

    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "test1",
        Prefix: folderPrefix,
      });

      const listResponse = await s3Client.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        throw new Error('No videos found');
      }

      const videoFiles = listResponse.Contents.filter(item => 
        item.Key?.endsWith('_recording.webm')
      );

      const videos = await Promise.all(videoFiles.map(async (videoFile) => {
        const videoKey = videoFile.Key;
        const videoCommand = new GetObjectCommand({
          Bucket: "test1",
          Key: videoKey,
        });
        const videoUrl = await getSignedUrl(s3Client, videoCommand, { expiresIn: 3600 });
        
        return { url: videoUrl };
      }));

      setFetchedVideos(videos);
      setInterviewStatus(`${videos.length} interview video(s) fetched successfully for Room ID: ${roomIdToFetch}`);
    } catch (error) {
      console.error('Error fetching interview:', error);
      setFetchedVideos([]);
      setInterviewStatus(`No recorded interview found for Room ID: ${roomIdToFetch}`);
    } finally {
      setIsLoading(false);
    }
    setShowVideos(true);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => 
      (prevIndex < fetchedVideos.length - 1 ? prevIndex + 1 : prevIndex)
    );
  };

  const handleGoBack = () => {
    setShowVideos(false);
    setFetchedVideos([]);
    setCurrentVideoIndex(0);
    setInterviewStatus('');
    setSelectedRoomId('');
    setRoomId('');
    fetchAllInterviews();
  };

  const handlePlayVideo = (roomIdToPlay) => {
    setSelectedRoomId(roomIdToPlay);
    fetchInterview(roomIdToPlay);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1000px', margin: '0 auto' }}>
      {!showVideos ? (
        <>
          <InterviewForm
            roomId={roomId}
            setRoomId={setRoomId}
            handlePlayVideo={handlePlayVideo}
            isLoading={isLoading}
          />
          <InterviewList
            interviews={interviews}
            onPlayVideo={handlePlayVideo}
            onDeleteInterview={fetchAllInterviews}
          />
        </>
      ) : (
        <VideoViewer
          selectedRoomId={selectedRoomId}
          fetchedVideos={fetchedVideos}
          currentVideoIndex={currentVideoIndex}
          handlePrevVideo={handlePrevVideo}
          handleNextVideo={handleNextVideo}
          handleGoBack={handleGoBack}
          interviewStatus={interviewStatus}
        />
      )}
    </Box>
  );
}

export default FetchMultiInterview;