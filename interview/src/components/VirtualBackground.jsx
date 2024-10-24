import React, { useEffect, useRef, useState } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const VirtualBackground = ({ videoStream, backgroundImage, isEnabled }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const requestAnimationRef = useRef(null);
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await bodyPix.load();
        setModel(loadedModel);
        console.log('BodyPix model loaded successfully');
      } catch (err) {
        console.error('Error loading BodyPix model:', err);
        setError('Failed to load BodyPix model');
      }
    };

    loadModel();

    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || !videoStream || !canvasRef.current || !model) return;

    const video = videoRef.current;
    video.srcObject = videoStream;
    video.play().catch(err => {
      console.error('Error playing video:', err);
      setError('Failed to play video');
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const background = new Image();
    background.crossOrigin = "Anonymous";  // Add this line to handle CORS issues
    background.src = backgroundImage;
    background.onload = () => {
      console.log('Background image loaded successfully');
      setIsBackgroundLoaded(true);
      backgroundImageRef.current = background;
    };
    background.onerror = (err) => {
      console.error('Error loading background image:', err);
      setError(`Failed to load background image: ${err.message}`);
    };

    const animate = async () => {
      if (!model || !video.videoWidth || !isBackgroundLoaded) {
        requestAnimationRef.current = requestAnimationFrame(animate);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
        const segmentation = await model.segmentPerson(video);
        const maskImage = bodyPix.toMask(segmentation);

        ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          if (maskImage.data[i / 4] === 0) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        console.error('Error processing frame:', err);
        setError(`Error processing frame: ${err.message}`);
      }

      requestAnimationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, [videoStream, backgroundImage, isEnabled, model, isBackgroundLoaded]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default VirtualBackground;