// pages/doctor/DoctorDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Layout, Card, Button, List, Tag, Typography, Space, Statistic, Tabs, Modal, Form, Input, Select, Row, Col, Avatar, Timeline, DatePicker, TimePicker,
} from 'antd';
import {
  CalendarOutlined, ClockCircleOutlined, UserOutlined, MedicineBoxOutlined, VideoCameraOutlined, PhoneOutlined, FileTextOutlined, CheckCircleOutlined, WarningOutlined, BellOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type {
  Appointment, AppointmentStatus, ConfirmAction, ConsultationNotes, DoctorAvailabilitySchedule
} from '../../types/doctor';
import { MedicalRecord } from '../../types/medicalRecords';

import { doctorService } from '../../services/api/doctor.service';
import { message } from 'antd';
import { TimeSlot } from '../../types/appointment';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface ConsultationFormValues extends ConsultationNotes {
  followUpDuration?: string;
  meetingLink?: string;  // Add this for zoom/meet links
}
// Add these interfaces at the top of your file with other interfaces
interface LoadingState {
  appointments: boolean;
  patientHistory: boolean;
  notes: boolean;
}

interface AvailabilityFormValues {
  schedules: {
    dayOfWeek: string;
    timeRange: [Dayjs, Dayjs] | null;
    isAvailable: boolean;
  }[];
}


const DoctorDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    appointments: false,
    patientHistory: false,
    notes: false
  });
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [patientHistory, setPatientHistory] = useState<MedicalRecord[]>([]);
  const [isVideoCallModalVisible, setIsVideoCallModalVisible] = useState<boolean>(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState<boolean>(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
  const [isVacationModalVisible, setIsVacationModalVisible] = useState(false);
  const [selectedVacationDates, setSelectedVacationDates] = useState<string[]>([]);
  const [isBlockTimeModalVisible, setIsBlockTimeModalVisible] = useState(false);
  const [selectedTimeToBlock, setSelectedTimeToBlock] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>({
    message: '',
    okText: 'Confirm',
    isDangerous: false,
    onConfirm: () => { }
  });
  const [form] = Form.useForm<ConsultationFormValues>();

  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentStatus | 'all'>('all');
  const [consultationNotes, setConsultationNotes] = useState<string>('');
  const [availabilityForm] = Form.useForm();

  // Add to your existing state variables
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);


  // Add to your state variables
  const [vacationDays, setVacationDays] = useState<Array<{
    id: string;
    dates: string[];
    created_at: string;
  }>>([]);

  // Add this function to fetch vacation days
  const fetchVacationDays = async () => {
    try {
      const response = await doctorService.getVacationDays();
      setVacationDays(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch vacation days:', error);
      message.error('Failed to load vacation days');
    }
  };

  // Add to your useEffect
  useEffect(() => {
    fetchVacationDays();
  }, []);

  // Add delete handler
  const handleDeleteVacationDays = async (id: string) => {
    try {
      await doctorService.deleteVacationDays(id);
      message.success('Vacation days deleted successfully');
      fetchVacationDays(); // Refresh the list
    } catch (error) {
      message.error('Failed to delete vacation days');
    }
  };

  // Add this function to fetch doctor's availability
  const fetchDoctorAvailability = async () => {
    try {
      setIsLoadingAvailability(true);
      const response = await doctorService.getDoctorAvailability();
      const availabilityData = response.data.data || [];

      // Format the data for the form
      const formattedSchedules = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        .map(day => {
          const daySchedule = availabilityData.find(
            schedule => schedule.day_of_week === day
          );

          return {
            dayOfWeek: day,
            timeRange: daySchedule?.start_time && daySchedule?.end_time
              ? [
                dayjs(daySchedule.start_time, 'HH:mm'),
                dayjs(daySchedule.end_time, 'HH:mm')
              ]
              : null,
            isAvailable: daySchedule?.is_available ?? true
          };
        });

      // Set the form values
      availabilityForm.setFieldsValue({
        schedules: formattedSchedules
      });
    } catch (error) {
      console.error('Failed to fetch doctor availability:', error);
      message.error('Failed to load availability settings');
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // Add this useEffect to load availability when component mounts
  useEffect(() => {
    fetchDoctorAvailability();
  }, []);

  // const filteredAppointments = appointments.filter(apt =>
  //   dayjs(apt.dateTime).isSame(dayjs(), 'day') &&
  //   (appointmentFilter === 'all' || apt.status === appointmentFilter)
  // );

  // Add the handleConfirmAction function
  const handleConfirmAction = (): void => {
    if (confirmAction.onConfirm) {
      confirmAction.onConfirm();
    }
    setIsConfirmModalVisible(false);
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, appointments: true }));
      const response = await doctorService.getAppointments();
      const appointmentsData = response.data.data || []; // Now TypeScript knows about the nested data structure
      console.log('Appointments Data:', appointmentsData);

      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      message.error('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  };

  const handleDateSelect = async (date: Dayjs): Promise<void> => {
    setSelectedDate(date);
    try {
      setLoading(prev => ({ ...prev, appointments: true }));
      const [appointmentsResponse, slotsResponse] = await Promise.all([
        doctorService.getAppointmentsByDate(date.format('YYYY-MM-DD')),
        doctorService.getAvailableSlots(date.format('YYYY-MM-DD'))
      ]);

      const appointmentsData = appointmentsResponse.data.data || [];
      const slotsData = slotsResponse.data.data || [];

      console.log('Date Selected Appointments:', appointmentsData);
      console.log('Available Slots:', slotsData);

      setAppointments(appointmentsData);
      setAvailableSlots(slotsData);
    } catch (error) {
      console.error('Failed to load schedule data:', error);
      message.error('Failed to load schedule data');
      setAppointments([]);
      setAvailableSlots([]);
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  };
  const handleSaveNotes = async (values: ConsultationFormValues): Promise<void> => {
    if (!activeAppointment) return;

    try {
      setLoading(prev => ({ ...prev, notes: true }));

      // First save the consultation notes
      const consultationResponse = await doctorService.saveConsultationNotes(activeAppointment.id, {
        diagnosis: values.diagnosis,
        prescription: values.prescription,
        additionalNotes: values.additionalNotes || '',
        followUpDate: values.followUpDate,
        meetingLink: values.meetingLink
      });

      // Then save the symptoms
      if (consultationResponse.data?.id) {
        await doctorService.saveSymptoms(consultationResponse.data.id, {
          symptoms: values.symptoms || []
        });
      }

      message.success('Consultation details saved successfully');
      setIsVideoCallModalVisible(false);
      form.resetFields();
      await fetchAppointments();
    } catch (error) {
      console.error('Error saving consultation details:', error);
      message.error('Failed to save consultation details');
    } finally {
      setLoading(prev => ({ ...prev, notes: false }));
    }
  };

  const handleAvailabilityUpdate = async (availability: DoctorAvailabilitySchedule[]): Promise<void> => {
    try {
      // Filter out schedules with null times if doctor is available
      const validAvailability = availability.map(schedule => ({
        ...schedule,
        // If not available, we can keep null times
        startTime: schedule.isAvailable ? (schedule.startTime || '00:00') : null,
        endTime: schedule.isAvailable ? (schedule.endTime || '23:59') : null,
      }));

      await doctorService.updateAvailability(validAvailability);
      message.success('Availability updated successfully');
      await handleDateSelect(selectedDate); // Refresh schedule
    } catch (error) {
      message.error('Failed to update availability');
    }
  };


  const handleBlockTimeSlot = async (date: string, time: string): Promise<void> => {
    try {
      await doctorService.blockTimeSlot(date, time);
      message.success('Time slot blocked successfully');
      // Refresh the schedule
      await handleDateSelect(selectedDate);
    } catch (error) {
      console.error('Failed to block time slot:', error);
      message.error('Failed to block time slot');
    }
  };

  const handleSetVacationDays = async (dates: string[]): Promise<void> => {
    try {
      await doctorService.setVacationDays(dates);
      message.success('Vacation days set successfully');
      // Refresh the schedule
      await handleDateSelect(selectedDate);
    } catch (error) {
      console.error('Failed to set vacation days:', error);
      message.error('Failed to set vacation days');
    }
  };

  const handleStatusUpdate = async (appointmentId: string, status: AppointmentStatus): Promise<void> => {
    try {
      await doctorService.updateAppointmentStatus(appointmentId, status);
      message.success('Appointment status updated successfully');
      // Refresh appointments
      await fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      message.error('Failed to update appointment status');
    }
  };


  const fetchPatientHistory = async (patientId: string): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, patientHistory: true }));
      const response = await doctorService.getPatientHistory(patientId);
      setPatientHistory(response.data);
      setIsHistoryModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch patient history');
    } finally {
      setLoading(prev => ({ ...prev, patientHistory: false }));
    }
  };


  const onFinish = async (values: AvailabilityFormValues) => {
    try {
      const formattedAvailability: DoctorAvailabilitySchedule[] = values.schedules.map(schedule => {
        // Only include times if timeRange is set
        const startTime = schedule.timeRange?.[0]?.format('HH:mm') || null;
        const endTime = schedule.timeRange?.[1]?.format('HH:mm') || null;

        return {
          dayOfWeek: schedule.dayOfWeek,
          startTime,
          endTime,
          isAvailable: schedule.isAvailable
        };
      });

      await handleAvailabilityUpdate(formattedAvailability);
      message.success('Availability updated successfully');
    } catch (error) {
      message.error('Failed to update availability');
    }
  };

  // Calculate today's stats with proper typing
  const getTodayStats = () => {
    // const today = dayjs();
    return {
      total: appointments.length,
      pending: appointments.filter(apt =>
        apt.status === 'upcoming'
      ).length,
      completed: appointments.filter(apt =>
        apt.status === 'completed'
      ).length,
      urgent: appointments.filter(apt =>
        apt.priority === 'urgent'
      ).length,
    };
  };

  const stats = getTodayStats();


  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-6">
        {/* Stats Overview */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Today's Appointments"
                value={stats.total}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending"
                value={stats.pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completed Today"
                value={stats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Urgent Cases"
                value={stats.urgent}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card className="mb-6">
          <Tabs defaultActiveKey="schedule">
            <TabPane
              tab={<span><CalendarOutlined /> My Schedule</span>}
              key="my-schedule"
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Card title="Daily Schedule" className="mb-4">
                    <Row gutter={16} className="mb-4">
                      <Col span={8}>
                        <DatePicker
                          value={selectedDate}
                          onChange={(date) => date && handleDateSelect(date)}
                          className="w-full"
                        />
                      </Col>
                      <Col span={16}>
                        <Space>
                          <Tag color="processing">Available</Tag>
                          <Tag color="success">Booked</Tag>
                          <Tag color="error">Unavailable</Tag>
                        </Space>
                      </Col>
                    </Row>

                    <div className="time-slots grid grid-cols-4 gap-4">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          type={slot.isAvailable ? "default" : "dashed"}
                          className="w-full"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlots([...selectedSlots, slot.id])}
                        >
                          {slot.startTime} - {slot.endTime}
                          {slot.appointment && (
                            <div className="text-xs text-gray-500">
                              {slot.appointment.patientName}
                            </div>
                          )}
                        </Button>
                      ))}
                    </div>
                  </Card>

                  <Card
                    title="Availability Settings"
                    loading={isLoadingAvailability}
                  >
                    <Form
                      form={availabilityForm}
                      layout="vertical"
                      onFinish={onFinish}
                    >
                      <Row gutter={16}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                          <Col span={8} key={day}>
                            <Form.Item label={day}>
                              <Form.Item
                                name={['schedules', index, 'dayOfWeek']}
                                hidden
                              >
                                <Input />
                              </Form.Item>
                              <Space direction="vertical" className="w-full">
                                <Form.Item
                                  name={['schedules', index, 'timeRange']}
                                  noStyle
                                >
                                  <TimePicker.RangePicker
                                    format="HH:mm"
                                    className="w-full"
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={['schedules', index, 'isAvailable']}
                                  noStyle
                                >
                                  <Select className="w-full">
                                    <Option value={true}>Available</Option>
                                    <Option value={false}>Unavailable</Option>
                                  </Select>
                                </Form.Item>
                              </Space>
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                      <Button
                        type="primary"
                        loading={loading.appointments}
                        onClick={() => availabilityForm.submit()}
                      >
                        Save Availability
                      </Button>
                    </Form>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card title="Today's Schedule" className="mb-4">
                    <Timeline>
                      {appointments
                        .filter(apt => dayjs(apt.dateTime).isSame(selectedDate, 'day'))
                        .sort((a, b) => dayjs(a.dateTime).valueOf() - dayjs(b.dateTime).valueOf())
                        .map(apt => (
                          <Timeline.Item
                            key={apt.id}
                            color={apt.status === 'upcoming' ? 'blue' : apt.status === 'completed' ? 'green' : 'red'}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <Text strong>{dayjs(apt.dateTime).format('HH:mm')}</Text>
                                <br />
                                <Text>{apt.patientName}</Text>
                                {apt.priority === 'urgent' && (
                                  <Tag color="red" className="ml-2">Urgent</Tag>
                                )}
                              </div>
                              <Space>
                                <Button
                                  size="small"
                                  icon={<VideoCameraOutlined />}
                                  type="primary"
                                  onClick={() => {
                                    setActiveAppointment(apt);
                                    setIsVideoCallModalVisible(true);
                                  }}
                                >
                                  Start Consultation
                                </Button>
                              </Space>
                            </div>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                  </Card>

                  <Card title="Quick Actions">
                    <Space direction="vertical" className="w-full">
                      <Modal
                        title="Block Time Slot"
                        open={isBlockTimeModalVisible}
                        onCancel={() => setIsBlockTimeModalVisible(false)}
                        footer={[
                          <Button key="cancel" onClick={() => setIsBlockTimeModalVisible(false)}>
                            Cancel
                          </Button>,
                          <Button
                            key="block"
                            type="primary"
                            danger
                            onClick={() => {
                              if (selectedTimeToBlock) {
                                handleBlockTimeSlot(selectedDate.format('YYYY-MM-DD'), selectedTimeToBlock);
                                setIsBlockTimeModalVisible(false);
                              }
                            }}
                          >
                            Block Slot
                          </Button>
                        ]}
                      >
                        <TimePicker
                          format="HH:mm"
                          className="w-full"
                          onChange={(time) => time && setSelectedTimeToBlock(time.format('HH:mm'))}
                        />
                      </Modal>

                      <Button
                        icon={<FileTextOutlined />}
                        block
                        onClick={() => setIsBlockTimeModalVisible(true)}
                      >
                        Block Time Slot
                      </Button>
                      <Modal
                        title="Manage Vacation Days"
                        open={isVacationModalVisible}
                        onCancel={() => setIsVacationModalVisible(false)}
                        footer={[
                          <Button key="cancel" onClick={() => setIsVacationModalVisible(false)}>
                            Cancel
                          </Button>,
                          <Button
                            key="save"
                            type="primary"
                            onClick={() => {
                              handleSetVacationDays(selectedVacationDates);
                              setIsVacationModalVisible(false);
                            }}
                          >
                            Save Vacation Days
                          </Button>
                        ]}
                        width={600}
                      >
                        <div className="mb-4">
                          <h4 className="mb-2">Set New Vacation Days</h4>
                          <DatePicker.RangePicker
                            onChange={(dates) => {
                              if (dates) {
                                const start = dates[0]!;
                                const end = dates[1]!;
                                const dateArray: string[] = [];
                                let currentDate = start;

                                while (currentDate.isBefore(end) || currentDate.isSame(end)) {
                                  dateArray.push(currentDate.format('YYYY-MM-DD'));
                                  currentDate = currentDate.add(1, 'day');
                                }

                                setSelectedVacationDates(dateArray);
                              }
                            }}
                            className="w-full mb-4"
                          />
                        </div>

                        <div>
                          <h4 className="mb-2">Existing Vacation Days</h4>
                          <List
                            size="small"
                            bordered
                            dataSource={vacationDays}
                            renderItem={(item) => (
                              <List.Item
                                actions={[
                                  <Button
                                    key="delete"
                                    type="link"
                                    danger
                                    onClick={() => {
                                      setConfirmAction({
                                        message: 'Are you sure you want to delete these vacation days?',
                                        okText: 'Delete',
                                        isDangerous: true,
                                        onConfirm: () => handleDeleteVacationDays(item.id)
                                      });
                                      setIsConfirmModalVisible(true);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                ]}
                              >
                                <List.Item.Meta
                                  title={
                                    <Space>
                                      <CalendarOutlined />
                                      <span>
                                        {dayjs(item.dates[0]).format('MMM D, YYYY')} -{' '}
                                        {dayjs(item.dates[item.dates.length - 1]).format('MMM D, YYYY')}
                                      </span>
                                    </Space>
                                  }
                                  description={`${item.dates.length} days`}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      </Modal>

                      <Button
                        icon={<CalendarOutlined />}
                        block
                        onClick={() => setIsVacationModalVisible(true)}
                      >
                        Set Vacation Days
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={<span><ClockCircleOutlined /> Today's Queue</span>}
              key="queue"
            >
              <div className="flex gap-4">
                <div className="w-2/3">
                  <List
                    className="bg-white rounded-lg shadow"
                    loading={loading.appointments}
                    header={
                      <div className="flex justify-between items-center">
                        <Title level={5}>Upcoming Appointments</Title>
                        <Select
                          defaultValue="all"
                          style={{ width: 120 }}
                          onChange={(value) => setAppointmentFilter(value as AppointmentStatus | 'all')}
                        >
                          <Option value="all">All</Option>
                          <Option value="upcoming">Upcoming</Option>
                          <Option value="completed">Completed</Option>
                          <Option value="cancelled">Cancelled</Option>
                        </Select>

                      </div>
                    }
                    dataSource={appointments.filter(apt =>
                      // Only filter by status if not 'all'
                      appointmentFilter === 'all' || apt.status === appointmentFilter
                    )}
                    locale={{ emptyText: 'No appointments found' }}
                    renderItem={(appointment) => (
                      <List.Item
                        actions={[
                          <Select
                            key="status"
                            value={appointment.status}
                            onChange={(value) => handleStatusUpdate(appointment.id, value as AppointmentStatus)}
                            style={{ width: 120 }}
                          >
                            <Option value="upcoming">Upcoming</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="cancelled">Cancelled</Option>
                          </Select>,
                          <Button
                            key="notes"
                            icon={<FileTextOutlined />}
                            onClick={() => {
                              setActiveAppointment(appointment);
                            }}
                          >
                            Notes
                          </Button>,
                          <Button
                            key="call"
                            icon={<VideoCameraOutlined />}
                            type="primary"
                            onClick={() => {
                              if (appointment.meetingLink) {
                                window.open(appointment.meetingLink, '_blank');
                              } else {
                                setActiveAppointment(appointment);
                                setIsVideoCallModalVisible(true);
                              }
                            }}
                          >
                            {appointment.meetingLink ? 'Join Call' : 'Start Consultation'}
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={48}
                              src={appointment.patientImage}
                              icon={<UserOutlined />}
                            />
                          }
                          title={
                            <Space>
                              <Text strong>{appointment.patientName}</Text>
                              <Tag color={appointment.priority === 'urgent' ? 'red' : 'blue'}>
                                {appointment.priority}
                              </Tag>
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={2}>
                              <Space>
                                <ClockCircleOutlined />
                                <Text>{dayjs(appointment.dateTime).format('HH:mm')}</Text>
                              </Space>
                              {appointment.symptoms && (
                                <Space>
                                  <MedicineBoxOutlined />
                                  <Text>{appointment.symptoms.join(', ')}</Text>
                                </Space>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>

                <div className="w-1/3">
                  <Card title="Quick Actions" className="mb-4">
                    <Space direction="vertical" className="w-full">
                      <Button icon={<PhoneOutlined />} block>
                        Contact Patient
                      </Button>
                      <Button
                        icon={<FileTextOutlined />}
                        block
                        onClick={() => activeAppointment && fetchPatientHistory(activeAppointment.patientId)}
                      >
                        View Medical History
                      </Button>
                      <Button icon={<BellOutlined />} block>
                        Send Reminder
                      </Button>
                    </Space>
                  </Card>

                  <Card title="Upcoming Notifications">
                    <Timeline>
                      {appointments
                        .filter(apt => apt.status === 'upcoming')
                        .slice(0, 3)
                        .map(apt => (
                          <Timeline.Item key={apt.id}>
                            <Text strong>{apt.patientName}</Text>
                            <br />
                            <Text type="secondary">
                              {dayjs(apt.dateTime).format('HH:mm')} - {apt.type}
                            </Text>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                  </Card>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Card>


        {/* Combined Consultation Notes Modal */}
        <Modal
          title="Consultation Details"
          open={isVideoCallModalVisible}
          onCancel={() => setIsVideoCallModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsVideoCallModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={() => form.submit()}
            >
              Save Consultation
            </Button>
          ]}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveNotes}
          >
            {/* Symptoms Section */}
            <Form.Item
              name="symptoms"
              label="Symptoms"
              rules={[{ required: true, message: 'Please add at least one symptom' }]}
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Add symptoms"
                defaultValue={activeAppointment?.symptoms || []}
              >
                {activeAppointment?.symptoms?.map((symptom) => (
                  <Option key={symptom} value={symptom}>{symptom}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* Diagnosis */}
            <Form.Item
              name="diagnosis"
              label="Diagnosis"
              rules={[{ required: true, message: 'Please enter diagnosis' }]}
            >
              <TextArea rows={4} placeholder="Enter diagnosis" />
            </Form.Item>

            {/* Prescription */}
            <Form.Item
              name="prescription"
              label="Prescription"
              rules={[{ required: true, message: 'Please enter prescription' }]}
            >
              <TextArea rows={4} placeholder="Enter prescription" />
            </Form.Item>

            {/* Additional Notes */}
            <Form.Item
              name="additionalNotes"
              label="Additional Notes"
            >
              <TextArea
                rows={4}
                placeholder="Enter any additional notes"
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
              />
            </Form.Item>

            {/* Meeting Link */}
            <Form.Item
              name="meetingLink"
              label="Video Call Link"
              extra="Enter Zoom or Google Meet link for the consultation"
            >
              <Input
                placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                prefix={<VideoCameraOutlined />}
              />
            </Form.Item>

            {/* Follow-up */}
            <Form.Item label="Follow-up">
              <Space>
                <Form.Item name="followUpDate" noStyle>
                  <DatePicker placeholder="Select date" />
                </Form.Item>
                <Form.Item name="followUpDuration" noStyle>
                  <Select style={{ width: 120 }} placeholder="Duration">
                    <Option value="15">15 minutes</Option>
                    <Option value="30">30 minutes</Option>
                    <Option value="45">45 minutes</Option>
                    <Option value="60">1 hour</Option>
                  </Select>
                </Form.Item>
              </Space>
            </Form.Item>
          </Form>
        </Modal>


        {/* Video Consultation Modal */}
        <Modal
          title={
            <Space>
              <FileTextOutlined />
              <span>Consultation for {activeAppointment?.patientName}</span>
            </Space>
          }
          open={isVideoCallModalVisible}
          onCancel={() => setIsVideoCallModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsVideoCallModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={() => form.submit()}
            >
              Save Consultation
            </Button>
          ]}
          width={800}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveNotes}
            initialValues={{
              symptoms: activeAppointment?.symptoms || [],
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                {/* Meeting Link */}
                <Form.Item
                  name="meetingLink"
                  label="Video Call Link"
                  extra="Enter Zoom or Google Meet link for the consultation"
                >
                  <Input
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                    prefix={<VideoCameraOutlined />}
                  />
                </Form.Item>

                {/* Symptoms */}
                <Form.Item
                  name="symptoms"
                  label="Symptoms"
                  rules={[{ required: true, message: 'Please add at least one symptom' }]}
                >
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Add symptoms"
                  >
                    {activeAppointment?.symptoms?.map((symptom) => (
                      <Option key={symptom} value={symptom}>{symptom}</Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Diagnosis */}
                <Form.Item
                  name="diagnosis"
                  label="Diagnosis"
                  rules={[{ required: true, message: 'Please enter diagnosis' }]}
                >
                  <TextArea rows={4} placeholder="Enter diagnosis" />
                </Form.Item>

                {/* Prescription */}
                <Form.Item
                  name="prescription"
                  label="Prescription"
                  rules={[{ required: true, message: 'Please enter prescription' }]}
                >
                  <TextArea rows={4} placeholder="Enter prescription" />
                </Form.Item>

                {/* Additional Notes */}
                <Form.Item
                  name="additionalNotes"
                  label="Additional Notes"
                >
                  <TextArea
                    rows={4}
                    placeholder="Enter any additional notes"
                  />
                </Form.Item>

                {/* Follow-up */}
                <Form.Item label="Follow-up">
                  <Space>
                    <Form.Item name="followUpDate" noStyle>
                      <DatePicker placeholder="Select date" />
                    </Form.Item>
                    <Form.Item name="followUpDuration" noStyle>
                      <Select style={{ width: 120 }} placeholder="Duration">
                        <Option value="15">15 minutes</Option>
                        <Option value="30">30 minutes</Option>
                        <Option value="45">45 minutes</Option>
                        <Option value="60">1 hour</Option>
                      </Select>
                    </Form.Item>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        {/* Patient History Modal */}
        <Modal
          title={
            <Space>
              <FileTextOutlined />
              <span>Patient Medical History</span>
            </Space>
          }
          open={isHistoryModalVisible}
          onCancel={() => setIsHistoryModalVisible(false)}
          footer={null}
          width={800}
        >
          <Timeline mode="left">
            {patientHistory.map((record) => (
              <Timeline.Item
                key={record.id}
                label={dayjs(record.date).format('YYYY-MM-DD')}
              >
                <Card size="small" className="mb-2">
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Treatment:</strong> {record.treatment}</p>
                  <p><strong>Doctor:</strong> {record.doctorName}</p>
                  {record.notes && (
                    <p><strong>Notes:</strong> {record.notes}</p>
                  )}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </Modal>

        {/* Confirm Action Modal */}
        <Modal
          title="Confirm Action"
          open={isConfirmModalVisible}
          onOk={handleConfirmAction}
          onCancel={() => setIsConfirmModalVisible(false)}
          okText={confirmAction.okText}
          cancelText="Cancel"
          okButtonProps={{ danger: confirmAction.isDangerous }}
        >
          <p>{confirmAction.message}</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default DoctorDashboard;