// SettingsPage.tsx
import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Upload,
  Space,
  Divider,
  message,
  TimePicker,
  Radio,
  Avatar,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  SettingOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>();

  // Mock user preferences
  const initialPreferences = {
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointmentReminder: true,
      marketingEmails: false
    },
    workHours: {
      start: '09:00',
      end: '17:00'
    },
    language: 'en',
    theme: 'light'
  };

  const handleProfileSubmit = async (values: any) => {
    setLoading(true);
    try {
      // API call would go here
      console.log('Profile update:', values);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (values: any) => {
    setLoading(true);
    try {
      // API call would go here
      console.log('Security update:', values);
      message.success('Security settings updated successfully');
    } catch (error) {
      message.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      setAvatarUrl(info.file.response.url);
    }
  };

  const ProfileSettings = () => (
    <Form
      form={profileForm}
      layout="vertical"
      onFinish={handleProfileSubmit}
      initialValues={{
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900'
      }}
    >
      <div className="mb-6 text-center">
        <Avatar 
          size={100} 
          icon={<UserOutlined />} 
          src={avatarUrl}
          className="mb-4"
        />
        <Upload
          name="avatar"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          <Button icon={<UploadOutlined />}>Change Profile Photo</Button>
        </Upload>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="bio"
        label="Professional Bio"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <Space direction="vertical" className="w-full">
          <div className="flex justify-between items-center">
            <span>Appointment Reminders</span>
            <Switch defaultChecked={initialPreferences.notifications.appointmentReminder} />
          </div>
          <div className="flex justify-between items-center">
            <span>SMS Notifications</span>
            <Switch defaultChecked={initialPreferences.notifications.sms} />
          </div>
          <div className="flex justify-between items-center">
            <span>Push Notifications</span>
            <Switch defaultChecked={initialPreferences.notifications.push} />
          </div>
          <div className="flex justify-between items-center">
            <span>Marketing Emails</span>
            <Switch defaultChecked={initialPreferences.notifications.marketingEmails} />
          </div>
        </Space>
      </div>

      <Divider />

      <div>
        <h3 className="text-lg font-medium mb-4">Working Hours</h3>
        <Space>
          <TimePicker defaultValue={dayjs(initialPreferences.workHours.start, 'HH:mm')} format="HH:mm" />
          <span>to</span>
          <TimePicker defaultValue={dayjs(initialPreferences.workHours.end, 'HH:mm')} format="HH:mm" />
        </Space>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <Form
      form={securityForm}
      layout="vertical"
      onFinish={handleSecuritySubmit}
    >
      <Form.Item
        name="currentPassword"
        label="Current Password"
        rules={[{ required: true }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="twoFactor"
        label="Two-Factor Authentication"
      >
        <Switch defaultChecked={false} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Security Settings
        </Button>
      </Form.Item>
    </Form>
  );

  const PreferenceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Display Settings</h3>
        <Form.Item
          name="theme"
          label="Theme"
          initialValue={initialPreferences.theme}
        >
          <Radio.Group>
            <Radio.Button value="light">Light</Radio.Button>
            <Radio.Button value="dark">Dark</Radio.Button>
            <Radio.Button value="system">System</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          initialValue={initialPreferences.language}
        >
          <Select>
            <Option value="en">English</Option>
            <Option value="es">Spanish</Option>
            <Option value="fr">French</Option>
          </Select>
        </Form.Item>
      </div>

      <Divider />

      <div>
        <h3 className="text-lg font-medium mb-4">Calendar Settings</h3>
        <Space direction="vertical" className="w-full">
          <div className="flex justify-between items-center">
            <span>Show Weekend</span>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <span>Week Starts On</span>
            <Select defaultValue="monday" style={{ width: 120 }}>
              <Option value="sunday">Sunday</Option>
              <Option value="monday">Monday</Option>
            </Select>
          </div>
        </Space>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultActiveKey="profile">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Profile
              </span>
            }
            key="profile"
          >
            <ProfileSettings />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            }
            key="notifications"
          >
            <NotificationSettings />
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Security
              </span>
            }
            key="security"
          >
            <SecuritySettings />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Preferences
              </span>
            }
            key="preferences"
          >
            <PreferenceSettings />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;