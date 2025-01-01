// src/pages/home/index.tsx
import React, { useEffect } from 'react';
import { Typography, Button, Row, Col, Card, Space, List, Layout } from 'antd';
import {
  MessageOutlined,
  SafetyOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/Header';
import styles from './Home.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Content } from 'antd/es/layout/layout';


const { Title, Text, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });
  }, []);

  const features = [
    {
      icon: <MessageOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: 'AI-Powered Consultations',
      description: 'Get instant medical guidance through our advanced AI chat system'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: 'Expert Doctors',
      description: 'Connect with qualified healthcare professionals across various specialties'
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: '24/7 Availability',
      description: 'Access healthcare services anytime, anywhere at your convenience'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security'
    }
  ];

  const howItWorks = [
    {
      title: 'Describe Your Symptoms',
      description: 'Chat with our AI medical assistant to describe your health concerns.'
    },
    {
      title: 'Get AI Analysis',
      description: 'Receive an instant preliminary analysis of your symptoms.'
    },
    {
      title: 'Match with Specialists',
      description: 'Get matched with qualified doctors based on your condition.'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with your chosen healthcare provider.'
    }
  ];

  return (
    <Layout className={styles.layout}>
      <AppHeader />
      <Content>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent} data-aos="fade-up">
            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
              <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                <Space direction="vertical" size={24} style={{ width: '100%', textAlign: 'center' }}>
                  <div className={styles.heroTitle}>
                    <Title level={1}>
                      Your Path to Better Health Starts Here
                    </Title>
                    <Paragraph>
                      Experience the future of healthcare with AI-powered consultations 
                      and instant access to qualified doctors.
                    </Paragraph>
                  </div>
                  <Space size={16} className={styles.heroCta}>
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => navigate('/consultation')}
                      className={styles.primaryButton}
                    >
                      Start Consultation
                    </Button>
                    <Button 
                      size="large"
                      onClick={() => navigate('/doctors')}
                      className={styles.secondaryButton}
                    >
                      Find Doctors
                    </Button>
                  </Space>
                </Space>
              </Col>
            </Row>
            <div className={styles.heroWave}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#f5f5f5" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <Row justify="center">
            <Col xs={22} sm={20} md={20} lg={20} xl={20}>
              <Title level={2} className={styles.sectionTitle} data-aos="fade-up">
                Why Choose Snuggle
              </Title>
              <Row gutter={[32, 32]}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} md={12} lg={6} key={index}>
                    <Card 
                      className={styles.featureCard} 
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className={styles.featureIcon}>{feature.icon}</div>
                      <Title level={4}>{feature.title}</Title>
                      <Text type="secondary">{feature.description}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>

        {/* How it Works Section */}
        <div className={styles.howItWorks}>
          <Row justify="center">
            <Col xs={22} sm={20} md={16} lg={14} xl={12}>
              <Title level={2} className={styles.sectionTitle} data-aos="fade-up">
                How It Works
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={howItWorks}
                renderItem={(item, index) => (
                  <List.Item 
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className={styles.howItWorksItem}
                  >
                    <List.Item.Meta
                      avatar={
                        <div className={styles.stepNumber}>{index + 1}</div>
                      }
                      title={<Text strong>{item.title}</Text>}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>

        {/* Call to Action */}
        <div className={styles.cta} data-aos="fade-up">
          <Row justify="center">
            <Col xs={22} sm={20} md={16} lg={14} xl={12}>
              <Card className={styles.ctaCard}>
                <Title level={2}>Ready to Get Started?</Title>
                <Paragraph>
                  Join thousands of satisfied patients who have chosen Snuggle for their healthcare needs.
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/register')}
                  className={styles.ctaButton}
                >
                  Create Free Account
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;