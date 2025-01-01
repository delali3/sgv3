// src/components/layout/DashboardLayout.tsx
import React, { ReactNode } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import { UserRole } from '../../types/navigation';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar role={role} />
      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: '8px'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;