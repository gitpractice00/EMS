// // File: client/src/pages/Payroll.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllEmployees, logout, getCurrentUser, savePayroll, getPayroll } from '../services/api';
// import './Payroll.css';

// // SVG Icon Imports
// import { ReactComponent as RupeeSign } from '../assets/icons/RupeeSign.svg';
// import { ReactComponent as CheckCircleIcon } from '../assets/icons/CheckCircle.svg';
// import { ReactComponent as ClockIcon } from '../assets/icons/Clock.svg';
// import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
// import { ReactComponent as UserCircleIcon } from '../assets/icons/UserCircle.svg';
// import { ReactComponent as InboxIcon } from '../assets/icons/Inbox.svg';
// import { ReactComponent as SaveIcon } from '../assets/icons/Save.svg';
// import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';

// function Payroll() {
//   const [employees, setEmployees] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
//   const [loading, setLoading] = useState(true);
//   const [payrollData, setPayrollData] = useState({});
//   const [saving, setSaving] = useState(false);
//   const navigate = useNavigate();
//   const user = getCurrentUser();

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   useEffect(() => {
//     if (employees.length > 0) {
//       loadPayrollForMonth();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedMonth, employees]);

//   const loadEmployees = async () => {
//     try {
//       const response = await getAllEmployees();
//       setEmployees(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Failed to load employees:', err);
//       setLoading(false);
//     }
//   };

//   const loadPayrollForMonth = async () => {
//     try {
//       const response = await getPayroll(selectedMonth);
//       const payrollMap = {};
//       employees.forEach(emp => {
//         const existing = response.data.find(p => p.employee_id === emp.id);
//         if (existing) {
//           payrollMap[emp.id] = {
//             basicSalary: parseFloat(existing.basic_salary) || 0,
//             allowances: parseFloat(existing.allowances) || 0,
//             deductions: parseFloat(existing.deductions) || 0,
//             workingDays: 22,
//             status: existing.payment_status || 'pending'
//           };
//         } else {
//           payrollMap[emp.id] = {
//             basicSalary: emp.salary || 30000,
//             allowances: 0,
//             deductions: 0,
//             workingDays: 22,
//             status: 'pending'
//           };
//         }
//       });
//       setPayrollData(payrollMap);
//     } catch (err) {
//       const initialPayroll = {};
//       employees.forEach(emp => {
//         initialPayroll[emp.id] = {
//           basicSalary: emp.salary || 30000,
//           allowances: 0,
//           deductions: 0,
//           workingDays: 22,
//           status: 'pending'
//         };
//       });
//       setPayrollData(initialPayroll);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const calculateNetSalary = (empId) => {
//     const data = payrollData[empId];
//     if (!data) return 0;
//     const dailySalary = data.basicSalary / 30;
//     const earnedSalary = dailySalary * data.workingDays;
//     return Math.round(earnedSalary + data.allowances - data.deductions);
//   };

//   const updatePayrollData = (empId, field, value) => {
//     setPayrollData({
//       ...payrollData,
//       [empId]: {
//         ...payrollData[empId],
//         [field]: parseFloat(value) || 0
//       }
//     });
//   };

//   const saveCurrentPayroll = async () => {
//     if (saving) return;
//     setSaving(true);
//     try {
//       const records = employees.map(emp => {
//         const data = payrollData[emp.id];
//         return {
//           employee_id: emp.id,
//           basic_salary: data.basicSalary,
//           allowances: data.allowances,
//           deductions: data.deductions,
//           net_salary: calculateNetSalary(emp.id),
//           payment_status: data.status
//         };
//       });
//       await savePayroll(selectedMonth, records);
//       alert(`Payroll saved successfully for ${selectedMonth}!`);
//     } catch (err) {
//       alert('Failed to save payroll: ' + (err.response?.data?.error || err.message));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const markAsPaid = async (empId) => {
//     try {
//       setPayrollData({
//         ...payrollData,
//         [empId]: {
//           ...payrollData[empId],
//           status: 'paid'
//         }
//       });
//       await saveCurrentPayroll();
//       alert('Marked as paid!');
//     } catch (err) {
//       setPayrollData({
//         ...payrollData,
//         [empId]: {
//           ...payrollData[empId],
//           status: 'pending'
//         }
//       });
//       alert('Failed to mark as paid');
//     }
//   };

//   const getTotalPayroll = () => employees.reduce((total, emp) => total + calculateNetSalary(emp.id), 0);
//   const getPaidCount = () => Object.values(payrollData).filter(p => p.status === 'paid').length;
//   const getPendingCount = () => Object.values(payrollData).filter(p => p.status === 'pending').length;

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner"></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="payroll-page">
//       {/* Top Header */}
//       <header className="top-header">
//         <div className="logo">
//           <h1>EMS</h1>
//           <span>Payroll Management</span>
//         </div>
//         <div className="user-section">
//           <button className="btn-back" onClick={() => navigate('/dashboard')}>
//             <ArrowLeftIcon className="icon-small" />
//             Dashboard
//           </button>
//           <div className="user-info">
//             <UserCircleIcon className="user-icon" />
//             <div className="user-details">
//               <p className="user-name">{user?.username}</p>
//               <p className="user-role">Admin</p>
//             </div>
//           </div>
//           <button className="btn-logout" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Stats Section with Navigation */}
//         <section className="stats-section">
//           <div className="stat-box blue">
//             <div className="stat-icon">
//               <RupeeSign />
//             </div>
//             <div className="stat-info">
//               <h3>Rs. {getTotalPayroll().toLocaleString()}</h3>
//               <p>Total Payroll</p>
//             </div>
//           </div>

//           {/* Navigate to Paid Employees Page */}
//           <div 
//             className="stat-box green clickable" 
//             onClick={() => navigate('/payroll/paid')}
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="stat-icon">
//               <CheckCircleIcon />
//             </div>
//             <div className="stat-info">
//               <h3>{getPaidCount()}</h3>
//               <p>Paid</p>
//             </div>
//           </div>

//           {/* Navigate to Pending Employees Page */}
//           <div 
//             className="stat-box orange clickable" 
//             onClick={() => navigate('/payroll/pending')}
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="stat-icon">
//               <ClockIcon />
//             </div>
//             <div className="stat-info">
//               <h3>{getPendingCount()}</h3>
//               <p>Pending</p>
//             </div>
//           </div>

//           <div className="stat-box purple">
//             <div className="stat-icon">
//               <UsersIcon />
//             </div>
//             <div className="stat-info">
//               <h3>{employees.length}</h3>
//               <p>Employees</p>
//             </div>
//           </div>
//         </section>

//         {/* Payroll Section */}
//         <section className="payroll-section">
//           <div className="section-header">
//             <h2>Monthly Payroll</h2>
//             <div className="header-actions">
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//                 className="month-input"
//               />
//               <button
//                 className="btn-save"
//                 onClick={saveCurrentPayroll}
//                 disabled={saving || employees.length === 0}
//               >
//                 <SaveIcon className="icon-small" />
//                 {saving ? 'Saving...' : 'Save Payroll'}
//               </button>
//             </div>
//           </div>

//           {employees.length === 0 ? (
//             <div className="empty-state">
//               <InboxIcon className="empty-icon" />
//               <h3>No employees found</h3>
//               <p>Add employees to manage payroll</p>
//             </div>
//           ) : (
//             <div className="payroll-list">
//               {employees.map((emp) => (
//                 <div key={emp.id} className="payroll-card">
//                   <div className="employee-header">
//                     <div className="employee-details">
//                       <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
//                       <div className="info">
//                         <h3>{emp.name}</h3>
//                         <p>{emp.position || 'No Position'}</p>
//                       </div>
//                     </div>
//                     <div className={`status-badge ${payrollData[emp.id]?.status}`}>
//                       {payrollData[emp.id]?.status === 'paid' ? (
//                         <>
//                           <CheckCircleIcon className="badge-icon" />
//                           Paid
//                         </>
//                       ) : (
//                         <>
//                           <ClockIcon className="badge-icon" />
//                           Pending
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   <div className="payroll-details">
//                     <div className="detail-row">
//                       <label>Basic Salary:</label>
//                       <input
//                         type="number"
//                         min="0"
//                         value={payrollData[emp.id]?.basicSalary}
//                         onChange={(e) => updatePayrollData(emp.id, 'basicSalary', e.target.value)}
//                         className="small-input"
//                       />
//                     </div>

//                     <div className="detail-row">
//                       <label>Working Days:</label>
//                       <input
//                         type="number"
//                         min="0"
//                         max="31"
//                         value={payrollData[emp.id]?.workingDays}
//                         onChange={(e) => updatePayrollData(emp.id, 'workingDays', e.target.value)}
//                         className="small-input"
//                       />
//                     </div>

//                     <div className="detail-row">
//                       <label>Allowances (Rs):</label>
//                       <input
//                         type="number"
//                         min="0"
//                         value={payrollData[emp.id]?.allowances}
//                         onChange={(e) => updatePayrollData(emp.id, 'allowances', e.target.value)}
//                         className="small-input"
//                       />
//                     </div>

//                     <div className="detail-row">
//                       <label>Deductions (Rs):</label>
//                       <input
//                         type="number"
//                         min="0"
//                         value={payrollData[emp.id]?.deductions}
//                         onChange={(e) => updatePayrollData(emp.id, 'deductions', e.target.value)}
//                         className="small-input"
//                       />
//                     </div>

//                     <div className="detail-row total">
//                       <label>Net Salary:</label>
//                       <span className="net-amount">Rs.{calculateNetSalary(emp.id).toLocaleString()}</span>
//                     </div>
//                   </div>

//                   <div className="card-footer">
//                     <button
//                       className="btn-pay"
//                       onClick={() => markAsPaid(emp.id)}
//                       disabled={payrollData[emp.id]?.status === 'paid'}
//                     >
//                       {payrollData[emp.id]?.status === 'paid' ? (
//                         <>
//                           <CheckCircleIcon className="icon-small" />
//                           Paid
//                         </>
//                       ) : (
//                         'Mark as Paid'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Payroll;
// After some of the changes
// File: client/src/pages/Payroll.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, logout, getCurrentUser, savePayroll, getPayroll } from '../services/api';
import './Payroll.css';

// SVG Icon Imports
import { ReactComponent as RupeeSign } from '../assets/icons/RupeeSign.svg';
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
            paidDate: existing.paid_date || null // FIXED: Load paid_date from database
          };
        } else {
          payrollMap[emp.id] = {
            basicSalary: emp.salary || 30000,
            allowances: 0,
            deductions: 0,
            workingDays: 22,
            status: 'pending',
            paidDate: null // FIXED: Initialize paid_date as null
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
          paidDate: null // FIXED: Initialize paid_date as null
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

  const updatePayrollData = (empId, field, value) => {
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
    setSaving(true);
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
          paid_date: data.paidDate // FIXED: Include paid_date in save
        };
      });
      await savePayroll(selectedMonth, records);
      alert(`Payroll saved successfully for ${selectedMonth}!`);
    } catch (err) {
      alert('Failed to save payroll: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const markAsPaid = async (empId) => {
    const currentDate = new Date().toISOString().split('T')[0]; // FIXED: Get current date in YYYY-MM-DD format
    
    try {
      // Update state with paid status and current date
      const updatedPayrollData = {
        ...payrollData,
        [empId]: {
          ...payrollData[empId],
          status: 'paid',
          paidDate: currentDate // FIXED: Set paid_date to current date
        }
      };
      setPayrollData(updatedPayrollData);

      // Save to database
      const records = employees.map(emp => {
        const data = emp.id === empId ? updatedPayrollData[empId] : payrollData[emp.id];
        return {
          employee_id: emp.id,
          basic_salary: data.basicSalary,
          allowances: data.allowances,
          deductions: data.deductions,
          net_salary: calculateNetSalary(emp.id),
          payment_status: data.status,
          paid_date: data.paidDate // FIXED: Include paid_date
        };
      });
      
      await savePayroll(selectedMonth, records);
      alert('Marked as paid!');
    } catch (err) {
      // Revert state if save fails
      setPayrollData({
        ...payrollData,
        [empId]: {
          ...payrollData[empId],
          status: 'pending',
          paidDate: null
        }
      });
      alert('Failed to mark as paid');
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
                      <div className="avatar">{emp.name.charAt(0).toUpperCase()}</div>
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