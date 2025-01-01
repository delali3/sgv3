import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  ConfigProvider,
  Row,
  Col,
  message
} from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Reset email sent to:', values.email);
      messageApi.success('Reset password link has been sent to your email');
    } catch (error) {
      console.error('Error:', error);
      messageApi.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Input: {
            controlHeight: 40,
          },
          Button: {
            controlHeight: 40,
          },
        },
      }}
    >
      {contextHolder}
      <Row className="min-h-screen">
        <Col xs={0} sm={0} md={12} lg={12} xl={12} style={{ height: '100vh' }}>
          <img
            src="./image.png"
            alt="Healthcare"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Col>
        
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div style={{ 
            padding: '40px 24px',
            maxWidth: 400,
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh'
          }}>
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />} 
              style={{ padding: 0, marginBottom: 40, width: 'fit-content' }}
              onClick={() => window.history.back()}
            >
              Back to login
            </Button>

            <div style={{ marginBottom: 40 }}>
              <Title level={2} style={{ marginBottom: 8 }}>
                Forgot password?
              </Title>
              <Paragraph type="secondary">
                No worries, we'll send you reset instructions.
              </Paragraph>
            </div>

            <Form
              name="forgotPasswordForm"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400" />} 
                  placeholder="Enter your email" 
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                >
                  Reset password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default ForgotPasswordPage;