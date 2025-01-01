import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  List,
  Tag,
  message,
  Spin,
  Upload
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  MedicineBoxOutlined,
  UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { patientService, PatientProfileData, UpdatePatientProfileData } from '../../services/api/patient.service';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const PatientProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<PatientProfileData | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data } = await patientService.getProfile();
      setProfileData(data);
      
      // Set form values
      form.setFieldsValue({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        phone: data.user.phone,
        gender: data.user.gender,
        dateOfBirth: dayjs(data.user.dateOfBirth),
        address: data.user.address
      });
    } catch (error) {
      message.error('Failed to load profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const updatedData: UpdatePatientProfileData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        address: values.address,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        gender: values.gender
      };

      const { data } = await patientService.updateProfile(updatedData);
      setProfileData(data);
      message.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      message.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const { data } = await patientService.updateProfileImage(file);
      setProfileData(prev => prev ? {
        ...prev,
        user: {
          ...prev.user,
          profileImage: data.profileImage
        }
      } : null);
      message.success('Profile image updated successfully');
    } catch (error) {
      message.error('Failed to upload profile image');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const renderPersonalInfo = () => (
    <Card className="mb-4">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8} className="text-center">
          <Avatar 
            size={120} 
            icon={<UserOutlined />} 
            src={profileData?.user.profileImage}
            className="mb-4" 
          />
          {editMode && (
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleImageUpload(file);
                return false;
              }}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
                className="w-full"
              >
                Change Photo
              </Button>
            </Upload>
          )}
        </Col>
        <Col xs={24} sm={16}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true, message: 'First name is required' }]}
                >
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true, message: 'Last name is required' }]}
                >
                  <Input disabled={!editMode} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[{ required: true, message: 'Date of birth is required' }]}
                >
                  <DatePicker disabled={!editMode} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Gender is required' }]}
                >
                  <Select disabled={!editMode}>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: 'Phone number is required' }]}
                >
                  <Input disabled={!editMode} prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Invalid email format' }
                  ]}
                >
                  <Input disabled prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="address" label="Address">
              <TextArea disabled={!editMode} rows={2} />
            </Form.Item>
            {editMode && (
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Save Changes
                </Button>
                <Button
                  className="ml-2"
                  onClick={() => {
                    setEditMode(false);
                    form.setFieldsValue({
                      firstName: profileData?.user.firstName,
                      lastName: profileData?.user.lastName,
                      email: profileData?.user.email,
                      phone: profileData?.user.phone,
                      gender: profileData?.user.gender,
                      dateOfBirth: dayjs(profileData?.user.dateOfBirth),
                      address: profileData?.user.address
                    });
                  }}
                >
                  Cancel
                </Button>
              </Form.Item>
            )}
          </Form>
        </Col>
      </Row>
      {!editMode && (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setEditMode(true)}
          className="absolute top-4 right-4"
        >
          Edit Profile
        </Button>
      )}
    </Card>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-4">
      <Card title="Medical History" className="mb-4">
        <List
          dataSource={profileData?.profile.medicalHistory}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.condition}
                description={`Date: ${item.date} | Doctor: ${item.doctor}`}
              />
              <Tag color={item.status === 'Resolved' ? 'green' : 'blue'}>
                {item.status}
              </Tag>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Allergies" className="mb-4">
        <div className="space-x-2">
          {profileData?.profile.allergies.map(allergy => (
            <Tag key={allergy} color="red">
              {allergy}
            </Tag>
          ))}
        </div>
      </Card>

      <Card title="Current Medications">
        <List
          dataSource={profileData?.profile.currentMedications}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`Dosage: ${item.dosage} | Frequency: ${item.frequency}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Title level={2} className="mb-6">
        <MedicineBoxOutlined className="mr-2" />
        Patient Profile
      </Title>
      
      <Tabs defaultActiveKey="personal">
        <TabPane tab="Personal Information" key="personal">
          {renderPersonalInfo()}
        </TabPane>
        <TabPane tab="Medical Information" key="medical">
          {renderMedicalInfo()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PatientProfile;