import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Row,
  Col,
  Checkbox,
  ConfigProvider,
  theme
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  GithubOutlined
} from '@ant-design/icons';
import type { LoginCredentials } from '../../services/api/auth.service';
import api from '../../services/api/index.service';

const { Title, Text, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();

  const handleSubmit = async (values: LoginCredentials & { remember: boolean }) => {
    try {
      setLoading(true);
      const response = await api.auth.login({
        email: values.email,
        password: values.password
      });

      if (response.token) {
        // Set auth token
        api.setAuthToken(response.token);

        message.success('Login successful!');

        // Redirect based on role
        const redirectPath = response.user.role === 'doctor'
          ? '/doctor/dashboard'
          : '/patient/dashboard';

        navigate(redirectPath);
      }
    } catch (error) {
      // Error handling is managed by axios interceptors in api/config.ts
      console.error('Login error:', error);
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
                  Welcome Back
                </Title>
                <Paragraph style={{ color: token.colorTextSecondary, marginBottom: 0 }}>
                  Sign in to access your healthcare dashboard
                </Paragraph>
              </div>

              <div style={{ padding: '24px' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark="optional"
                  size="large"
                  initialValues={{ remember: true }}
                >
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

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please enter your password' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password"
                    />
                  </Form.Item>

                  <Row justify="space-between" align="middle">
                    <Col>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button 
                        type="link" 
                        onClick={() => navigate('/forgot-password')}
                        style={{ padding: 0 }}
                      >
                        Forgot password?
                      </Button>
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
                      Sign In
                    </Button>
                  </Form.Item>

                  <Divider>Or continue with</Divider>

                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={12}>
                      <Button
                        block
                        icon={<GoogleOutlined />}
                        onClick={() => message.info('Google sign-in coming soon')}
                      >
                        Google
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        block
                        icon={<GithubOutlined />}
                        onClick={() => message.info('GitHub sign-in coming soon')}
                      >
                        GitHub
                      </Button>
                    </Col>
                  </Row>

                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">
                      Don't have an account?{' '}
                      <span
                        onClick={() => navigate('/register')}
                        style={{ color: token.colorPrimary, cursor: 'pointer' }}
                      >
                        Sign up
                      </span>
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

export default LoginPage;