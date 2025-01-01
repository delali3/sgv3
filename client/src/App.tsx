// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import AppointmentsPage from './pages/patient/Appointments';
import ConsultationPage from './pages/patient/Consultation';
// import MedicalRecordsPage from './pages/patient/MedicalRecords';
import PatientProfile from './pages/patient/PatientProfile';
import Patients from './pages/doctor/Patients';
import SettingsPage from './pages/doctor/Settings';
import RegistrationPage from './pages/auth/Register';
import LoginPage from './pages/auth/Login';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import { App as AntApp } from 'antd';
import HomePage from './pages/general/homepage';
import DoctorDashboard from './components/layout/DoctorDashboard';
function App() {
  return (
    <AntApp>
      <BrowserRouter>
        <Routes>
          <Route>
            {/* Public routes */}
            <Route path='/register' element={<RegistrationPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/' element={<HomePage />} />
          </Route>
          {/* Patient routes */}
          <Route path="/patient/*" element={
            <DashboardLayout role="patient">
              <Routes>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="chat" element={<ConsultationPage />} />
                {/* <Route path="records" element={<MedicalRecordsPage />} /> */}
                <Route path="profile" element={<PatientProfile />} />
              </Routes>
            </DashboardLayout>
          } />

          {/* Doctor routes */}
          <Route path="/doctor/*" element={
            <DashboardLayout role="doctor">
              <Routes>
                <Route path="dashboard" element={<DoctorDashboard/>} />
                {/* <Route path="schedule" element={<DoctorSchedule />} /> */}
                <Route path="patients" element={<Patients />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AntApp>
  );
}

export default App;