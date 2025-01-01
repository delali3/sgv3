import React from 'react';
import {
  List,
  Avatar,
  Tag,
  Button,
  Space,
  Typography,
  Badge
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Appointment, AppointmentStatus } from '../../types/doctor';

const { Text } = Typography;

interface AppointmentsListProps {
  appointments: Appointment[];
  loading: boolean;
  onConsultationStart: (appointment: Appointment) => void;
  onNotesClick: (appointment: Appointment) => void;
  onStatusUpdate: (appointmentId: string, status: AppointmentStatus) => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  loading,
  onConsultationStart,
  onNotesClick,
  onStatusUpdate,
}) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'upcoming':
        return 'processing';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <List
      loading={loading}
      dataSource={appointments}
      renderItem={(appointment) => (
        <List.Item
          key={appointment.id}
          actions={[
            <Button
              key="consultation"
              type="primary"
              icon={<VideoCameraOutlined />}
              onClick={() => onConsultationStart(appointment)}
              disabled={appointment.status !== 'upcoming'}
            >
              Start Consultation
            </Button>,
            <Button
              key="notes"
              icon={<FileTextOutlined />}
              onClick={() => onNotesClick(appointment)}
            >
              Notes
            </Button>,
            <Button
              key="status"
              onClick={() => onStatusUpdate(
                appointment.id,
                appointment.status === 'upcoming' ? 'completed' : 'upcoming'
              )}
            >
              {appointment.status === 'upcoming' ? 'Complete' : 'Reopen'}
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                size={48}
                src={appointment.patientImage}
                icon={!appointment.patientImage && <UserOutlined />}
                className="bg-blue-100"
              />
            }
            title={
              <Space size="middle" className="w-full">
                <Text strong>{appointment.patientName}</Text>
                <Badge 
                  status={getStatusColor(appointment.status)} 
                  text={appointment.status} 
                />
                {appointment.priority === 'urgent' && (
                  <Tag color="red">Urgent</Tag>
                )}
                <Tag color="blue">{appointment.type}</Tag>
              </Space>
            }
            description={
              <Space direction="vertical" size={1} className="w-full">
                <Space>
                  <ClockCircleOutlined />
                  <Text type="secondary">
                    {dayjs(appointment.dateTime).format('DD MMM YYYY, HH:mm')}
                  </Text>
                </Space>
                {appointment.symptoms && appointment.symptoms.length > 0 && (
                  <Space>
                    <MedicineBoxOutlined />
                    <Text type="secondary">
                      Symptoms: {appointment.symptoms.join(', ')}
                    </Text>
                  </Space>
                )}
                {appointment.notes && (
                  <Text type="secondary" className="mt-2">
                    Notes: {appointment.notes}
                  </Text>
                )}
                {/* <Space className="mt-2">
                  <Text type="secondary">
                    Contact: {appointment.patientPhone} | {appointment.patientEmail}
                  </Text>
                </Space> */}
              </Space>
            }
          />
        </List.Item>
      )}
      locale={{
        emptyText: (
          <div className="text-center py-8">
            <Text type="secondary">No appointments found</Text>
          </div>
        )
      }}
      className="appointments-list"
    />
  );
};

export default AppointmentsList;