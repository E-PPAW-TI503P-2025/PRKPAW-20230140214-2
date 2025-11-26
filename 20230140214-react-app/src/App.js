import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';
import Navbar from './components/Navbar';
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  return (
    <Router>

      {/* NAVBAR GLOBAL */}
      <Navbar />

      {/* SEMUA ROUTE */}
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Presensi untuk semua user (mahasiswa/admin) */}
        <Route path="/presensi" element={<PresensiPage />} />

        {/* Reports hanya muncul di navbar jika role admin */}
        <Route path="/reports" element={<ReportPage />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
