// src/components/layout/consultation/BookingModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  Typography,
  Space,
  Alert,
  message
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import type { MatchedDoctor, BookingSlot } from '../../../types/consultation';
import { consultationService } from '../../../services/api/consultation.service';

const { Text, Title } = Typography;
const { Option } = Select;

export interface BookingModalProps {
  visible: boolean;
  doctor: MatchedDoctor;
  onCancel: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  doctor,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    if (visible && selectedDate) {
      fetchAvailableSlots();
    }
  }, [visible, selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const { data } = await consultationService.getAvailableSlots(
        doctor.id,
        selectedDate.format('YYYY-MM-DD')
      );
      
      // Filter slots based on doctor's availability
      const dayOfWeek = selectedDate.day();
      const daySchedule = doctor.availability.find(
        schedule => schedule.dayOfWeek === dayOfWeek
      );

      if (daySchedule) {
        const filteredSlots = data.filter(slot => {
          const slotTime = dayjs(slot.startTime, 'HH:mm');
          const startTime = dayjs(daySchedule.startTime, 'HH:mm');
          const endTime = dayjs(daySchedule.endTime, 'HH:mm');
          return slotTime.isBetween(startTime, endTime, null, '[]');
        });
        setAvailableSlots(filteredSlots);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      message.error('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await consultationService.bookAppointment(doctor.id, values.slotId);
      message.success('Appointment booked successfully!');
      onCancel();
    } catch (error) {
      message.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal
      title={
        <Space direction="vertical" size={0}>
          <Title level={4}>Book Appointment</Title>
          <Text type="secondary">{doctor.name} - {doctor.specialization}</Text>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: 24 }}>
        <Alert
          message="Consultation Fee"
          description={`$${doctor.consultationFee} per session`}
          type="info"
          showIcon
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="date"
          label="Select Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            onChange={(date) => setSelectedDate(date!)}
            format="YYYY-MM-DD"
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item
          name="slotId"
          label="Available Time Slots"
          rules={[{ required: true, message: 'Please select a time slot' }]}
        >
          <Select
            placeholder="Select time slot"
            loading={loading}
            disabled={loading}
          >
            {availableSlots.map((slot) => (
              <Option key={slot.id} value={slot.id}>
                {dayjs(slot.startTime).format('HH:mm')} - {dayjs(slot.endTime).format('HH:mm')}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Book Appointment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingModal;