// // src/pages/MedicalRecords.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Tabs,
//   Button,
//   Table,
//   Tag,
//   Space,
//   Typography,
//   Input,
//   DatePicker,
//   Select,
//   Drawer,
//   List,
//   Avatar,
//   Tooltip,
//   Badge,
//   Timeline,
//   message
// } from 'antd';
// import {
//   FileTextOutlined,
//   MedicineBoxOutlined,
//   SearchOutlined,
//   DownloadOutlined,
//   ExperimentOutlined,
//   PlusOutlined,
//   FileOutlined
// } from '@ant-design/icons';
// import type { ColumnsType } from 'antd/es/table';
// import type { MedicalRecord } from '../../types/medicalRecords';
// // import type { MedicalRecord } from '../../styles/MedicalRecords.module.css';
// import dayjs from 'dayjs';

// const { Title, Text, Paragraph } = Typography;
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// const { TabPane } = Tabs;

// const MedicalRecordsPage: React.FC = () => {
//   const [records, setRecords] = useState<MedicalRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('list');
//   const [, setFilterType] = useState<string>('all');
//   const [, setSearchText] = useState('');
//   const [, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
//   type BadgeStatus = 'success' | 'processing' | 'error' | 'default' | 'warning';

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const fetchRecords = async () => {
//     try {
//       // Simulate API call
//       setLoading(true);
//       const mockRecords: MedicalRecord[] = [
//         {
//           id: '1',
//           category: 'consultation',
//           date: '2024-12-20',
//           doctorName: 'Dr. Smith',
//           title: 'General Checkup',
//           description: 'Annual health examination',
//           status: 'completed',
//           facility: 'City General Hospital',
//           notes: 'Patient reported mild fatigue'
//         },
//         {
//           id: '2',
//           category: 'test',
//           date: '2024-12-18',
//           doctorName: 'Dr. Johnson',
//           title: 'Blood Test',
//           description: 'Complete blood count',
//           result: 'Normal range',
//           status: 'completed',
//           facility: 'City Lab'
//         },
//         {
//           id: '3',
//           category: 'prescription',
//           date: '2024-12-15',
//           doctorName: 'Dr. Wilson',
//           title: 'Medication',
//           description: 'Antibiotic prescription',
//           status: 'pending',
//           notes: 'Take with food'
//         }
//       ];
      
//       setRecords(mockRecords);
//       setLoading(false);
//     } catch (error) {
//       message.error('Failed to fetch records');
//       setLoading(false);
//     }
//   };

//   const columns: ColumnsType<MedicalRecord> = [
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//       sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
//       render: (date) => dayjs(date).format('MMM D, YYYY')
//     },
//     {
//       title: 'Category',
//       dataIndex: 'category',
//       key: 'category',
//       filters: [
//         { text: 'Consultation', value: 'consultation' },
//         { text: 'Test', value: 'test' },
//         { text: 'Prescription', value: 'prescription' },
//         { text: 'Vaccination', value: 'vaccination' },
//         { text: 'Surgery', value: 'surgery' }
//       ],
//       render: (category) => {
//         const colors = {
//           consultation: 'blue',
//           test: 'green',
//           prescription: 'purple',
//           vaccination: 'orange',
//           surgery: 'red'
//         };
//         return (
//           <Tag color={colors[category as keyof typeof colors]}>
//             {category.toUpperCase()}
//           </Tag>
//         );
//       }
//     },
//     {
//       title: 'Title',
//       dataIndex: 'title',
//       key: 'title',
//       render: (title, record) => (
//         <Space>
//           {record.category === 'test' && record.result && (
//             <Tooltip title={`Result: ${record.result}`}>
//               <Badge status={record.result === 'Normal range' ? 'success' : 'warning'} />
//             </Tooltip>
//           )}
//           {title}
//         </Space>
//       )
//     },
//     {
//       title: 'Doctor',
//       dataIndex: 'doctorName',
//       key: 'doctorName'
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => {
//         const statusColors: Record<string, BadgeStatus> = {
//           completed: 'success',
//           pending: 'processing',
//           cancelled: 'error',
//           active: 'processing'
//         };
    
//         return <Badge status={statusColors[status] || 'default'} text={status} />;
//       }
//     },    
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space size="middle">
//           <Button 
//             type="link" 
//             onClick={() => {
//               setSelectedRecord(record);
//               setDrawerVisible(true);
//             }}
//           >
//             View Details
//           </Button>
//           {record.attachments && (
//             <Button type="link" icon={<DownloadOutlined />}>
//               Download
//             </Button>
//           )}
//         </Space>
//       )
//     }
//   ];

//   const renderRecordDetails = (record: MedicalRecord) => (
//     <div className="record-details">
//       <Space direction="vertical" size="large" style={{ width: '100%' }}>
//         <Card title="Basic Information">
//           <Space direction="vertical">
//             <Text><strong>Date:</strong> {dayjs(record.date).format('MMMM D, YYYY')}</Text>
//             <Text><strong>Category:</strong> {record.category.toUpperCase()}</Text>
//             <Text><strong>Doctor:</strong> {record.doctorName}</Text>
//             <Text><strong>Facility:</strong> {record.facility}</Text>
//             <Text><strong>Status:</strong> {record.status}</Text>
//           </Space>
//         </Card>

//         <Card title="Details">
//           <Space direction="vertical">
//             <Paragraph><strong>Description:</strong></Paragraph>
//             <Paragraph>{record.description}</Paragraph>
//             {record.result && (
//               <>
//                 <Paragraph><strong>Result:</strong></Paragraph>
//                 <Paragraph>{record.result}</Paragraph>
//               </>
//             )}
//             {record.notes && (
//               <>
//                 <Paragraph><strong>Notes:</strong></Paragraph>
//                 <Paragraph>{record.notes}</Paragraph>
//               </>
//             )}
//           </Space>
//         </Card>

//         {record.attachments && (
//           <Card title="Attachments">
//             <List
//               dataSource={record.attachments}
//               renderItem={attachment => (
//                 <List.Item
//                   actions={[
//                     <Button type="link" icon={<DownloadOutlined />}>
//                       Download
//                     </Button>
//                   ]}
//                 >
//                   <List.Item.Meta
//                     avatar={<FileOutlined />}
//                     title={attachment.name}
//                     description={`${(attachment.size / 1024 / 1024).toFixed(2)} MB`}
//                   />
//                 </List.Item>
//               )}
//             />
//           </Card>
//         )}
//       </Space>
//     </div>
//   );

//   return (
//     <div style={{ padding: '24px' }}>
//       <Card>
//         <div style={{ marginBottom: 24 }}>
//           <Space direction="vertical" size="large" style={{ width: '100%' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
//               <Space>
//                 <Title level={2}>Medical Records</Title>
//               </Space>
//               <Space>
//                 <Button type="primary" icon={<PlusOutlined />}>
//                   Add Record
//                 </Button>
//               </Space>
//             </div>

//             <Space wrap>
//               <Input
//                 placeholder="Search records"
//                 prefix={<SearchOutlined />}
//                 style={{ width: 200 }}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//               <Select
//                 defaultValue="all"
//                 style={{ width: 150 }}
//                 onChange={setFilterType}
//               >
//                 <Option value="all">All Categories</Option>
//                 <Option value="consultation">Consultations</Option>
//                 <Option value="test">Tests</Option>
//                 <Option value="prescription">Prescriptions</Option>
//                 <Option value="vaccination">Vaccinations</Option>
//                 <Option value="surgery">Surgeries</Option>
//               </Select>
//               <RangePicker onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} />
//             </Space>
//           </Space>
//         </div>

//         <Tabs activeKey={activeTab} onChange={setActiveTab}>
//           <TabPane tab="List View" key="list">
//             <Table
//               columns={columns}
//               dataSource={records}
//               loading={loading}
//               rowKey="id"
//               pagination={{ pageSize: 10 }}
//             />
//           </TabPane>
//           <TabPane tab="Timeline View" key="timeline">
//             <Timeline mode="left">
//               {records.map(record => (
//                 <Timeline.Item
//                   key={record.id}
//                   dot={
//                     <Avatar
//                       icon={
//                         record.category === 'consultation' ? <MedicineBoxOutlined /> :
//                         record.category === 'test' ? <ExperimentOutlined /> :
//                         <FileTextOutlined />
//                       }
//                       style={{ backgroundColor: '#1890ff' }}
//                     />
//                   }
//                 >
//                   <Card
//                     size="small"
//                     title={
//                       <Space>
//                         <Text strong>{record.title}</Text>
//                         <Tag color="blue">{record.category.toUpperCase()}</Tag>
//                       </Space>
//                     }
//                     extra={
//                       <Button
//                         type="link"
//                         onClick={() => {
//                           setSelectedRecord(record);
//                           setDrawerVisible(true);
//                         }}
//                       >
//                         View Details
//                       </Button>
//                     }
//                   >
//                     <Space direction="vertical" size="small">
//                       <Text type="secondary">{dayjs(record.date).format('MMMM D, YYYY')}</Text>
//                       <Text>{record.description}</Text>
//                       <Text type="secondary">{record.doctorName}</Text>
//                     </Space>
//                   </Card>
//                 </Timeline.Item>
//               ))}
//             </Timeline>
//           </TabPane>
//         </Tabs>
//       </Card>

//       <Drawer
//         title="Record Details"
//         placement="right"
//         onClose={() => setDrawerVisible(false)}
//         open={drawerVisible}
//         width={600}
//       >
//         {selectedRecord && renderRecordDetails(selectedRecord)}
//       </Drawer>
//     </div>
//   );
// };

// export default MedicalRecordsPage;