// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Form,
//   Input,
//   Button,
//   TimePicker,
//   Select,
//   Switch,
//   Upload,
//   message,
//   Divider,
//   Space,
//   Typography
// } from 'antd';
// import { Camera } from 'lucide-react';
// import type { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;

// interface DoctorProfile {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   specialization: string;
//   consultationFee: number;
//   experience: number;
//   availability: {
//     dayOfWeek: number;
//     startTime: string;
//     endTime: string;
//     isAvailable: boolean;
//   }[];
//   profileImage: string | null;
//   bio: string;
// }

// const weekDays = [
//   'Sunday',
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday'
// ];

// const DoctorProfileManagement: React.FC = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [profile, setProfile] = useState<DoctorProfile | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);

//   useEffect(() => {
//     fetchDoctorProfile();
//   }, []);

//   const fetchDoctorProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/doctor/profile', {
//         credentials: 'include'
//       });
//       const data = await response.json();
//       setProfile(data);
//       form.setFieldsValue({
//         ...data,
//         availability: data.availability.map((slot: any) => ({
//           ...slot,
//           startTime: slot.startTime ? dayjs(slot.startTime, 'HH:mm') : null,
//           endTime: slot.endTime ? dayjs(slot.endTime, 'HH:mm') : null,
//         }))
//       });
//       setImageUrl(data.profileImage);
//     } catch (error) {
//       message.error('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (values: any) => {
//     try {
//       setLoading(true);
//       const formattedValues = {
//         ...values,
//         availability: values.availability.map((slot: any) => ({
//           ...slot,
//           startTime: slot.startTime?.format('HH:mm'),
//           endTime: slot.endTime?.format('HH:mm'),
//         }))
//       };

//       await fetch('/api/doctor/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formattedValues),
//       });

//       message.success('Profile updated successfully');
//       fetchDoctorProfile();
//     } catch (error) {
//       message.error('Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async (info: any) => {
//     if (info.file.status === 'uploading') {
//       setLoading(true);
//       return;
//     }
//     if (info.file.status === 'done') {
//       setLoading(false);
//       setImageUrl(info.file.response.url);
//       message.success('Profile image uploaded successfully');
//     }
//   };

//   return (
//     <div className="p-6">
//       <Card>
//         <Title level={2}>Profile Management</Title>
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//           className="max-w-3xl"
//         >
//           <div className="mb-6">
//             <Upload
//               name="profileImage"
//               action="/api/doctor/upload-image"
//               showUploadList={false}
//               onChange={handleImageUpload}
//               className="mb-4"
//             >
//               <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
//                 {imageUrl ? (
//                   <img
//                     src={imageUrl}
//                     alt="Profile"
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 ) : (
//                   <Camera size={32} className="text-gray-400" />
//                 )}
//               </div>
//             </Upload>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item
//               name="firstName"
//               label="First Name"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="lastName"
//               label="Last Name"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[{ required: true, type: 'email' }]}
//             >
//               <Input disabled />
//             </Form.Item>

//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[{ required: true }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="specialization"
//               label="Specialization"
//               rules={[{ required: true }]}
//             >
//               <Select>
//                 <Option value="general">General Physician</Option>
//                 <Option value="cardiology">Cardiologist</Option>
//                 <Option value="dermatology">Dermatologist</Option>
//                 <Option value="pediatrics">Pediatrician</Option>
//                 <Option value="orthopedics">Orthopedic</Option>
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="consultationFee"
//               label="Consultation Fee"
//               rules={[{ required: true }]}
//             >
//               <Input type="number" prefix="$" />
//             </Form.Item>
//           </div>

//           <Form.Item
//             name="bio"
//             label="Professional Bio"
//             rules={[{ required: true }]}
//           >
//             <TextArea rows={4} />
//           </Form.Item>

//           <Divider>Availability Schedule</Divider>

//           <Form.List name="availability">
//             {(fields) => (
//               <>
//                 {fields.map((field, index) => (
//                   <Space key={field.key} className="flex items-center mb-4">
//                     <Text strong>{weekDays[index]}</Text>
//                     <Form.Item
//                       {...field}
//                       name={[field.name, 'isAvailable']}
//                       valuePropName="checked"
//                     >
//                       <Switch />
//                     </Form.Item>
//                     <Form.Item
//                       {...field}
//                       name={[field.name, 'startTime']}
//                     >
//                       <TimePicker format="HH:mm" />
//                     </Form.Item>
//                     <Text>to</Text>
//                     <Form.Item
//                       {...field}
//                       name={[field.name, 'endTime']}
//                     >
//                       <TimePicker format="HH:mm" />
//                     </Form.Item>
//                   </Space>
//                 ))}
//               </>
//             )}
//           </Form.List>

//           <Button type="primary" htmlType="submit" loading={loading}>
//             Save Changes
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default DoctorProfileManagement;