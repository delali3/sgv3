// // src/components/dashboard/DoctorDashboard.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Row,
//   Col,
//   Card,
//   Statistic,
//   List,
//   Tag,
//   Button,
//   Typography,
//   Avatar,
//   Timeline,
//   Progress,
//   Space,
//   Table
// } from 'antd';
// import {
//   UserOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   StarOutlined,
//   VideoCameraOutlined
// } from '@ant-design/icons';
// import type { DoctorStats, DoctorAppointment, Patient } from '../../types/doctor';
// import type { ColumnType } from 'antd/es/table';

// const { Title } = Typography;

// const DoctorDashboard: React.FC = () => {
//   const [stats, setStats] = useState<DoctorStats>({
//     totalPatients: 0,
//     todayAppointments: 0,
//     completedToday: 0,
//     averageRating: 0
//   });

//   const [todayAppointments, setTodayAppointments] = useState<DoctorAppointment[]>([]);
//   const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  
//   useEffect(() => {
//     // Fetch data from your API
//     // Mock data for demonstration
//     setStats({
//       totalPatients: 150,
//       todayAppointments: 8,
//       completedToday: 3,
//       averageRating: 4.8
//     });

//     setTodayAppointments([
//       {
//         id: '1',
//         patientName: 'John Doe',
//         patientId: 'P001',
//         dateTime: '2024-12-20T09:00:00',
//         type: 'consultation',
//         status: 'scheduled',
//         notes: 'Regular checkup'
//       },
//       // Add more appointments...
//     ]);

//     setRecentPatients([
//       {
//         id: 'P001',
//         name: 'John Doe',
//         age: 45,
//         lastVisit: '2024-12-15',
//         nextAppointment: '2024-12-20',
//         condition: 'Hypertension'
//       },
//     ]);
//   }, []);

//   const appointmentColumns: ColumnType<DoctorAppointment>[] = [
//     {
//       title: 'Time',
//       dataIndex: 'dateTime',
//       key: 'time',
//       render: (dateTime: string) => new Date(dateTime).toLocaleTimeString(),
//       width: 100,
//     },
//     {
//       title: 'Patient',
//       dataIndex: 'patientName',
//       key: 'patient',
//       render: (text: string) => (
//         <Space>
//           <Avatar icon={<UserOutlined />} />
//           {text}
//         </Space>
//       ),
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//       render: (type: DoctorAppointment['type']) => (
//         <Tag color={type === 'emergency' ? 'red' : type === 'follow-up' ? 'green' : 'blue'}>
//           {type.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: DoctorAppointment['status']) => (
//         <Tag color={
//           status === 'completed' ? 'green' : 
//           status === 'in-progress' ? 'blue' : 
//           status === 'cancelled' ? 'red' : 'gold'
//         }>
//           {status.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space>
//           <Button 
//             type="primary" 
//             icon={<VideoCameraOutlined />}
//             disabled={record.status !== 'scheduled'}
//           >
//             Start
//           </Button>
//           <Button type="link">View Details</Button>
//         </Space>
//       ),
//     }
//   ];

//   return (
//     <div>
//       <Title level={2}>Doctor Dashboard</Title>

//       {/* Stats Section */}
//       <Row gutter={[16, 16]} className="mb-6">
//         <Col xs={24} sm={6}>
//           <Card>
//             <Statistic
//               title="Total Patients"
//               value={stats.totalPatients}
//               prefix={<UserOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={6}>
//           <Card>
//             <Statistic
//               title="Today's Appointments"
//               value={stats.todayAppointments}
//               prefix={<ClockCircleOutlined />}
//               valueStyle={{ color: '#1890ff' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={6}>
//           <Card>
//             <Statistic
//               title="Completed Today"
//               value={stats.completedToday}
//               prefix={<CheckCircleOutlined />}
//               valueStyle={{ color: '#3f8600' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={6}>
//           <Card>
//             <Statistic
//               title="Average Rating"
//               value={stats.averageRating}
//               prefix={<StarOutlined />}
//               precision={1}
//               valueStyle={{ color: '#faad14' }}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Main Content */}
//       <Row gutter={[16, 16]}>
//         {/* Today's Schedule */}
//         <Col xs={24} lg={16}>
//           <Card 
//             title="Today's Schedule" 
//             extra={<Button type="primary">Add Appointment</Button>}
//           >
//             <Table
//               dataSource={todayAppointments}
//               columns={appointmentColumns}
//               pagination={false}
//               rowKey="id"
//             />
//           </Card>
//         </Col>

//         {/* Today's Progress */}
//         <Col xs={24} lg={8}>
//           <Card title="Today's Progress">
//             <Progress 
//               type="circle" 
//               percent={Math.round((stats.completedToday / stats.todayAppointments) * 100)} 
//               format={() => `${stats.completedToday}/${stats.todayAppointments}`}
//             />
//             <Timeline className="mt-4">
//               {todayAppointments.map(appointment => (
//                 <Timeline.Item 
//                   key={appointment.id}
//                   color={
//                     appointment.status === 'completed' ? 'green' : 
//                     appointment.status === 'in-progress' ? 'blue' : 
//                     'gray'
//                   }
//                 >
//                   <p>{appointment.patientName}</p>
//                   <small>{new Date(appointment.dateTime).toLocaleTimeString()}</small>
//                 </Timeline.Item>
//               ))}
//             </Timeline>
//           </Card>
//         </Col>

//         {/* Recent Patients */}
//         <Col xs={24}>
//           <Card 
//             title="Recent Patients"
//             extra={<Button type="link">View All Patients</Button>}
//           >
//             <List
//               dataSource={recentPatients}
//               renderItem={(patient) => (
//                 <List.Item
//                   actions={[
//                     <Button type="link">View History</Button>,
//                     <Button type="link">Schedule Follow-up</Button>
//                   ]}
//                 >
//                   <List.Item.Meta
//                     avatar={<Avatar icon={<UserOutlined />} />}
//                     title={patient.name}
//                     description={
//                       <>
//                         <div>Age: {patient.age}</div>
//                         <div>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</div>
//                         {patient.condition && <Tag color="blue">{patient.condition}</Tag>}
//                       </>
//                     }
//                   />
//                 </List.Item>
//               )}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DoctorDashboard;