// File: client/src/components/attendance/AttendanceStats.js
import React from 'react';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/Cross.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/Calendar.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/User.svg';

function AttendanceStats({ statusCount, totalEmployees, onViewDetail }) {
  return (
    <section className="stats-section">
      <div className="stat-box clickable green" onClick={() => onViewDetail('present')}>
        <CheckIcon className="icon-status" />
        <div className="stat-info">
          <h3>{statusCount.present}</h3>
          <p>Present</p>
        </div>
      </div>
      
      <div className="stat-box clickable red" onClick={() => onViewDetail('absent')}>
        <CrossIcon className="icon-status" />
        <div className="stat-info">
          <h3>{statusCount.absent}</h3>
          <p>Absent</p>
        </div>
      </div>
      
      <div className="stat-box clickable orange" onClick={() => onViewDetail('leave')}>
        <CalendarIcon className="icon-status" />
        <div className="stat-info">
          <h3>{statusCount.leave}</h3>
          <p>On Leave</p>
        </div>
      </div>
      
      <div className="stat-box clickable blue" onClick={() => onViewDetail('total')}>
        <UserIcon className="icon-status" />
        <div className="stat-info">
          <h3>{totalEmployees}</h3>
          <p>Total</p>
        </div>
      </div>
    </section>
  );
}

export default AttendanceStats;