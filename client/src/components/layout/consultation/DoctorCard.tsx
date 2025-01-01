// src/components/consultation/DoctorCard.tsx
import React from 'react';
import { Card, Avatar, Typography, Space, Rate, Tag, Button } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ExperimentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { MatchedDoctor } from '../../../types/consultation';
import styles from '../../../styles/Consultation.module.css';

const { Text } = Typography;

interface DoctorCardProps {
  doctor: MatchedDoctor;
  onSelect: (doctor: MatchedDoctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => (
  <Card 
    className={styles.doctorCard}
    bodyStyle={{ padding: '16px' }}
  >
    <Space align="start" size={16}>
      <Avatar 
        size={80} 
        icon={<UserOutlined />}
        src={doctor.profileImage}
        style={{ backgroundColor: '#f56a00' }}
      />
      <div style={{ flex: 1 }}>
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Text strong style={{ fontSize: 16 }}>{doctor.name}</Text>
            <br />
            <Text type="secondary">{doctor.specialization}</Text>
          </div>
          <Button type="primary" onClick={() => onSelect(doctor)}>
            Book Now
          </Button>
        </Space>
        
        <Rate 
          disabled 
          defaultValue={doctor.rating} 
          style={{ fontSize: 14, marginTop: 8 }}
        />
        <Text type="secondary" style={{ marginLeft: 8 }}>
          ({doctor.rating})
        </Text>

        <Space wrap style={{ marginTop: 12 }} size={[8, 8]}>
        {doctor.experience && (
          <Tag icon={<ExperimentOutlined />} color="blue">
            {doctor.experience} years exp.
          </Tag>
        )}
        <Tag icon={<DollarOutlined />} color="green">
          ${doctor.consultationFee}
        </Tag>
        <Tag icon={<ClockCircleOutlined />} color="orange">
          Next: {doctor.nextAvailable}
        </Tag>
        {doctor.availability.length > 0 && (
          <Tag icon={<CalendarOutlined />} color="purple">
            {doctor.availability.length} available slots
          </Tag>
        )}
      </Space>
      </div>
    </Space>
  </Card>
);

export default DoctorCard;