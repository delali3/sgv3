import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Divider,
  message,
  Segmented,
  theme,
  ConfigProvider
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
  HeartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../services/api/index.service';
import type { RegisterUserData } from '../../services/api/auth.service';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dateOfBirth: dayjs.Dayjs | null;
  role: 'patient' | 'doctor';
  specialization?: string;
  licenseNumber?: string;
}

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');
  const { token } = theme.useToken();

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      setLoading(true);

      const userData: RegisterUserData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : '',
        password: values.password,
        role: values.role,
        ...(values.role === 'doctor' && {
          specialization: values.specialization,
          licenseNumber: values.licenseNumber
        })
      };

      const response = await api.auth.register(userData);

      if (response.token) {
        api.setAuthToken(response.token);

        message.success('Registration successful! Please check your email to verify your account.');

        // Redirect based on role
        const redirectPath = response.user.role === 'doctor'
          ? '/doctor/dashboard'
          : '/patient/dashboard';

        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    marginTop: 24
  };

  const headerStyle = {
    background: token.colorPrimaryBg,
    padding: '32px 24px',
    textAlign: 'center' as const,
    borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
    marginTop: -1,
    marginLeft: -1,
    marginRight: -1,
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: 'transparent',
          },
        },
      }}
    >
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(120deg, ${token.colorPrimaryBg} 0%, ${token.colorInfoBg} 100%)`,
        padding: '24px'
      }}>
        <Row justify="center" align="middle">
          <Col xs={24} sm={24} md={20} lg={16} xl={14}>
            <Card
              bordered={false}
              style={cardStyle}
            >
              <div style={headerStyle}>
                <Title level={2} style={{ color: token.colorPrimaryText, marginBottom: 8 }}>
                  Create Your Account
                </Title>
                <Paragraph style={{ color: token.colorTextSecondary, marginBottom: 0 }}>
                  Join our healthcare platform today
                </Paragraph>
              </div>

              <div style={{ padding: '24px' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark="optional"
                  size="large"
                  initialValues={{
                    role: userRole
                  }}
                >
                  {/* Role Selection */}
                  <Form.Item name="role" style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Segmented
                      value={userRole}
                      onChange={(value) => {
                        setUserRole(value as 'patient' | 'doctor');
                        form.setFieldsValue({ role: value });
                      }}

                      options={[
                        {
                          label: (
                            <div style={{ padding: '4px 8px' }}>
                              <HeartOutlined style={{ marginRight: 4 }} />
                              Patient
                            </div>
                          ),
                          value: 'patient',
                        },
                        {
                          label: (
                            <div style={{ padding: '4px 8px' }}>
                              <MedicineBoxOutlined style={{ marginRight: 4 }} />
                              Doctor
                            </div>
                          ),
                          value: 'doctor',
                        },
                      ]}
                    />
                  </Form.Item>

                  {/* Personal Information */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="First Name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Last Name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                          { required: true, message: 'Please enter your phone number' },
                          { pattern: /^[0-9+\- ]+$/, message: 'Please enter a valid phone number' }
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined />}
                          placeholder="Phone Number"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please select your date of birth' }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select your gender' }]}
                      >
                        <Select placeholder="Select Gender">
                          <Option value="male">Male</Option>
                          <Option value="female">Female</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  {userRole === 'doctor' && (
                    <>
                      <Divider />
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="specialization"
                            label="Specialization"
                            rules={[{ required: true, message: 'Please select your specialization' }]}
                          >
                            <Select placeholder="Select Specialization">
                              <Option value="general">General Physician</Option>
                              <Option value="cardiology">Cardiologist</Option>
                              <Option value="neurology">Neurologist</Option>
                              <Option value="pediatrics">Pediatrician</Option>
                              <Option value="dermatology">Dermatologist</Option>
                              <Option value="psychiatry">Psychiatrist</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="licenseNumber"
                            label="License Number"
                            rules={[{ required: true, message: 'Please enter your license number' }]}
                          >
                            <Input
                              prefix={<IdcardOutlined />}
                              placeholder="License Number"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}

                  <Divider />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                          { required: true, message: 'Please enter your password' },
                          { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="Password"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                          { required: true, message: 'Please confirm your password' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('Passwords do not match'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="Confirm Password"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item style={{ marginTop: 24 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                    >
                      Create Account
                    </Button>
                  </Form.Item>

                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">
                      Already have an account?{' '}
                      <span
                        onClick={() => navigate('/login')}
                        style={{ color: token.colorPrimary, cursor: 'pointer' }}
                      >Sign in</span>
                    </Text>
                  </div>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default RegistrationPage;