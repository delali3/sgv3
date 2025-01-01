import React from 'react';
import { Button, Space, Typography, Tooltip } from 'antd';
import { ClockCircleOutlined, LockOutlined } from '@ant-design/icons';
import type { TimeSlot } from '../../types/doctor';

const { Text } = Typography;

interface TimeSlotsProps {
  slots: TimeSlot[];
  loading: boolean;
  onSlotClick: (slot: TimeSlot) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  slots,
  loading,
  onSlotClick,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {slots.map((slot) => {
        const isBooked = !slot.isAvailable && slot.appointment;
        const isBlocked = !slot.isAvailable && !slot.appointment;

        return (
          <Tooltip
            key={slot.id}
            title={
              isBooked 
                ? `Booked by ${slot.appointment?.patientName}` 
                : isBlocked 
                ? 'Time slot is blocked'
                : 'Available'
            }
          >
            <Button
              className="w-full h-20 flex flex-col items-center justify-center"
              type={slot.isAvailable ? 'default' : 'dashed'}
              disabled={!slot.isAvailable}
              onClick={() => onSlotClick(slot)}
            >
              <Space direction="vertical" size={1} className="text-center">
                <Text strong>
                  <ClockCircleOutlined className="mr-1" />
                  {slot.startTime} - {slot.endTime}
                </Text>
                {isBooked && (
                  <Text type="secondary" className="text-xs">
                    {slot.appointment?.patientName}
                  </Text>
                )}
                {isBlocked && (
                  <LockOutlined className="text-gray-400" />
                )}
              </Space>
            </Button>
          </Tooltip>
        );
      })}
      {slots.length === 0 && !loading && (
        <div className="col-span-4 text-center py-8">
          <Text type="secondary">No time slots available</Text>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;