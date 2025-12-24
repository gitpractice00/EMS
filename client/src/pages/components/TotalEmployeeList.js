// File: client/src/components/attendance/TotalEmployeesList.js
import React from 'react';
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/ArrowLeft.svg';
import { ReactComponent as EmptyBoxIcon } from '../../assets/icons/EmptyBox.svg';

function TotalEmployeesList({ employees, onBack }) {
  return (
    <section className="attendance-section">
      <div className="details-header attendance-view">
        <h2 className="details-title">All Employees List</h2>
        <button className="btn-back-small" onClick={onBack}>
          <ArrowLeftIcon className="icon-small" />
          Back
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <EmptyBoxIcon className="empty-icon" />
          <h3>No employees found</h3>
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
              <div className={`status-label ${emp.status}`}>
                {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TotalEmployeesList;