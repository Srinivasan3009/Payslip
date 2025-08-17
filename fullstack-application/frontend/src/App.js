import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import Cookies from 'js-cookie'; // To handle cookies easily
import Attendance  from './Attendance';
import AddSubjectForm from './dashboard/AddSubjectForm';
import PayslipComponent from './PayslipComponent';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  // Retrieve the JWT token from cookie
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/attendance" element={<Attendance/>}/>
        <Route path="/AddSubjectForm" element={<AddSubjectForm/>}/>
        <Route path="/payslip" element={<PayslipComponent/>}/>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
