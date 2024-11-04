
import { useState, useRef, useEffect } from 'react';
import { s3Client } from './keys';
import { questions } from './questions';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import WebMWriter from 'webm-writer';

export const useInterviewLogic = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [interviewStatus, setInterviewStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCCOn, setIsCCOn] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(30);
  const [showWarning, setShowWarning] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const capturedFramesRef = useRef([]);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const captionsBufferRef = useRef([]);
  const lastCaptionTimeRef = useRef(0);
  const interimTranscriptRef = useRef('');
  const recordingStartTimeRef = useRef(0);
  const ttsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) {
      ttsRef.current = new window.SpeechSynthesisUtterance();
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime === 11) {
            setShowWarning(true);
          }
          if (prevTime === 1) {
            if (currentQuestionIndex === questions.length - 1) {
              endInterview();
            } else {
              handleNextQuestion();
            }
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, remainingTime, currentQuestionIndex]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        if (!isMicOn) return;
        const currentTime = (Date.now() - recordingStartTimeRef.current) / 1000;
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          const newCaption = {
            start: lastCaptionTimeRef.current,
            end: currentTime,
            text: finalTranscript.trim()
          };
          captionsBufferRef.current.push(newCaption);
          lastCaptionTimeRef.current = currentTime;
          interimTranscriptRef.current = '';
        } else {
          interimTranscriptRef.current = interimTranscript;
        }
        setTranscript(prevTranscript => {
          const completedTranscript = captionsBufferRef.current.map(c => c.text).join(' ');
          return completedTranscript + (interimTranscript ? ' ' + interimTranscript : '');
        });
      };
      recognitionRef.current.onend = () => {
        if (interimTranscriptRef.current) {
          const currentTime = (Date.now() - recordingStartTimeRef.current) / 1000;
          captionsBufferRef.current.push({
            start: lastCaptionTimeRef.current,
            end: currentTime,
            text: interimTranscriptRef.current.trim()
          });
          interimTranscriptRef.current = '';
          setTranscript(captionsBufferRef.current.map(c => c.text).join(' '));
        }
      };
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isMicOn]);

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
    if (isTTSPlaying && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsTTSPlaying(false);
    }
  };

  const playTTS = (text) => {
    if (isTTSEnabled && window.speechSynthesis && ttsRef.current) {
      window.speechSynthesis.cancel();
      ttsRef.current.text = text;
      window.speechSynthesis.speak(ttsRef.current);
      setIsTTSPlaying(true);
    }
  };

  useEffect(() => {
    if (ttsRef.current) {
      ttsRef.current.onend = () => setIsTTSPlaying(false);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && isTTSEnabled && ttsRef.current) {
      playTTS(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, isRecording, isTTSEnabled]);

  const startInterview = async () => {
    setInterviewStatus('Starting interview...');
    setCurrentQuestionIndex(0);
    setRemainingTime(30);
    setShowWarning(false);
    setInterviewStarted(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setVideoStream(stream);
      startRecording();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setInterviewStatus('Error accessing camera. Please check your permissions.');
      setInterviewStarted(false);
    }

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      console.error('No stream available for recording');
      return;
    }
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    chunksRef.current = [];
    captionsBufferRef.current = [];
    lastCaptionTimeRef.current = 0;
    recordingStartTimeRef.current = Date.now();
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      uploadToS3(blob);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setInterviewStatus(`Recording Question ${currentQuestionIndex + 1}...`);
    if (recognitionRef.current && isCCOn) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
    capturedFramesRef.current = [];
  };

  const handleFrameCapture = (frameData) => {
    capturedFramesRef.current.push(frameData);
  };

  const createVideoFromFrames = async () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const videoWriter = new WebMWriter({
        quality: 0.95,
        frameRate: 10, // Adjust based on your capture rate
      });

      const processFrame = (index) => {
        if (index >= capturedFramesRef.current.length) {
          videoWriter.complete().then(resolve).catch(reject);
          return;
        }

        const frameData = capturedFramesRef.current[index];
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          videoWriter.addFrame(canvas);
          processFrame(index + 1);
        };
        img.onerror = reject;
        img.src = frameData;
      };

      processFrame(0);
    });
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          uploadToS3(blob).then(() => {
            resolve();
          });
        };
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.error('Error stopping speech recognition:', error);
          }
        }
      } else {
        resolve();
      }
    });
  };

  const handleNextQuestion = async () => {
    await stopRecording();
    chunksRef.current = [];
    captionsBufferRef.current = [];
    setTranscript('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        setInterviewStatus(`Recording Question ${newIndex + 1}...`);
        return newIndex;
      });
      setRemainingTime(30);
      setShowWarning(false);
      startRecording();
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    stopRecording().then(() => {
      setInterviewStatus('Interview completed.');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setVideoStream(null);
      setIsRecording(false);
      setInterviewStarted(false);
      resetInterview();
    });
  };

  const resetInterview = () => {
    setRollNumber('');
    setCurrentQuestionIndex(0);
    setRemainingTime(30);
    setShowWarning(false);
    setTranscript('');
    chunksRef.current = [];
    captionsBufferRef.current = [];
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
      if (!audioTrack.enabled) {
        setIsCCOn(false);
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }
    }
  };

  const toggleCC = () => {
    if (!isMicOn) return;
    setIsCCOn(!isCCOn);
    if (!isCCOn) {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setTranscript('');
    }
  };

  const createVTTContent = (captions) => {
    let vttContent = 'WEBVTT\n\n';
    captions.forEach((caption, index) => {
      vttContent += `${index + 1}\n`;
      vttContent += `${formatVTTTime(caption.start)} --> ${formatVTTTime(caption.end)}\n`;
      vttContent += `${caption.text}\n\n`;
    });
    return vttContent;
  };

  const formatVTTTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours().toString().padStart(2, '0');
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
  };

  const uploadToS3 = async () => {
    const questionLetter = String.fromCharCode(65 + currentQuestionIndex);
    const videoKey = `interviews/${rollNumber}/${rollNumber}${questionLetter}_interview.webm`;
    const captionsKey = `interviews/${rollNumber}/${rollNumber}${questionLetter}_captions.vtt`;

    try {
      const videoBlob = await createVideoFromFrames();
      await s3Client.send(new PutObjectCommand({
        Bucket: "test1",
        Key: videoKey,
        Body: videoBlob,
        ContentType: 'video/webm',
      }));
      const vttContent = createVTTContent(captionsBufferRef.current);
      await s3Client.send(new PutObjectCommand({
        Bucket: "test1",
        Key: captionsKey,
        Body: vttContent,
        ContentType: 'text/vtt',
      }));
      setInterviewStatus(`Question ${currentQuestionIndex + 1} uploaded successfully.`);
    } catch (error) {
      console.error('Error uploading interview or captions:', error);
      setInterviewStatus('Error saving interview. Please try again.');
    }
  };

  const handleLowLightEndInterview = () => {
    endInterview();
    setInterviewStatus('Interview ended due to prolonged low light conditions.');
  };

  return {
    rollNumber, setRollNumber,
    interviewStatus, setInterviewStatus,
    isRecording, setIsRecording,
    isCameraOn, setIsCameraOn,
    isMicOn, setIsMicOn,
    isCCOn, setIsCCOn,
    transcript, setTranscript,
    currentQuestionIndex, setCurrentQuestionIndex,
    remainingTime, setRemainingTime,
    showWarning, setShowWarning,
    interviewStarted, setInterviewStarted,
    isTTSEnabled, setIsTTSEnabled,
    isTTSPlaying, setIsTTSPlaying,
    videoStream, setVideoStream,
    startInterview,
    handleNextQuestion,
    endInterview,
    toggleCamera,
    toggleMic,
    toggleCC,
    toggleTTS,
    handleLowLightEndInterview,
    handleFrameCapture: (frameData) => {
      capturedFramesRef.current.push(frameData);
    },
  };
};
