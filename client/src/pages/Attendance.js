import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, logout, getCurrentUser, markAttendance, getAttendance } from '../services/api';
import './Attendance.css';

// SVG Imports
import { ReactComponent as BackIcon } from '../assets/icons/BackArrow.svg';
import { ReactComponent as UserIcon } from '../assets/icons/User.svg';
import { ReactComponent as LogoutIcon } from '../assets/icons/Logout.svg';
import { ReactComponent as CheckIcon } from '../assets/icons/Check.svg';
import { ReactComponent as CrossIcon } from '../assets/icons/Cross.svg';
import { ReactComponent as CalendarIcon } from '../assets/icons/Calendar.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
import { ReactComponent as EmptyBoxIcon } from '../assets/icons/EmptyBox.svg';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(true);
  const [viewDetail, setViewDetail] = useState(null); // null, 'present', 'absent', 'leave', 'total'
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      loadAttendanceForDate();
    }
  }, [selectedDate, employees]);

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load employees:', err);
      setLoading(false);
    }
  };

  const loadAttendanceForDate = async () => {
    try {
      const response = await getAttendance(selectedDate);
      const attendanceMap = {};
      employees.forEach(emp => {
        attendanceMap[emp.id] = 'present'; // Default
      });
      response.data.forEach(record => {
        attendanceMap[record.employee_id] = record.status;
      });
      setAttendance(attendanceMap);
    } catch (err) {
      const initialAttendance = {};
      employees.forEach(emp => {
        initialAttendance[emp.id] = 'present';
      });
      setAttendance(initialAttendance);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance({ ...attendance, [employeeId]: status });
  };

  const handleSubmit = async () => {
    if (selectedDate > today) {
      alert('Cannot mark attendance for future dates!');
      return; // Stop execution if future date
    }
    try {
      const records = Object.keys(attendance).map(empId => ({
        employee_id: parseInt(empId),
        status: attendance[empId]
      }));
      await markAttendance(selectedDate, records);
      alert(`Attendance marked for ${selectedDate}!`);
    } catch (err) {
      alert('Failed to mark attendance');
      console.error('Error:', err);
    }
  };

  const getStatusCount = () => {
    const present = Object.values(attendance).filter(s => s === 'present').length;
    const absent = Object.values(attendance).filter(s => s === 'absent').length;
    const leave = Object.values(attendance).filter(s => s === 'leave').length;
    return { present, absent, leave };
  };

  const statusCount = getStatusCount();

  const getFilteredEmployees = () => {
    if (viewDetail === 'total') return employees.map(emp => ({ ...emp, status: attendance[emp.id] }));
    return employees.filter(emp => attendance[emp.id] === viewDetail).map(emp => ({ ...emp, status: attendance[emp.id] }));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">
          <h1>EMS</h1>
          <span>Attendance Management</span>
        </div>
        <div className="user-section">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <BackIcon className="icon-small" />
            Back to Dashboard
          </button>
          <div className="user-info">
            <UsersIcon className="user-icon" />
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              <p className="user-role">Admin</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <LogoutIcon className="icon-small" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!viewDetail ? (
          <>
            {/* Stats Section */}
            <section className="stats-section">
              <div className="stat-box clickable green" onClick={() => setViewDetail('present')}>
                <CheckIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{statusCount.present}</h3>
                  <p>Present</p>
                </div>
              </div>
              <div className="stat-box clickable red" onClick={() => setViewDetail('absent')}>
                <CrossIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{statusCount.absent}</h3>
                  <p>Absent</p>
                </div>
              </div>
              <div className="stat-box clickable orange" onClick={() => setViewDetail('leave')}>
                <CalendarIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{statusCount.leave}</h3>
                  <p>On Leave</p>
                </div>
              </div>
              <div className="stat-box clickable blue" onClick={() => setViewDetail('total')}>
                <UserIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{employees.length}</h3>
                  <p>Total</p>
                </div>
              </div>
            </section>

            {/* Attendance Section */}
            <section className="attendance-section">
              <div className="section-header">
                <h2>Mark Attendance</h2>
                <div className="header-actions">
                  <input
                    type="date"
                    value={selectedDate}
                    max={today}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-input"
                  />
                  <button className="btn-submit" onClick={handleSubmit}>
                    Submit Attendance
                  </button>
                </div>
              </div>

              {employees.length === 0 ? (
                <div className="empty-state">
                  <EmptyBoxIcon className="empty-icon" />
                  <h3>No employees found</h3>
                  <p>Add employees first to mark attendance</p>
                </div>
              ) : (
                <div className="attendance-list">
                  {employees.map(emp => (
                    <div key={emp.id} className="attendance-card">
                      <div className="employee-details">
                        <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
                        <div className="info">
                          <h3>{emp.name}</h3>
                          <p>{emp.position || 'No Position'}</p>
                        </div>
                      </div>
                      <div className="status-buttons">
                        <button
                          className={`status-btn present ${attendance[emp.id] === 'present' ? 'active' : ''}`}
                          onClick={() => handleAttendanceChange(emp.id, 'present')}
                        >
                          <CheckIcon className="icon-small" />
                          Present
                        </button>
                        <button
                          className={`status-btn absent ${attendance[emp.id] === 'absent' ? 'active' : ''}`}
                          onClick={() => handleAttendanceChange(emp.id, 'absent')}
                        >
                          <CrossIcon className="icon-small" />
                          Absent
                        </button>
                        <button
                          className={`status-btn leave ${attendance[emp.id] === 'leave' ? 'active' : ''}`}
                          onClick={() => handleAttendanceChange(emp.id, 'leave')}
                        >
                          <CalendarIcon className="icon-small" />
                          Leave
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          // Employee Detail View
          <section className="attendance-section">
            <div className="details-header attendance-view">
              <h2 className="details-title">
                {viewDetail === 'present' && 'Present Employees List'}
                {viewDetail === 'absent' && 'Absent Employees List'}
                {viewDetail === 'leave' && 'Leave Employees List'}
                {viewDetail === 'total' && 'All Employees List'}
              </h2>
              <button className="btn-back-small" onClick={() => setViewDetail(null)}>
                <BackIcon className="icon-small" />
                Back
              </button>
            </div>

            {getFilteredEmployees().length === 0 ? (
              <div className="empty-state">
                <EmptyBoxIcon className="empty-icon" />
                <h3>No employees found</h3>
              </div>
            ) : (
              <div className="attendance-list">
                {getFilteredEmployees().map(emp => (
                  <div key={emp.id} className="attendance-card">
                    <div className="employee-details">
                      <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
                      <div className="info">
                        <h3>{emp.name}</h3>
                        <p>{emp.position || 'No Position'}</p>
                      </div>
                    </div>
                    <div className={`status-label ${emp.status}`}>
                      {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default Attendance;
