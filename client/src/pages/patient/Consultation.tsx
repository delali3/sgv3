// src/pages/consultation/index.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Typography,
  Space,
  Badge,
  Avatar,
  message,
  Empty,
  Modal,
  Divider,
  Alert,
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  FileDoneOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import styles from '../../styles/Consultation.module.css';
import DoctorCard from '../../components/layout/consultation/DoctorCard';
import BookingModal from '../../components/layout/consultation/BookingModal';
import {
  consultationService
} from '../../services/api/consultation.service';
import type {
  ConsultationMessage,
  MatchedDoctor,
  ConsultationSummary,
  ConsultationSession
} from '../../types/consultation';
import dayjs from 'dayjs';
import SpeechRecognition from './SpeechRecognition';
import SessionSelector from '../../components/layout/consultation/SessionSelector';

const { Text, Title } = Typography;
const { TextArea } = Input;
const ConsultationPage: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [matchedDoctors, setMatchedDoctors] = useState<MatchedDoctor[]>([]);
  const [consultationSummary, setConsultationSummary] = useState<ConsultationSummary | null>(null);
  const [sessions, setSessions] = useState<ConsultationSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loading, setLoading] = useState({
    sending: false,
    summarizing: false,
    booking: false
  });
  const [modals, setModals] = useState({
    summary: false,
    booking: false
  });
  const [selectedDoctor, setSelectedDoctor] = useState<MatchedDoctor | null>(null);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      setMessages([]); // Clear existing messages
      const messagesResponse = await consultationService.getSessionMessages(sessionId);
      setMessages(messagesResponse.data);

      // Check for existing summary and doctors
      const summaryResponse = await consultationService.getSummary(sessionId);
      if (summaryResponse.data.summary) {
        setConsultationSummary(summaryResponse.data.summary);
        if (summaryResponse.data.doctors?.length > 0) {
          setMatchedDoctors(summaryResponse.data.doctors);
        }
      }
    } catch (error) {
      message.error('Failed to load consultation data');
    }
  }, []);

  // Load initial sessions
  useEffect(() => {
    let mounted = true;

    const loadSessions = async () => {
      if (sessionsLoading) return;
      
      setSessionsLoading(true);
      try {
        const { data } = await consultationService.getSessions();
        if (!mounted) return;
        
        setSessions(data);
        const activeSession = data.find(s => s.status === 'active');
        if (activeSession && activeSession.id !== currentSessionId) {
          setCurrentSessionId(activeSession.id);
          await loadSessionMessages(activeSession.id);
        }
      } catch (error) {
        if (mounted) {
          message.error('Failed to load consultation history');
        }
      } finally {
        if (mounted) {
          setSessionsLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      mounted = false;
    };
  }, [loadSessionMessages]);

  const handleNewSession = useCallback(async () => {
    try {
      const { data } = await consultationService.startSession();
      setCurrentSessionId(data.sessionId);
      setConsultationSummary(null);
      setMatchedDoctors([]);
      setMessages([{
        id: '1',
        content: "Hello! I'm your medical assistant. Please describe your symptoms and concerns in detail.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      message.error('Failed to start new consultation');
    }
  }, []);

  const handleSessionSelect = useCallback((sessionId: string) => {
    if (sessionId === currentSessionId) return;
    setCurrentSessionId(sessionId);
    setConsultationSummary(null);
    setMatchedDoctors([]);
    loadSessionMessages(sessionId);
  }, [currentSessionId, loadSessionMessages]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTranscriptChange = useCallback((transcript: string) => {
    setInputValue(prev => (prev + ' ' + transcript).trim());
  }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || !currentSessionId) {
      if (!currentSessionId) message.error('No active session');
      return;
    }

    const userMessage: ConsultationMessage = {
      id: Date.now().toString(),
      content: trimmedInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(prev => ({ ...prev, sending: true }));

    try {
      const { data } = await consultationService.sendMessage({
        content: trimmedInput,
        sessionId: currentSessionId
      });

      const aiMessage: ConsultationMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      message.error('Failed to process your message. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  }, [currentSessionId, inputValue]);

  const handleGetSummary = useCallback(async () => {
    if (!currentSessionId) {
      message.error('No active session');
      return;
    }

    setLoading(prev => ({ ...prev, summarizing: true }));

    try {
      const { data } = await consultationService.getSummary(currentSessionId);
      setConsultationSummary(data.summary);
      setMatchedDoctors(data.doctors || []);
      setModals(prev => ({ ...prev, summary: true }));
    } catch (error) {
      console.error('Summary error:', error);
      message.error('Failed to generate consultation summary');
    } finally {
      setLoading(prev => ({ ...prev, summarizing: false }));
    }
  }, [currentSessionId]);

  const handleDoctorSelect = useCallback((doctor: MatchedDoctor) => {
    setSelectedDoctor(doctor);
    setModals(prev => ({ ...prev, booking: true }));
  }, []);


  const renderSummaryContent = () => {
    if (!consultationSummary) return null;

    return (
      <div className={styles.summaryContent}>
        {/* ... existing summary content ... */}

        {matchedDoctors && matchedDoctors.length > 0 ? (
          <>
            <Divider />
            <Title level={4}>Available Specialists</Title>
            <Alert
              message="Recommended Next Steps"
              description="You can book an appointment with one of our specialists below. They have been matched based on your symptoms and their expertise."
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              className="mb-4"
            />
            <Row gutter={[16, 16]}>
              {matchedDoctors.map(doctor => (
                <Col key={doctor.id} span={24}>
                  <DoctorCard
                    doctor={doctor}
                    onSelect={() => {
                      handleDoctorSelect(doctor);
                      setModals(prev => ({ ...prev, summary: false }));
                    }}
                  />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Alert
            message="No Specialists Available"
            description="Currently there are no specialists available matching your requirements. Please try again later."
            type="info"
            showIcon
          />
        )}
      </div>
    );
  };
  return (
    <div className={styles.pageContainer}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <div className={styles.chatSection}>
            <div className={styles.chatHeader}>
              <Space>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#f56a00' }} />
                <div>
                  <Text strong>Medical Assistant</Text>
                  <br />
                  <Badge status="processing" text="Online" />
                </div>
              </Space>
              <Button
                type="primary"
                icon={<FileDoneOutlined />}
                onClick={handleGetSummary}
                loading={loading.summarizing}
                disabled={messages.length < 3}
              >
                Get Summary
              </Button>
            </div>

            <div className={styles.chatBody} ref={chatBodyRef}>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage
                    }`}
                >
                  <Avatar
                    icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: message.sender === 'user' ? '#1890ff' : '#f56a00'
                    }}
                  />
                  <div className={styles.messageContent}>
                    <Text style={{ color: message.sender === 'user' ? 'white' : 'inherit' }}>
                      {message.content}
                    </Text>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: '12px',
                        color: message.sender === 'user' ? 'rgba(255,255,255,0.8)' : undefined,
                        marginTop: '4px',
                        display: 'block'
                      }}
                    >
                      {dayjs(message.timestamp).format('HH:mm')}
                    </Text>
                  </div>
                </div>
              ))}
              {loading.sending && (
                <div className={styles.message}>
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#f56a00' }} />
                  <div className={styles.messageContent}>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.chatFooter}>
              <div className={styles.inputWrapper}>
                <TextArea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onPressEnter={e => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Describe your symptoms in detail..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  disabled={loading.sending}
                  className={styles.textarea}
                />
                <Space>
                  <SpeechRecognition
                    onTranscriptChange={handleTranscriptChange}
                    disabled={loading.sending}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={loading.sending}
                  >
                    Send
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className={styles.doctorSection}>
            <Card
              title="Recommended Specialists"
              bordered={false}
              extra={matchedDoctors.length > 0 && (
                <Text type="secondary">
                  Found: {matchedDoctors.length}
                </Text>
              )}
            >
              {matchedDoctors.length ? (
                matchedDoctors.map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onSelect={() => handleDoctorSelect(doctor)}
                  />
                ))
              ) : (
                <Empty description="No specialists found yet. Complete your consultation to get recommendations." />
              )}
            </Card>
          </div>
        </Col>
        <Col xs={24}>
          <SessionSelector
            sessions={sessions}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            loading={sessionsLoading}
            currentSessionId={currentSessionId}
          />
        </Col>

      </Row>

      {/* Summary Modal */}
      <Modal
        title={
          <Space>
            <FileDoneOutlined />
            Consultation Summary
          </Space>
        }
        open={modals.summary}
        onCancel={() => setModals(prev => ({ ...prev, summary: false }))}
        footer={[
          <Button
            key="close"
            onClick={() => setModals(prev => ({ ...prev, summary: false }))}
          >
            Close
          </Button>
        ]}
        width={800}
        className={styles.summaryModal}
      >
        {renderSummaryContent()}
      </Modal>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          visible={modals.booking}
          doctor={selectedDoctor}
          onCancel={() => {
            setModals(prev => ({ ...prev, booking: false }));
            setSelectedDoctor(null);
          }}
        />
      )}

      {/* Styles */}
      <style>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #90949c;
          border-radius: 50%;
          animation: bounce 1.5s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default ConsultationPage;