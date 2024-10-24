import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from '../components/keys';
import InterviewList from '../components/InterviewList';
import InterviewForm from '../components/InterviewForm';
import VideoViewer from '../components/VideoViewer';

function FetchInterview() {
  const [rollNumber, setRollNumber] = useState('');
  const [interviewStatus, setInterviewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [interviews, setInterviews] = useState([]);
  const [showVideos, setShowVideos] = useState(false);
  const [selectedRollNumber, setSelectedRollNumber] = useState('');

  useEffect(() => {
    fetchAllInterviews();
  }, []);

  const fetchAllInterviews = async () => {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "test1",
        Prefix: "interviews/",
        Delimiter: "/",
      });
      const listResponse = await s3Client.send(listCommand);
      if (listResponse.CommonPrefixes) {
        const interviewList = await Promise.all(
          listResponse.CommonPrefixes.map(async (prefix) => {
            const rollNumber = prefix.Prefix.split('/')[1];
            const dateTimeCommand = new ListObjectsV2Command({
              Bucket: "test1",
              Prefix: `interviews/${rollNumber}/`,
              MaxKeys: 1,
            });
            const dateTimeResponse = await s3Client.send(dateTimeCommand);
            const dateTime = dateTimeResponse.Contents?.[0]?.LastModified?.toLocaleString() || 'Unknown';
            return { rollNumber, dateTime };
          })
        );
        setInterviews(interviewList);
      }
    } catch (error) {
      console.error('Error fetching all interviews:', error);
    }
  };

  const fetchInterview = async (rollNumberToFetch) => {
    setIsLoading(true);
    setInterviewStatus(`Fetching interview for Roll Number: ${rollNumberToFetch}`);
    setFetchedVideos([]);
    setCurrentVideoIndex(0);
    const folderPrefix = `interviews/${rollNumberToFetch}/`;
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: "test1",
        Prefix: folderPrefix,
      });
      const listResponse = await s3Client.send(listCommand);
      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        throw new Error('No videos found');
      }
      const videoFiles = listResponse.Contents.filter(item => item.Key?.endsWith('_interview.webm'));
      const captionFiles = listResponse.Contents.filter(item => item.Key?.endsWith('_captions.vtt'));
      const videos = await Promise.all(videoFiles.map(async (videoFile) => {
        const videoKey = videoFile.Key;
        const videoCommand = new GetObjectCommand({
          Bucket: "test1",
          Key: videoKey,
        });
        const videoUrl = await getSignedUrl(s3Client, videoCommand, { expiresIn: 3600 });
        const captionKey = captionFiles.find(item => item.Key?.replace('_captions.vtt', '') === videoKey.replace('_interview.webm', ''))?.Key;
        let captionsContent = '';
        if (captionKey) {
          const captionsCommand = new GetObjectCommand({
            Bucket: "test1",
            Key: captionKey,
          });
          const captionsUrl = await getSignedUrl(s3Client, captionsCommand, { expiresIn: 3600 });
          const captionsResponse = await fetch(captionsUrl);
          if (captionsResponse.ok) {
            captionsContent = await captionsResponse.text();
          }
        }
        return { url: videoUrl, captions: captionsContent };
      }));
      setFetchedVideos(videos);
      setInterviewStatus(`${videos.length} interview video(s) fetched successfully for Roll Number: ${rollNumberToFetch}`);
    } catch (error) {
      console.error('Error fetching interview:', error);
      setFetchedVideos([]);
      setInterviewStatus(`No recorded interview found for Roll Number: ${rollNumberToFetch}`);
    } finally {
      setIsLoading(false);
    }
    setShowVideos(true);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex < fetchedVideos.length - 1 ? prevIndex + 1 : prevIndex));
  };

  const handleGoBack = () => {
    setShowVideos(false);
    setFetchedVideos([]);
    setCurrentVideoIndex(0);
    setInterviewStatus('');
    setSelectedRollNumber('');
    setRollNumber('');
    fetchAllInterviews();
  };

  const handlePlayVideo = (rollNumberToPlay) => {
    setSelectedRollNumber(rollNumberToPlay);
    fetchInterview(rollNumberToPlay);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1000px', margin: '0 auto' }}>
      {!showVideos ? (
        <>
          <InterviewForm
            rollNumber={rollNumber}
            setRollNumber={setRollNumber}
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
          selectedRollNumber={selectedRollNumber}
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

export default FetchInterview;