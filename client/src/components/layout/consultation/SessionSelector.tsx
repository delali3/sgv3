// src/components/consultation/SessionSelector.tsx
import React from 'react';
import { Card, Button, List, Typography, Space, Badge, Empty } from 'antd';
import { PlusOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ConsultationSession } from '../../../types/consultation';

const { Text, Title } = Typography;

interface SessionSelectorProps {
  sessions: ConsultationSession[];
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  loading: boolean;
  currentSessionId?: string;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  onSessionSelect,
  onNewSession,
  loading,
  currentSessionId
}) => {
  return (
    <Card className="mb-4">
      <Space direction="vertical" className="w-full">
        <Space className="w-full justify-between">
          <Title level={4} className="mb-0">Consultation History</Title>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={onNewSession}
          >
            New Consultation
          </Button>
        </Space>
        
        {sessions.length > 0 ? (
          <List
            dataSource={sessions}
            loading={loading}
            renderItem={(session) => (
              <List.Item 
                key={session.id}
                className={`cursor-pointer rounded-lg hover:bg-gray-50 ${
                  session.id === currentSessionId ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSessionSelect(session.id)}
              >
                <Space direction="vertical" className="w-full">
                  <Space className="w-full justify-between">
                    <Space>
                      <HistoryOutlined />
                      <Text strong>
                        {dayjs(session.startTime).format('MMM D, YYYY HH:mm')}
                      </Text>
                    </Space>
                    <Badge 
                      status={session.status === 'active' ? 'processing' : 'default'}
                      text={session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    />
                  </Space>
                  {session.primarySymptoms && (
                    <Space wrap>
                      {session.primarySymptoms.map((symptom, index) => (
                        <Badge 
                          key={index}
                          count={symptom}
                          style={{ backgroundColor: '#108ee9' }}
                        />
                      ))}
                    </Space>
                  )}
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="No consultation history"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Space>
    </Card>
  );
};


export default SessionSelector;