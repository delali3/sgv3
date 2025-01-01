// src/components/SpeechRecognition.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Select, message, Progress } from 'antd';
import { AudioOutlined, AudioMutedOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from '../../styles/Consultation.module.css';

interface SpeechRecognitionProps {
  onTranscriptChange: (transcript: string) => void;
  disabled?: boolean;
}

interface AudioLevel {
  current: number;
  max: number;
}

const SUPPORTED_LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'zh-CN', label: 'Chinese' },
  { value: 'ja-JP', label: 'Japanese' }
];

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  onTranscriptChange,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [audioLevel, setAudioLevel] = useState<AudioLevel>({ current: 0, max: 0 });
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkBrowserSupport();
    return () => cleanup();
  }, []);

  const checkBrowserSupport = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser');
      setIsInitializing(false);
      return false;
    }
    setIsInitializing(false);
    return true;
  };

  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onend = () => {
      if (!isPaused) {
        setIsRecording(false);
        cleanup();
      }
    };

    recognition.onerror = (event) => {
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      message.error(errorMessage);
      cleanup();
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscriptChange(finalTranscript);
      }
      setInterimTranscript(interimTranscript);
    };

    recognitionRef.current = recognition;
  };

  const getErrorMessage = (error: string): string => {
    const errorMessages: { [key: string]: string } = {
      'no-speech': 'No speech was detected. Please try again.',
      'audio-capture': 'No microphone was found. Ensure it is plugged in and allowed.',
      'not-allowed': 'Microphone permission was denied. Please allow access and try again.',
      'network': 'There was a network error. Please check your connection.',
      'aborted': 'Speech recognition was aborted.',
      'service-not-allowed': 'Speech recognition service is not allowed. Please try again later.'
    };

    return errorMessages[error] || 'An unknown error occurred. Please try again.';
  };

  const initializeAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      updateAudioLevel();
    } catch (error) {
      console.error('Error initializing audio analyser:', error);
      message.error('Failed to access microphone');
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current || !isRecording) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
    const normalizedValue = Math.min(Math.round((average / 128) * 100), 100);

    setAudioLevel(prev => ({
      current: normalizedValue,
      max: Math.max(prev.max, normalizedValue)
    }));

    if (isRecording) {
      requestAnimationFrame(updateAudioLevel);
    }
  };

  const startRecording = async () => {
    if (!checkBrowserSupport()) return;

    try {
      initializeRecognition();
      await initializeAudioAnalyser();
      recognitionRef.current?.start();
      setIsPaused(false);
      message.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      message.error('Failed to start recording');
      cleanup();
    }
  };

  const pauseRecording = () => {
    recognitionRef.current?.stop();
    setIsPaused(true);
    message.info('Recording paused');
  };

  const resumeRecording = () => {
    recognitionRef.current?.start();
    setIsPaused(false);
    message.success('Recording resumed');
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsPaused(false);
    cleanup();
    message.success('Recording stopped');
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setAudioLevel({ current: 0, max: 0 });
    setInterimTranscript('');
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    if (isRecording) {
      stopRecording();
      setTimeout(() => {
        startRecording();
      }, 100);
    }
  };

  if (isInitializing) {
    return <LoadingOutlined />;
  }

  if (error && !isRecording) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.speechRecognition}>
      <div className={styles.controls}>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          options={SUPPORTED_LANGUAGES}
          disabled={isRecording || disabled}
          className={styles.languageSelect}
        />
        <Tooltip title={isRecording ? (isPaused ? 'Resume recording' : 'Pause recording') : 'Start recording'}>
          <Button
            icon={isRecording ? (isPaused ? <AudioMutedOutlined /> : <AudioOutlined className={styles.recordingIcon} />) : <AudioMutedOutlined />}
            onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
            disabled={disabled}
            className={`${styles.audioButton} ${isRecording && !isPaused ? styles.recording : ''}`}
          />
        </Tooltip>
        {isRecording && (
          <Button
            danger
            onClick={stopRecording}
            className={styles.stopButton}
          >
            Stop
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className={styles.audioLevelIndicator}>
          <Progress
            percent={audioLevel.current}
            size="small"
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      )}
      
      {interimTranscript && (
        <div className={styles.interimTranscript}>
          {interimTranscript}
        </div>
      )}
    </div>
  );
};

export default SpeechRecognition;