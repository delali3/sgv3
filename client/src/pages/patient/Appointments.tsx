import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Card,
  List,
  Badge,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Tabs,
  Tag,
  Space,
  Typography,
  Avatar,
  message,
  Statistic,
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PlusOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { appointmentService } from '../../services/api/appointment.service';
import styles from '../../styles/Appointments.module.css';
import type { Appointment, Doctor, TimeSlot } from '../../types/appointment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

  // Fetch initial data
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      message.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await appointmentService.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      message.error('Failed to fetch doctors list');
    }
  };

  // Fetch available slots when doctor and date are selected
  const fetchAvailableSlots = async (doctorId: string, date: string) => {
    try {
      const response = await appointmentService.getAvailableSlots(doctorId, date);
      setAvailableSlots(response.data);
    } catch (error) {
      message.error('Failed to fetch available slots');
    }
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    if (selectedDate) {
      fetchAvailableSlots(doctorId, selectedDate.format('YYYY-MM-DD'));
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    if (selectedDoctor) {
      fetchAvailableSlots(selectedDoctor, date.format('YYYY-MM-DD'));
    }
  };

  // Handle appointment scheduling
  const handleModalSubmit = async (values: any) => {
    try {
      setLoading(true);
      const dateTime = dayjs(`${values.date.format('YYYY-MM-DD')}T${values.timeSlot}`);

      await appointmentService.scheduleAppointment({
        doctorId: values.doctorId,
        dateTime: dateTime.toISOString(),
        notes: values.notes
      });

      message.success('Appointment scheduled successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      if ((error as any).response?.status === 409) {
        message.error('This time slot is no longer available');
      } else {
        message.error('Failed to schedule appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      message.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      message.error('Failed to cancel appointment');
    }
  };

  // Handle appointment rescheduling
  // const handleReschedule = async (appointmentId: string, newDateTime: string) => {
  //   try {
  //     await appointmentService.rescheduleAppointment(appointmentId, newDateTime);
  //     message.success('Appointment rescheduled successfully');
  //     fetchAppointments();
  //   } catch (error) {
  //     message.error('Failed to reschedule appointment');
  //   }
  // };

  const dateCellRender = (value: Dayjs) => {
    const dateAppointments = appointments.filter(
      appointment => dayjs(appointment.dateTime).format('YYYY-MM-DD') === value.format('YYYY-MM-DD')
    );

    if (dateAppointments.length === 0) return null;

    return (
      <div className={styles.appointmentCell}>
        {dateAppointments.map(appointment => (
          <Badge
            key={appointment.id}
            status={
              appointment.status === 'upcoming' ? 'processing' :
                appointment.status === 'completed' ? 'success' : 'error'
            }
            text={appointment.doctorName}
          />
        ))}
      </div>
    );
  };

  const getStatusTag = (status: string) => {
    const config = {
      upcoming: { color: 'processing' as const, icon: <ClockCircleOutlined /> },
      completed: { color: 'success' as const, icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error' as const, icon: <CloseCircleOutlined /> }
    }[status as AppointmentStatus] ?? {
      color: 'default' as const,
      icon: <ClockCircleOutlined />
    };

    return (
      <Tag color={config.color} icon={config.icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };


  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const filteredAppointments = appointments
    .filter(appointment =>
      filterStatus === 'all' ? true : appointment.status === filterStatus
    )
    .filter(appointment =>
      searchText ?
        appointment.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        appointment.specialization.toLowerCase().includes(searchText.toLowerCase())
        : true
    );

  return (
    <div className={styles.appointmentsContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Appointments</Title>
          <Text type="secondary">Manage your medical appointments</Text>

          <div className={styles.headerStats}>
            <Statistic
              title="Total Appointments"
              value={stats.total}
              prefix={<CalendarOutlined />}
            />
            <Statistic
              title="Upcoming"
              value={stats.upcoming}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Schedule Appointment
        </Button>
      </div>

      {/* Content Section */}
      <Card className={styles.contentSection}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <div className={styles.tabExtra}>
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={setFilterStatus}
              >
                <Option value="all">All Status</Option>
                <Option value="upcoming">Upcoming</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>

              <Input.Search
                placeholder="Search appointments"
                style={{ width: 250 }}
                onSearch={setSearchText}
                allowClear
              />
            </div>
          }
        >
          <TabPane
            tab={<span><CalendarOutlined /> Calendar View</span>}
            key="calendar"
          >
            <div className={styles.calendarWrapper}>
              <Calendar
                dateCellRender={dateCellRender}
                onSelect={handleDateSelect}
              />
            </div>
          </TabPane>

          <TabPane
            tab={<span><UnorderedListOutlined /> List View</span>}
            key="list"
          >
            <List
              className={styles.appointmentsList}
              loading={loading}
              dataSource={filteredAppointments}
              renderItem={appointment => (
                <List.Item
                  actions={[
                    <Button type="primary" ghost>View Details</Button>,
                    appointment.status === 'upcoming' && (
                      <Button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        danger
                      >
                        Cancel
                      </Button>
                    )
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor: '#f56a00',
                          fontSize: 32,
                          padding: 8
                        }}
                      />
                    }
                    title={
                      <Space align="center" size={16}>
                        <Text strong style={{ fontSize: 16 }}>
                          {appointment.doctorName}
                        </Text>
                        {getStatusTag(appointment.status)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Space>
                          <MedicineBoxOutlined />
                          <Text>{appointment.specialization}</Text>
                        </Space>
                        <Space>
                          <CalendarOutlined />
                          <Text>{dayjs(appointment.dateTime).format('dddd, MMMM D, YYYY')}</Text>
                        </Space>
                        <Space>
                          <ClockCircleOutlined />
                          <Text>{dayjs(appointment.dateTime).format('h:mm A')}</Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Scheduling Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>Schedule New Appointment</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          <Form.Item
            name="doctorId"
            label="Select Doctor"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select
              placeholder="Choose a doctor"
              onChange={handleDoctorSelect}
            >
              {doctors.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Appointment Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={handleDateSelect}
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          {availableSlots.length > 0 && (
            <Form.Item
              name="timeSlot"
              label="Available Time Slots"
              rules={[{ required: true, message: 'Please select a time slot' }]}
            >
              <Select placeholder="Select time slot">
                {availableSlots
                  .filter(slot => slot.isAvailable)
                  .map(slot => (
                    <Option key={slot.id} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Add any notes or symptoms" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Schedule
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;