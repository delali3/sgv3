// Patients.tsx
import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  Card,
  Tag,
  Space,
  Select,
  Modal,
  DatePicker,
  Form,
  Tooltip,
  Avatar,
  Typography
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  nextAppointment: string | null;
  condition: string;
  status: 'Active' | 'Inactive' | 'Pending';
  phone: string;
  email: string;
}

const Patients: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form] = Form.useForm();

  // Mock data - replace with API call
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      lastVisit: '2024-03-15',
      nextAppointment: '2024-04-01',
      condition: 'Hypertension',
      status: 'Active',
      phone: '+1 234 567 8900',
      email: 'john.doe@email.com'
    },
    // Add more mock patients...
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string | null) => {
    setFilterStatus(value);
  };

  const handleScheduleAppointment = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsScheduleModalVisible(true);
  };

  const handleScheduleSubmit = (values: any) => {
    console.log('Scheduling appointment:', values);
    setIsScheduleModalVisible(false);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Active: 'green',
      Inactive: 'red',
      Pending: 'orange'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
      sorter: (a: Patient, b: Patient) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a: Patient, b: Patient) => a.age - b.age,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
      ],
    },
    {
      title: 'Last Visit',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      sorter: (a: Patient, b: Patient) => Date.parse(a.lastVisit) - Date.parse(b.lastVisit),
    },
    {
      title: 'Next Appointment',
      dataIndex: 'nextAppointment',
      key: 'nextAppointment',
      render: (text: string | null) => text || 'Not Scheduled',
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
        { text: 'Pending', value: 'Pending' },
      ],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Patient) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => console.log('View patient:', record.id)} 
            />
          </Tooltip>
          <Tooltip title="Schedule Appointment">
            <Button 
              type="link" 
              icon={<CalendarOutlined />} 
              onClick={() => handleScheduleAppointment(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => console.log('Edit patient:', record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => console.log('Delete patient:', record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">Patient Management</Title>
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Patient
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search patients..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            className="max-w-md"
          />
          <Select
            placeholder="Filter by status"
            allowClear
            onChange={handleStatusFilter}
            className="w-40"
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          pagination={{
            total: filteredPatients.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="Schedule Appointment"
        open={isScheduleModalVisible}
        onCancel={() => setIsScheduleModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleScheduleSubmit}
        >
          <Form.Item
            name="patient"
            label="Patient"
          >
            <Input 
              disabled 
              value={selectedPatient?.name} 
              placeholder={selectedPatient?.name}
            />
          </Form.Item>
          <Form.Item
            name="dateTime"
            label="Appointment Date & Time"
            rules={[{ required: true, message: 'Please select appointment date and time' }]}
          >
            <DatePicker showTime className="w-full" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Appointment Type"
            rules={[{ required: true, message: 'Please select appointment type' }]}
          >
            <Select>
              <Option value="checkup">Regular Checkup</Option>
              <Option value="followup">Follow-up</Option>
              <Option value="consultation">Consultation</Option>
              <Option value="emergency">Emergency</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsScheduleModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Schedule
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Patients;