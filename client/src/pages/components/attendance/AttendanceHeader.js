// File: client/src/components/attendance/AttendanceHeader.js
import React from 'react';
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/ArrowLeft.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/Logout.svg';
import { ReactComponent as UsersIcon } from '../../assets/icons/Users.svg';

function AttendanceHeader({ user, onLogout, onNavigateBack }) {
  return (
    <header className="top-header">
      <div className="logo">
        <h1>EMS</h1>
        <span>Attendance Management</span>
      </div>
      <div className="user-section">
        <button className="btn-back" onClick={onNavigateBack}>
          <ArrowLeftIcon className="icon-small" />
          Dashboard
        </button>
        <div className="user-info">
          <UsersIcon className="user-icon" />
          <div className="user-details">
            <p className="user-name">{user?.username}</p>
            <p className="user-role">Admin</p>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <LogoutIcon className="icon-small" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default AttendanceHeader;