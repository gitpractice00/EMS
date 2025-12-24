// File: client/src/components/attendance/AttendanceForm.js
import React from 'react';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/Cross.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/Calendar.svg';
import { ReactComponent as EmptyBoxIcon } from '../../assets/icons/EmptyBox.svg';

function AttendanceForm({
  employees,
  attendance,
  selectedDate,
  today,
  onDateChange,
  onAttendanceChange,
  onSubmit
}) {
  return (
    <section className="attendance-section">
      <div className="section-header">
        <h2>Mark Attendance</h2>
        <div className="header-actions">
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => onDateChange(e.target.value)}
            className="date-input"
          />
          <button className="btn-submit" onClick={onSubmit}>
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
                <div className="avatar">#{emp.id}</div>
                <div className="info">
                  <h3>{emp.name}</h3>
                  <p>{emp.position || 'No Position'}</p>
                </div>
              </div>
              <div className="status-buttons">
                <button
                  className={`status-btn present ${attendance[emp.id] === 'present' ? 'active' : ''}`}
                  onClick={() => onAttendanceChange(emp.id, 'present')}
                >
                  <CheckIcon className="icon-small" />
                  Present
                </button>
                <button
                  className={`status-btn absent ${attendance[emp.id] === 'absent' ? 'active' : ''}`}
                  onClick={() => onAttendanceChange(emp.id, 'absent')}
                >
                  <CrossIcon className="icon-small" />
                  Absent
                </button>
                <button
                  className={`status-btn leave ${attendance[emp.id] === 'leave' ? 'active' : ''}`}
                  onClick={() => onAttendanceChange(emp.id, 'leave')}
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
  );
}

export default AttendanceForm;