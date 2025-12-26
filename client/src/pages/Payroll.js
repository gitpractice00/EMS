import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, logout, getCurrentUser, savePayroll, getPayroll } from '../services/api';
import './Payroll.css';

// SVG Icon Imports
import { ReactComponent as RupeeSign } from '../assets/icons/RupeeSign.svg';
import { ReactComponent as LogoutIcon } from '../assets/icons/Logout.svg';
import { ReactComponent as CheckCircleIcon } from '../assets/icons/CheckCircle.svg';
import { ReactComponent as ClockIcon } from '../assets/icons/Clock.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
import { ReactComponent as UserCircleIcon } from '../assets/icons/UserCircle.svg';
import { ReactComponent as InboxIcon } from '../assets/icons/Inbox.svg';
import { ReactComponent as SaveIcon } from '../assets/icons/Save.svg';
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(''); // FIXED: Added error state
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      loadPayrollForMonth();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, employees]);

  // FIXED: Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  const loadPayrollForMonth = async () => {
    try {
      const response = await getPayroll(selectedMonth);
      const payrollMap = {};
      employees.forEach(emp => {
        const existing = response.data.find(p => p.employee_id === emp.id);
        if (existing) {
          payrollMap[emp.id] = {
            basicSalary: parseFloat(existing.basic_salary) || 0,
            allowances: parseFloat(existing.allowances) || 0,
            deductions: parseFloat(existing.deductions) || 0,
            workingDays: 22,
            status: existing.payment_status || 'pending',
            paidDate: existing.paid_date || null
          };
        } else {
          payrollMap[emp.id] = {
            basicSalary: emp.salary || 30000,
            allowances: 0,
            deductions: 0,
            workingDays: 22,
            status: 'pending',
            paidDate: null
          };
        }
      });
      setPayrollData(payrollMap);
    } catch (err) {
      const initialPayroll = {};
      employees.forEach(emp => {
        initialPayroll[emp.id] = {
          basicSalary: emp.salary || 30000,
          allowances: 0,
          deductions: 0,
          workingDays: 22,
          status: 'pending',
          paidDate: null
        };
      });
      setPayrollData(initialPayroll);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const calculateNetSalary = (empId) => {
    const data = payrollData[empId];
    if (!data) return 0;
    const dailySalary = data.basicSalary / 30;
    const earnedSalary = dailySalary * data.workingDays;
    return Math.round(earnedSalary + data.allowances - data.deductions);
  };

  // FIXED: Validate working days when updating
  const updatePayrollData = (empId, field, value) => {
    // FIXED: Validate working days
    if (field === 'workingDays') {
      const numValue = parseFloat(value) || 0;
      if (numValue > 31) {
        setError('Working days cannot be more than 31');
        return; // Don't update the state
      }
    }

    setPayrollData({
      ...payrollData,
      [empId]: {
        ...payrollData[empId],
        [field]: parseFloat(value) || 0
      }
    });
  };

  const saveCurrentPayroll = async () => {
    if (saving) return;
    
    // FIXED: Validate all working days before saving
    const invalidWorkingDays = Object.entries(payrollData).find(
      ([empId, data]) => data.workingDays > 31
    );
    
    if (invalidWorkingDays) {
      setError('Working days cannot be more than 31. Please check all entries.');
      return;
    }

    setSaving(true);
    setError(''); // Clear any previous errors
    
    try {
      const records = employees.map(emp => {
        const data = payrollData[emp.id];
        return {
          employee_id: emp.id,
          basic_salary: data.basicSalary,
          allowances: data.allowances,
          deductions: data.deductions,
          net_salary: calculateNetSalary(emp.id),
          payment_status: data.status,
          paid_date: data.paidDate
        };
      });
      await savePayroll(selectedMonth, records);
      alert(`Payroll saved successfully for ${selectedMonth}!`);
    } catch (err) {
      setError('Failed to save payroll: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const markAsPaid = async (empId) => {
    const currentDateTime = new Date().toISOString();
    
    // FIXED: Validate working days before marking as paid
    if (payrollData[empId].workingDays > 31) {
      setError('Working days cannot be more than 31. Please correct before marking as paid.');
      return;
    }
    
    console.log('Marking employee as paid:', empId, 'DateTime:', currentDateTime);
    
    try {
      setPayrollData({
        ...payrollData,
        [empId]: {
          ...payrollData[empId],
          status: 'paid',
          paidDate: currentDateTime
        }
      });

      const records = employees.map(emp => {
        let data;
        if (emp.id === empId) {
          data = {
            ...payrollData[empId],
            status: 'paid',
            paidDate: currentDateTime
          };
        } else {
          data = payrollData[emp.id];
        }
        
        return {
          employee_id: emp.id,
          basic_salary: data.basicSalary,
          allowances: data.allowances,
          deductions: data.deductions,
          net_salary: emp.id === empId ? calculateNetSalary(empId) : calculateNetSalary(emp.id),
          payment_status: data.status,
          paid_date: data.paidDate || null
        };
      });
      
      console.log('Sending payroll records:', records);
      
      await savePayroll(selectedMonth, records);
      alert('Marked as paid!');
      
      await loadPayrollForMonth();
    } catch (err) {
      setPayrollData({
        ...payrollData,
        [empId]: {
          ...payrollData[empId],
          status: 'pending',
          paidDate: null
        }
      });
      setError('Failed to mark as paid: ' + (err.response?.data?.error || err.message));
      console.error('Mark as paid error:', err);
    }
  };

  const getTotalPayroll = () => employees.reduce((total, emp) => total + calculateNetSalary(emp.id), 0);
  const getPaidCount = () => Object.values(payrollData).filter(p => p.status === 'paid').length;
  const getPendingCount = () => Object.values(payrollData).filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="payroll-page">
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">
          <h1>EMS</h1>
          <span>Payroll Management</span>
        </div>
        <div className="user-section">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <ArrowLeftIcon className="icon-small" />
            Dashboard
          </button>
          <div className="user-info">
            <UserCircleIcon className="user-icon" />
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
        {/* Stats Section with Navigation */}
        <section className="stats-section">
          <div className="stat-box blue">
            <div className="stat-icon">
              <RupeeSign />
            </div>
            <div className="stat-info">
              <h3>Rs. {getTotalPayroll().toLocaleString()}</h3>
              <p>Total Payroll</p>
            </div>
          </div>

          {/* Navigate to Paid Employees Page */}
          <div 
            className="stat-box green clickable" 
            onClick={() => navigate('/payroll/paid')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-icon">
              <CheckCircleIcon />
            </div>
            <div className="stat-info">
              <h3>{getPaidCount()}</h3>
              <p>Paid</p>
            </div>
          </div>

          {/* Navigate to Pending Employees Page */}
          <div 
            className="stat-box orange clickable" 
            onClick={() => navigate('/payroll/pending')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-icon">
              <ClockIcon />
            </div>
            <div className="stat-info">
              <h3>{getPendingCount()}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-box purple">
            <div className="stat-icon">
              <UsersIcon />
            </div>
            <div className="stat-info">
              <h3>{employees.length}</h3>
              <p>Employees</p>
            </div>
          </div>
        </section>

        {/* FIXED: Error message display */}
        {error && (
          <div className="error-message" style={{ 
            margin: '20px 0', 
            padding: '15px', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '8px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        {/* Payroll Section */}
        <section className="payroll-section">
          <div className="section-header">
            <h2>Monthly Payroll</h2>
            <div className="header-actions">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="month-input"
              />
              <button
                className="btn-save"
                onClick={saveCurrentPayroll}
                disabled={saving || employees.length === 0}
              >
                <SaveIcon className="icon-small" />
                {saving ? 'Saving...' : 'Save Payroll'}
              </button>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="empty-state">
              <InboxIcon className="empty-icon" />
              <h3>No employees found</h3>
              <p>Add employees to manage payroll</p>
            </div>
          ) : (
            <div className="payroll-list">
              {employees.map((emp) => (
                <div key={emp.id} className="payroll-card">
                  <div className="employee-header">
                    <div className="employee-details">
                      <div className="avatar">#{emp.id}</div>
                      <div className="info">
                        <h3>{emp.name}</h3>
                        <p>{emp.position || 'No Position'}</p>
                      </div>
                    </div>
                    <div className={`status-badge ${payrollData[emp.id]?.status}`}>
                      {payrollData[emp.id]?.status === 'paid' ? (
                        <>
                          <CheckCircleIcon className="badge-icon" />
                          Paid
                        </>
                      ) : (
                        <>
                          <ClockIcon className="badge-icon" />
                          Pending
                        </>
                      )}
                    </div>
                  </div>

                  <div className="payroll-details">
                    <div className="detail-row">
                      <label>Basic Salary:</label>
                      <input
                        type="number"
                        min="0"
                        value={payrollData[emp.id]?.basicSalary}
                        onChange={(e) => updatePayrollData(emp.id, 'basicSalary', e.target.value)}
                        className="small-input"
                      />
                    </div>

                    <div className="detail-row">
                      <label>Working Days:</label>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={payrollData[emp.id]?.workingDays}
                        onChange={(e) => updatePayrollData(emp.id, 'workingDays', e.target.value)}
                        className="small-input"
                      />
                    </div>

                    <div className="detail-row">
                      <label>Allowances (Rs):</label>
                      <input
                        type="number"
                        min="0"
                        value={payrollData[emp.id]?.allowances}
                        onChange={(e) => updatePayrollData(emp.id, 'allowances', e.target.value)}
                        className="small-input"
                      />
                    </div>

                    <div className="detail-row">
                      <label>Deductions (Rs):</label>
                      <input
                        type="number"
                        min="0"
                        value={payrollData[emp.id]?.deductions}
                        onChange={(e) => updatePayrollData(emp.id, 'deductions', e.target.value)}
                        className="small-input"
                      />
                    </div>

                    <div className="detail-row total">
                      <label>Net Salary:</label>
                      <span className="net-amount">Rs.{calculateNetSalary(emp.id).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn-pay"
                      onClick={() => markAsPaid(emp.id)}
                      disabled={payrollData[emp.id]?.status === 'paid'}
                    >
                      {payrollData[emp.id]?.status === 'paid' ? (
                        <>
                          <CheckCircleIcon className="icon-small" />
                          Paid
                        </>
                      ) : (
                        'Mark as Paid'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Payroll;