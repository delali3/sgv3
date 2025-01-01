// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Menu, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { key: 'home', label: 'Home', path: '/' },
    { key: 'doctors', label: 'Find Doctors', path: '/doctors' },
    { key: 'services', label: 'Services', path: '/services' },
    { key: 'about', label: 'About', path: '/about' },
  ];

  const onMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <Header 
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 1000,
        padding: '0 50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div className={styles.logo} onClick={() => navigate('/')}>
        <img 
          src="/logo.svg" 
          alt="Snuggle" 
          style={{ height: '32px' }}
        />
        <span className={styles.brandName}>Snuggle</span>
      </div>

      {/* Desktop Navigation */}
      <div className={styles.desktopNav}>
        <Menu 
          mode="horizontal" 
          selectedKeys={[location.pathname]}
          style={{ 
            border: 'none', 
            background: 'transparent',
            marginRight: '40px'
          }}
        >
          {menuItems.map(item => (
            <Menu.Item 
              key={item.path}
              onClick={() => onMenuClick(item.path)}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        <Space size={16}>
          <Button type="link" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button 
            type="primary" 
            onClick={() => navigate('/register')}
            className={styles.registerButton}
          >
            Register
          </Button>
        </Space>
      </div>

      {/* Mobile Menu Button */}
      <Button
        className={styles.mobileMenuButton}
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Navigation Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className={styles.mobileDrawer}
      >
        <Menu mode="vertical">
          {menuItems.map(item => (
            <Menu.Item 
              key={item.path}
              onClick={() => onMenuClick(item.path)}
            >
              {item.label}
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item key="login" onClick={() => {
            navigate('/login');
            setMobileMenuOpen(false);
          }}>
            Login
          </Menu.Item>
          <Menu.Item key="register" onClick={() => {
            navigate('/register');
            setMobileMenuOpen(false);
          }}>
            Register
          </Menu.Item>
        </Menu>
      </Drawer>
    </Header>
  );
};

export default AppHeader;