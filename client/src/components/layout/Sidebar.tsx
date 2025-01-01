// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { UserRole, MenuItem } from '../../types/navigation';

const { Sider } = Layout;

interface SidebarProps {
  role?: UserRole;
}

const MOBILE_BREAKPOINT = 768;

const Sidebar: React.FC<SidebarProps> = ({ role = 'patient' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const patientMenuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        navigate('/patient/dashboard');
        setDrawerVisible(false);
      }
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
      onClick: () => {
        navigate('/patient/appointments');
        setDrawerVisible(false);
      }
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: 'Start Consultation',
      onClick: () => {
        navigate('/patient/chat');
        setDrawerVisible(false);
      }
    },
    {
      key: 'records',
      icon: <FileTextOutlined />,
      label: 'Medical Records',
      onClick: () => {
        navigate('/patient/records');
        setDrawerVisible(false);
      }
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        navigate('/patient/profile');
        setDrawerVisible(false);
      }
    }
  ];

  const doctorMenuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        navigate('/doctor/dashboard');
        setDrawerVisible(false);
      }
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: 'Schedule',
      onClick: () => {
        navigate('/doctor/schedule');
        setDrawerVisible(false);
      }
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: 'Patients',
      onClick: () => {
        navigate('/doctor/patients');
        setDrawerVisible(false);
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => {
        navigate('/doctor/settings');
        setDrawerVisible(false);
      }
    }
  ];

  const menuItems = role === 'patient' ? patientMenuItems : doctorMenuItems;
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';

  const Logo = () => (
    <div 
      style={{ 
        height: '64px', 
        margin: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <h2 style={{ 
        color: '#1890ff', 
        margin: 0,
        fontSize: collapsed ? '16px' : '20px',
        transition: 'font-size 0.3s'
      }}>
        {collapsed ? 'MC' : 'MedConsult'}
      </h2>
    </div>
  );

  const MenuComponent = () => (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      style={{ borderRight: 0 }}
    />
  );

  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 999,
            fontSize: '18px',
            width: '40px',
            height: '40px',
          }}
        />
        <Drawer
          title={<Logo />}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          <MenuComponent />
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      style={{
        minHeight: '100vh',
        background: '#fff',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <Logo />
      <MenuComponent />
    </Sider>
  );
};

export default Sidebar;