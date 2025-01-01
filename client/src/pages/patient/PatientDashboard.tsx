// src/pages/dashboard/PatientDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  List, 
  Tag, 
  Button, 
  Typography,
  Avatar,
  Space,
  Progress,
  Badge
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  UserOutlined,
  BellOutlined
} from '@ant-design/icons';
import type { Appointment, Consultation, PatientStats } from '../../types/patient';
import styles from '../../styles/Dashboard.module.css';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const PatientDashboard: React.FC = () => {
  const [stats, setStats] = useState<PatientStats>({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedConsultations: 0
  });
  
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        setStats({
          totalAppointments: 12,
          upcomingAppointments: 2,
          completedConsultations: 10
        });

        setUpcomingAppointments([
          {
            id: '1',
            doctorName: 'Dr. Smith',
            specialization: 'Cardiologist',
            dateTime: '2024-12-25T10:00:00',
            status: 'upcoming'
          },
          {
            id: '2',
            doctorName: 'Dr. Johnson',
            specialization: 'Neurologist',
            dateTime: '2024-12-26T14:30:00',
            status: 'upcoming'
          }
        ]);

        setRecentConsultations([
          {
            id: '1',
            date: '2024-12-19',
            summary: 'Regular checkup - Blood pressure normal',
            doctorName: 'Dr. Johnson',
            symptoms: ['headache', 'fatigue']
          },
          {
            id: '2',
            date: '2024-12-15',
            summary: 'Follow-up consultation - Prescribed new medication',
            doctorName: 'Dr. Smith',
            symptoms: ['fever', 'cough']
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderAppointmentTag = (status: Appointment['status']) => {
    const tagProps = {
      upcoming: { color: 'blue', icon: <ClockCircleOutlined /> },
      completed: { color: 'green', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'red', icon: <CloseCircleOutlined /> }
    }[status];

    return (
      <Tag icon={tagProps.icon} color={tagProps.color}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: string;
    total?: number;
  }> = ({ title, value, icon, color, total = stats.totalAppointments }) => (
    <Card className={styles.statCard}>
      <Statistic 
        title={<Text strong>{title}</Text>}
        value={value}
        prefix={icon}
        valueStyle={{ color }}
      />
      <Progress 
        percent={Math.round((value / total) * 100)} 
        showInfo={false}
        strokeColor={color}
        size="small"
      />
    </Card>
  );
  
  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <Space align="start">
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Welcome back, John
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Here's your health overview
            </Text>
          </div>
        </Space>
        <Badge count={3}>
          <Button 
            icon={<BellOutlined />}
            shape="circle" 
            size="large"
          />
        </Badge>
      </div>

      {/* Stats Section */}
      <Row gutter={[16, 16]} className={styles.statsSection}>
        <Col xs={24} md={8}>
          <StatCard 
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard 
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            icon={<ClockCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard 
            title="Completed Consultations"
            value={stats.completedConsultations}
            icon={<CheckCircleOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Upcoming Appointments */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Upcoming Appointments</span>
              </Space>
            }
            extra={<Button type="link">View All</Button>}
            className={styles.contentCard}
            loading={loading}
          >
            <List
              className={styles.listContainer}
              dataSource={upcomingAppointments}
              renderItem={(appointment) => (
                <div className={styles.appointmentItem}>
                  <List.Item
                    actions={[
                      <Button type="link">Reschedule</Button>,
                      <Button type="text" danger>Cancel</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          {appointment.doctorName}
                          {renderAppointmentTag(appointment.status)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text>{appointment.specialization}</Text>
                          <Text type="secondary">
                            {dayjs(appointment.dateTime).format('dddd, MMMM D, YYYY h:mm A')}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                </div>
              )}
              locale={{ emptyText: 'No upcoming appointments' }}
            />
          </Card>
        </Col>

        {/* Recent Consultations */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <FileTextOutlined />
                <span>Recent Consultations</span>
              </Space>
            }
            extra={<Button type="link">View All</Button>}
            className={styles.contentCard}
            loading={loading}
          >
            <List
              className={styles.listContainer}
              dataSource={recentConsultations}
              renderItem={(consultation) => (
                <div className={styles.appointmentItem}>
                  <List.Item
                    actions={[<Button type="link">View Details</Button>]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={consultation.doctorName}
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">
                            {dayjs(consultation.date).format('MMMM D, YYYY')}
                          </Text>
                          <Text>{consultation.summary}</Text>
                          <Space size={[0, 8]} wrap>
                            {consultation.symptoms.map(symptom => (
                              <Tag key={symptom}>{symptom}</Tag>
                            ))}
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                </div>
              )}
              locale={{ emptyText: 'No recent consultations' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title="Quick Actions"
        className={styles.quickActions}
      >
        <Row gutter={[16, 16]}>
          {[
            {
              icon: <MedicineBoxOutlined />,
              text: 'Start New Consultation',
              type: 'primary' as const
            },
            {
              icon: <CalendarOutlined />,
              text: 'Book Appointment'
            },
            {
              icon: <FileTextOutlined />,
              text: 'View Medical Records'
            }
          ].map((action, index) => (
            <Col xs={24} sm={8} key={index}>
              <Button
                type={action.type || 'default'}
                icon={action.icon}
                size="large"
                block
              >
                {action.text}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default PatientDashboard;