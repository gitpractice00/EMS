// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { getAllEmployees, logout, getCurrentUser, markAttendance, getAttendance } from '../services/api';
// // import './Attendance.css';

// // // SVG Imports
// // import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';
// // import { ReactComponent as UserIcon } from '../assets/icons/User.svg';
// // import { ReactComponent as LogoutIcon } from '../assets/icons/Logout.svg';
// // import { ReactComponent as CheckIcon } from '../assets/icons/Check.svg';
// // import { ReactComponent as CrossIcon } from '../assets/icons/Cross.svg';
// // import { ReactComponent as CalendarIcon } from '../assets/icons/Calendar.svg';
// // import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
// // import { ReactComponent as EmptyBoxIcon } from '../assets/icons/EmptyBox.svg';

// // function Attendance() {
// //   const [employees, setEmployees] = useState([]);
// //   const [attendance, setAttendance] = useState({});
// //   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
// //   const today = new Date().toISOString().split('T')[0];
// //   const [loading, setLoading] = useState(true);
// //   const [viewDetail, setViewDetail] = useState(null); // null, 'present', 'absent', 'leave', 'total'
// //   const navigate = useNavigate();
// //   const user = getCurrentUser();

// //   useEffect(() => {
// //     loadEmployees();
// //   }, []);

// //   useEffect(() => {
// //     if (employees.length > 0) {
// //       loadAttendanceForDate();
// //     }
// //   }, [selectedDate, employees]);

// //   const loadEmployees = async () => {
// //     try {
// //       const response = await getAllEmployees();
// //       setEmployees(response.data);
// //       setLoading(false);
// //     } catch (err) {
// //       console.error('Failed to load employees:', err);
// //       setLoading(false);
// //     }
// //   };

// //   const loadAttendanceForDate = async () => {
// //     try {
// //       const response = await getAttendance(selectedDate);
// //       const attendanceMap = {};
// //       employees.forEach(emp => {
// //         attendanceMap[emp.id] = 'present'; // Default
// //       });
// //       response.data.forEach(record => {
// //         attendanceMap[record.employee_id] = record.status;
// //       });
// //       setAttendance(attendanceMap);
// //     } catch (err) {
// //       const initialAttendance = {};
// //       employees.forEach(emp => {
// //         initialAttendance[emp.id] = 'present';
// //       });
// //       setAttendance(initialAttendance);
// //     }
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/');
// //   };

// //   const handleAttendanceChange = (employeeId, status) => {
// //     setAttendance({ ...attendance, [employeeId]: status });
// //   };

// //   const handleSubmit = async () => {
// //     if (selectedDate > today) {
// //       alert('Cannot mark attendance for future dates!');
// //       return; // Stop execution if future date
// //     }
// //     try {
// //       const records = Object.keys(attendance).map(empId => ({
// //         employee_id: parseInt(empId),
// //         date: selectedDate, // FIXED: Added date field
// //         status: attendance[empId]
// //       }));
// //       await markAttendance(selectedDate, records);
// //       alert(`Attendance marked for ${selectedDate}!`);
// //     } catch (err) {
// //       alert('Failed to mark attendance');
// //       console.error('Error:', err);
// //     }
// //   };

// //   const getStatusCount = () => {
// //     const present = Object.values(attendance).filter(s => s === 'present').length;
// //     const absent = Object.values(attendance).filter(s => s === 'absent').length;
// //     const leave = Object.values(attendance).filter(s => s === 'leave').length;
// //     return { present, absent, leave };
// //   };

// //   const statusCount = getStatusCount();

// //   const getFilteredEmployees = () => {
// //     if (viewDetail === 'total') return employees.map(emp => ({ ...emp, status: attendance[emp.id] }));
// //     return employees.filter(emp => attendance[emp.id] === viewDetail).map(emp => ({ ...emp, status: attendance[emp.id] }));
// //   };

// //   if (loading) {
// //     return (
// //       <div className="loading-screen">
// //         <div className="spinner"></div>
// //         <p>Loading...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="attendance-page">
// //       {/* Top Header */}
// //       <header className="top-header">
// //         <div className="logo">
// //           <h1>EMS</h1>
// //           <span>Attendance Management</span>
// //         </div>
// //         <div className="user-section">
// //           <button className="btn-back" onClick={() => navigate('/dashboard')}>
// //             <ArrowLeftIcon className="icon-small" />
// //             {/* Back to Dashboard */}
// //             Dashboard
// //           </button>
// //           <div className="user-info">
// //             <UsersIcon className="user-icon" />
// //             <div className="user-details">
// //               <p className="user-name">{user?.username}</p>
// //               <p className="user-role">Admin</p>
// //             </div>
// //           </div>
// //           <button className="btn-logout" onClick={handleLogout}>
// //             <LogoutIcon className="icon-small" />
// //             Logout
// //           </button>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="main-content">
// //         {!viewDetail ? (
// //           <>
// //             {/* Stats Section */}
// //             <section className="stats-section">
// //               <div className="stat-box clickable green" onClick={() => setViewDetail('present')}>
// //                 <CheckIcon className="icon-status" />
// //                 <div className="stat-info">
// //                   <h3>{statusCount.present}</h3>
// //                   <p>Present</p>
// //                 </div>
// //               </div>
// //               <div className="stat-box clickable red" onClick={() => setViewDetail('absent')}>
// //                 <CrossIcon className="icon-status" />
// //                 <div className="stat-info">
// //                   <h3>{statusCount.absent}</h3>
// //                   <p>Absent</p>
// //                 </div>
// //               </div>
// //               <div className="stat-box clickable orange" onClick={() => setViewDetail('leave')}>
// //                 <CalendarIcon className="icon-status" />
// //                 <div className="stat-info">
// //                   <h3>{statusCount.leave}</h3>
// //                   <p>On Leave</p>
// //                 </div>
// //               </div>
// //               <div className="stat-box clickable blue" onClick={() => setViewDetail('total')}>
// //                 <UserIcon className="icon-status" />
// //                 <div className="stat-info">
// //                   <h3>{employees.length}</h3>
// //                   <p>Total</p>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* Attendance Section */}
// //             <section className="attendance-section">
// //               <div className="section-header">
// //                 <h2>Mark Attendance</h2>
// //                 <div className="header-actions">
// //                   <input
// //                     type="date"
// //                     value={selectedDate}
// //                     max={today}
// //                     onChange={(e) => setSelectedDate(e.target.value)}
// //                     className="date-input"
// //                   />
// //                   <button className="btn-submit" onClick={handleSubmit}>
// //                     Submit Attendance
// //                   </button>
// //                 </div>
// //               </div>

// //               {employees.length === 0 ? (
// //                 <div className="empty-state">
// //                   <EmptyBoxIcon className="empty-icon" />
// //                   <h3>No employees found</h3>
// //                   <p>Add employees first to mark attendance</p>
// //                 </div>
// //               ) : (
// //                 <div className="attendance-list">
// //                   {employees.map(emp => (
// //                     <div key={emp.id} className="attendance-card">
// //                       <div className="employee-details">
// //                         <div className="avatar">#{emp.id}</div>
// //                         <div className="info">
// //                           <h3>{emp.name}</h3>
// //                           <p>{emp.position || 'No Position'}</p>
// //                         </div>
// //                       </div>
// //                       <div className="status-buttons">
// //                         <button
// //                           className={`status-btn present ${attendance[emp.id] === 'present' ? 'active' : ''}`}
// //                           onClick={() => handleAttendanceChange(emp.id, 'present')}
// //                         >
// //                           <CheckIcon className="icon-small" />
// //                           Present
// //                         </button>
// //                         <button
// //                           className={`status-btn absent ${attendance[emp.id] === 'absent' ? 'active' : ''}`}
// //                           onClick={() => handleAttendanceChange(emp.id, 'absent')}
// //                         >
// //                           <CrossIcon className="icon-small" />
// //                           Absent
// //                         </button>
// //                         <button
// //                           className={`status-btn leave ${attendance[emp.id] === 'leave' ? 'active' : ''}`}
// //                           onClick={() => handleAttendanceChange(emp.id, 'leave')}
// //                         >
// //                           <CalendarIcon className="icon-small" />
// //                           Leave
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </section>
// //           </>
// //         ) : (
// //           // Employee Detail View
// //           <section className="attendance-section">
// //             <div className="details-header attendance-view">
// //               <h2 className="details-title">
// //                 {viewDetail === 'present' && 'Present Employees List'}
// //                 {viewDetail === 'absent' && 'Absent Employees List'}
// //                 {viewDetail === 'leave' && 'Leave Employees List'}
// //                 {viewDetail === 'total' && 'All Employees List'}
// //               </h2>
// //               <button className="btn-back-small" onClick={() => setViewDetail(null)}>
// //                  <ArrowLeftIcon className="icon-small" />
// //                 Back
// //               </button>
// //             </div>

// //             {getFilteredEmployees().length === 0 ? (
// //               <div className="empty-state">
// //                 <EmptyBoxIcon className="empty-icon" />
// //                 <h3>No employees found</h3>
// //               </div>
// //             ) : (
// //               <div className="attendance-list">
// //                 {getFilteredEmployees().map(emp => (
// //                   <div key={emp.id} className="attendance-card">
// //                     <div className="employee-details">
// //                       <div className="avatar">#{emp.id}</div>
// //                       <div className="info">
// //                         <h3>{emp.name}</h3>
// //                         <p>{emp.position || 'No Position'}</p>
// //                       </div>
// //                     </div>
// //                     <div className={`status-label ${emp.status}`}>
// //                       {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </section>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // export default Attendance;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllEmployees, logout, getCurrentUser, markAttendance, getAttendance } from '../services/api';
// import './Attendance.css';

// // SVG Imports
// import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';
// import { ReactComponent as UserIcon } from '../assets/icons/User.svg';
// import { ReactComponent as LogoutIcon } from '../assets/icons/Logout.svg';
// import { ReactComponent as CheckIcon } from '../assets/icons/Check.svg';
// import { ReactComponent as CrossIcon } from '../assets/icons/Cross.svg';
// import { ReactComponent as CalendarIcon } from '../assets/icons/Calendar.svg';
// import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
// import { ReactComponent as EmptyBoxIcon } from '../assets/icons/EmptyBox.svg';
// import { ReactComponent as ClockIcon } from '../assets/icons/Clock.svg';

// function Attendance() {
//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const today = new Date().toISOString().split('T')[0];
//   const [loading, setLoading] = useState(true);
//   const [viewDetail, setViewDetail] = useState(null); // null, 'present', 'absent', 'leave', 'total', 'history'
//   const [historyData, setHistoryData] = useState([]);
//   const navigate = useNavigate();
//   const user = getCurrentUser();

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   useEffect(() => {
//     if (employees.length > 0) {
//       loadAttendanceForDate();
//     }
//   }, [selectedDate, employees]);

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

//   const loadAttendanceForDate = async () => {
//     try {
//       const response = await getAttendance(selectedDate);
//       const attendanceMap = {};
      
//       if (response.data && response.data.length > 0) {
//         // If attendance exists for this date
//         employees.forEach(emp => {
//           const record = response.data.find(r => r.employee_id === emp.id);
//           attendanceMap[emp.id] = record ? record.status : 'present';
//         });
//       } else {
//         // No attendance for this date, default to present
//         employees.forEach(emp => {
//           attendanceMap[emp.id] = 'present';
//         });
//       }
//       setAttendance(attendanceMap);
//     } catch (err) {
//       console.error('Error loading attendance:', err);
//       const initialAttendance = {};
//       employees.forEach(emp => {
//         initialAttendance[emp.id] = 'present';
//       });
//       setAttendance(initialAttendance);
//     }
//   };

//   const loadAttendanceHistory = async () => {
//     try {
//       // Get attendance for last 30 days
//       const history = [];
//       const currentDate = new Date();
      
//       for (let i = 0; i < 30; i++) {
//         const date = new Date(currentDate);
//         date.setDate(date.getDate() - i);
//         const dateStr = date.toISOString().split('T')[0];
        
//         try {
//           const response = await getAttendance(dateStr);
//           if (response.data && response.data.length > 0) {
//             const dayData = {
//               date: dateStr,
//               present: response.data.filter(r => r.status === 'present').length,
//               absent: response.data.filter(r => r.status === 'absent').length,
//               leave: response.data.filter(r => r.status === 'leave').length,
//               total: employees.length
//             };
//             history.push(dayData);
//           }
//         } catch (err) {
//           // Skip dates with no attendance
//           continue;
//         }
//       }
      
//       setHistoryData(history);
//       setViewDetail('history');
//     } catch (err) {
//       console.error('Failed to load history:', err);
//       alert('Failed to load attendance history');
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const handleAttendanceChange = (employeeId, status) => {
//     setAttendance({ ...attendance, [employeeId]: status });
//   };

//   const handleSubmit = async () => {
//     if (selectedDate > today) {
//       alert('Cannot mark attendance for future dates!');
//       return;
//     }
    
//     try {
//       const records = employees.map(emp => ({
//         employee_id: parseInt(emp.id),
//         date: selectedDate,
//         status: attendance[emp.id] || 'present'
//       }));
      
//       console.log('Submitting attendance:', { date: selectedDate, records });
      
//       await markAttendance(selectedDate, records);
//       alert(`Attendance marked successfully for ${selectedDate}!`);
//     } catch (err) {
//       console.error('Submit error:', err);
//       const errorMsg = err.response?.data?.error || err.message || 'Failed to mark attendance';
//       alert('Error: ' + errorMsg);
//     }
//   };

//   const getStatusCount = () => {
//     const present = Object.values(attendance).filter(s => s === 'present').length;
//     const absent = Object.values(attendance).filter(s => s === 'absent').length;
//     const leave = Object.values(attendance).filter(s => s === 'leave').length;
//     return { present, absent, leave };
//   };

//   const statusCount = getStatusCount();

//   const getFilteredEmployees = () => {
//     if (viewDetail === 'total') return employees.map(emp => ({ ...emp, status: attendance[emp.id] }));
//     return employees.filter(emp => attendance[emp.id] === viewDetail).map(emp => ({ ...emp, status: attendance[emp.id] }));
//   };

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner"></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="attendance-page">
//       {/* Top Header */}
//       <header className="top-header">
//         <div className="logo">
//           <h1>EMS</h1>
//           <span>Attendance Management</span>
//         </div>
//         <div className="user-section">
//           <button className="btn-back" onClick={() => navigate('/dashboard')}>
//             <ArrowLeftIcon className="icon-small" />
//             Dashboard
//           </button>
//           <div className="user-info">
//             <UsersIcon className="user-icon" />
//             <div className="user-details">
//               <p className="user-name">{user?.username}</p>
//               <p className="user-role">Admin</p>
//             </div>
//           </div>
//           <button className="btn-logout" onClick={handleLogout}>
//             <LogoutIcon className="icon-small" />
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="main-content">
//         {!viewDetail ? (
//           <>
//             {/* Stats Section */}
//             <section className="stats-section">
//               <div className="stat-box clickable green" onClick={() => setViewDetail('present')}>
//                 <CheckIcon className="icon-status" />
//                 <div className="stat-info">
//                   <h3>{statusCount.present}</h3>
//                   <p>Present</p>
//                 </div>
//               </div>
//               <div className="stat-box clickable red" onClick={() => setViewDetail('absent')}>
//                 <CrossIcon className="icon-status" />
//                 <div className="stat-info">
//                   <h3>{statusCount.absent}</h3>
//                   <p>Absent</p>
//                 </div>
//               </div>
//               <div className="stat-box clickable orange" onClick={() => setViewDetail('leave')}>
//                 <CalendarIcon className="icon-status" />
//                 <div className="stat-info">
//                   <h3>{statusCount.leave}</h3>
//                   <p>On Leave</p>
//                 </div>
//               </div>
//               <div className="stat-box clickable blue" onClick={() => setViewDetail('total')}>
//                 <UserIcon className="icon-status" />
//                 <div className="stat-info">
//                   <h3>{employees.length}</h3>
//                   <p>Total</p>
//                 </div>
//               </div>
//             </section>

//             {/* Attendance Section */}
//             <section className="attendance-section">
//               <div className="section-header">
//                 <h2>Mark Attendance</h2>
//                 <div className="header-actions">
//                   <button className="btn-history" onClick={loadAttendanceHistory}>
//                     <ClockIcon className="icon-small" />
//                     History
//                   </button>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     max={today}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="date-input"
//                   />
//                   <button className="btn-submit" onClick={handleSubmit}>
//                     Submit Attendance
//                   </button>
//                 </div>
//               </div>

//               {employees.length === 0 ? (
//                 <div className="empty-state">
//                   <EmptyBoxIcon className="empty-icon" />
//                   <h3>No employees found</h3>
//                   <p>Add employees first to mark attendance</p>
//                 </div>
//               ) : (
//                 <div className="attendance-list">
//                   {employees.map(emp => (
//                     <div key={emp.id} className="attendance-card">
//                       <div className="employee-details">
//                         <div className="avatar">#{emp.id}</div>
//                         <div className="info">
//                           <h3>{emp.name}</h3>
//                           <p>{emp.position || 'No Position'}</p>
//                         </div>
//                       </div>
//                       <div className="status-buttons">
//                         <button
//                           className={`status-btn present ${attendance[emp.id] === 'present' ? 'active' : ''}`}
//                           onClick={() => handleAttendanceChange(emp.id, 'present')}
//                         >
//                           <CheckIcon className="icon-small" />
//                           Present
//                         </button>
//                         <button
//                           className={`status-btn absent ${attendance[emp.id] === 'absent' ? 'active' : ''}`}
//                           onClick={() => handleAttendanceChange(emp.id, 'absent')}
//                         >
//                           <CrossIcon className="icon-small" />
//                           Absent
//                         </button>
//                         <button
//                           className={`status-btn leave ${attendance[emp.id] === 'leave' ? 'active' : ''}`}
//                           onClick={() => handleAttendanceChange(emp.id, 'leave')}
//                         >
//                           <CalendarIcon className="icon-small" />
//                           Leave
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           </>
//         ) : viewDetail === 'history' ? (
//           // History View
//           <section className="attendance-section">
//             <div className="details-header attendance-view">
//               <h2 className="details-title">Attendance History (Last 30 Days)</h2>
//               <button className="btn-back-small" onClick={() => setViewDetail(null)}>
//                 <ArrowLeftIcon className="icon-small" />
//                 Back
//               </button>
//             </div>

//             {historyData.length === 0 ? (
//               <div className="empty-state">
//                 <EmptyBoxIcon className="empty-icon" />
//                 <h3>No attendance history found</h3>
//               </div>
//             ) : (
//               <div className="attendance-list">
//                 {historyData.map((day, index) => (
//                   <div key={index} className="attendance-card">
//                     <div className="employee-details">
//                       <div className="avatar">
//                         <CalendarIcon style={{ width: '24px', height: '24px' }} />
//                       </div>
//                       <div className="info">
//                         <h3>{formatDate(day.date)}</h3>
//                         <p>Total: {day.total} employees</p>
//                       </div>
//                     </div>
//                     <div className="status-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                         <CheckIcon style={{ width: '16px', height: '16px', color: '#10b981' }} />
//                         <span style={{ fontWeight: '600' }}>{day.present}</span>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                         <CrossIcon style={{ width: '16px', height: '16px', color: '#ef4444' }} />
//                         <span style={{ fontWeight: '600' }}>{day.absent}</span>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                         <CalendarIcon style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
//                         <span style={{ fontWeight: '600' }}>{day.leave}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         ) : (
//           // Employee Detail View
//           <section className="attendance-section">
//             <div className="details-header attendance-view">
//               <h2 className="details-title">
//                 {viewDetail === 'present' && 'Present Employees List'}
//                 {viewDetail === 'absent' && 'Absent Employees List'}
//                 {viewDetail === 'leave' && 'Leave Employees List'}
//                 {viewDetail === 'total' && 'All Employees List'}
//               </h2>
//               <button className="btn-back-small" onClick={() => setViewDetail(null)}>
//                 <ArrowLeftIcon className="icon-small" />
//                 Back
//               </button>
//             </div>

//             {getFilteredEmployees().length === 0 ? (
//               <div className="empty-state">
//                 <EmptyBoxIcon className="empty-icon" />
//                 <h3>No employees found</h3>
//               </div>
//             ) : (
//               <div className="attendance-list">
//                 {getFilteredEmployees().map(emp => (
//                   <div key={emp.id} className="attendance-card">
//                     <div className="employee-details">
//                       <div className="avatar">#{emp.id}</div>
//                       <div className="info">
//                         <h3>{emp.name}</h3>
//                         <p>{emp.position || 'No Position'}</p>
//                       </div>
//                     </div>
//                     <div className={`status-label ${emp.status}`}>
//                       {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Attendance;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, logout, getCurrentUser, markAttendance, getAttendance } from '../services/api';
import './Attendance.css';

// SVG Imports
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';
import { ReactComponent as UserIcon } from '../assets/icons/User.svg';
import { ReactComponent as LogoutIcon } from '../assets/icons/Logout.svg';
import { ReactComponent as CheckIcon } from '../assets/icons/Check.svg';
import { ReactComponent as CrossIcon } from '../assets/icons/Cross.svg';
import { ReactComponent as CalendarIcon } from '../assets/icons/Calendar.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/Users.svg';
import { ReactComponent as EmptyBoxIcon } from '../assets/icons/EmptyBox.svg';
import { ReactComponent as ClockIcon } from '../assets/icons/Clock.svg';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(true);
  const [viewDetail, setViewDetail] = useState(null); // null, 'present', 'absent', 'leave', 'total', 'history', 'history-detail'
  const [historyData, setHistoryData] = useState([]);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [historyAttendance, setHistoryAttendance] = useState({});
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
      
      if (response.data && response.data.length > 0) {
        employees.forEach(emp => {
          const record = response.data.find(r => r.employee_id === emp.id);
          attendanceMap[emp.id] = record ? record.status : 'present';
        });
      } else {
        employees.forEach(emp => {
          attendanceMap[emp.id] = 'present';
        });
      }
      setAttendance(attendanceMap);
    } catch (err) {
      console.error('Error loading attendance:', err);
      const initialAttendance = {};
      employees.forEach(emp => {
        initialAttendance[emp.id] = 'present';
      });
      setAttendance(initialAttendance);
    }
  };

  const loadAttendanceHistory = async () => {
    try {
      const history = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const response = await getAttendance(dateStr);
          if (response.data && response.data.length > 0) {
            const dayData = {
              date: dateStr,
              present: response.data.filter(r => r.status === 'present').length,
              absent: response.data.filter(r => r.status === 'absent').length,
              leave: response.data.filter(r => r.status === 'leave').length,
              total: employees.length,
              records: response.data
            };
            history.push(dayData);
          }
        } catch (err) {
          continue;
        }
      }
      
      setHistoryData(history);
      setViewDetail('history');
    } catch (err) {
      console.error('Failed to load history:', err);
      alert('Failed to load attendance history');
    }
  };

  const loadHistoryDetail = async (date) => {
    try {
      const response = await getAttendance(date);
      const attendanceMap = {};
      
      if (response.data && response.data.length > 0) {
        employees.forEach(emp => {
          const record = response.data.find(r => r.employee_id === emp.id);
          attendanceMap[emp.id] = record ? record.status : 'present';
        });
      } else {
        employees.forEach(emp => {
          attendanceMap[emp.id] = 'present';
        });
      }
      
      setHistoryAttendance(attendanceMap);
      setSelectedHistoryDate(date);
      setViewDetail('history-detail');
    } catch (err) {
      console.error('Failed to load history detail:', err);
      alert('Failed to load attendance details for this date');
    }
  };

   const handleLogout = () => {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        logout();
        navigate('/');
      }
      //else remain on the same page
    };

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance({ ...attendance, [employeeId]: status });
  };

  const handleSubmit = async () => {
    if (selectedDate > today) {
      alert('Cannot mark attendance for future dates!');
      return;
    }
    
    try {
      const records = employees.map(emp => ({
        employee_id: parseInt(emp.id),
        date: selectedDate,
        status: attendance[emp.id] || 'present'
      }));
      
      console.log('Submitting attendance:', { date: selectedDate, records });
      
      await markAttendance(selectedDate, records);
      alert(`Attendance marked successfully for ${selectedDate}!`);
    } catch (err) {
      console.error('Submit error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to mark attendance';
      alert('Error: ' + errorMsg);
    }
  };

  const getStatusCount = () => {
    const present = Object.values(attendance).filter(s => s === 'present').length;
    const absent = Object.values(attendance).filter(s => s === 'absent').length;
    const leave = Object.values(attendance).filter(s => s === 'leave').length;
    return { present, absent, leave };
  };

  const getHistoryStatusCount = () => {
    const present = Object.values(historyAttendance).filter(s => s === 'present').length;
    const absent = Object.values(historyAttendance).filter(s => s === 'absent').length;
    const leave = Object.values(historyAttendance).filter(s => s === 'leave').length;
    return { present, absent, leave };
  };

  const statusCount = getStatusCount();
  const historyStatusCount = getHistoryStatusCount();

  const getFilteredEmployees = () => {
    if (viewDetail === 'total') return employees.map(emp => ({ ...emp, status: attendance[emp.id] }));
    return employees.filter(emp => attendance[emp.id] === viewDetail).map(emp => ({ ...emp, status: attendance[emp.id] }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateLong = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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
                  <button className="btn-history" onClick={loadAttendanceHistory}>
                    <ClockIcon className="icon-small" />
                    History
                  </button>
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
                        <div className="avatar">#{emp.id}</div>
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
        ) : viewDetail === 'history' ? (
          // History List View
          <section className="attendance-section">
            <div className="section-header">
              <h2>Attendance History (Last 30 Days)</h2>
              <button className="btn-back-small" onClick={() => setViewDetail(null)}>
                <ArrowLeftIcon className="icon-small" />
                Back
              </button>
            </div>

            {historyData.length === 0 ? (
              <div className="empty-state">
                <EmptyBoxIcon className="empty-icon" />
                <h3>No attendance history found</h3>
              </div>
            ) : (
              <div className="attendance-list">
                {historyData.map((day, index) => (
                  <div key={index} className="attendance-card">
                    <div className="employee-details">
                      <div className="avatar">
                        <CalendarIcon style={{ width: '24px', height: '24px' }} />
                      </div>
                      <div className="info">
                        <h3>{formatDate(day.date)}</h3>
                        <p>Total: {day.total} employees</p>
                      </div>
                    </div>
                    <div className="status-buttons" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckIcon style={{ width: '18px', height: '18px', color: '#10b981' }} />
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{day.present}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CrossIcon style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{day.absent}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CalendarIcon style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{day.leave}</span>
                      </div>
                      <button
                        className="btn-view-detail"
                        onClick={() => loadHistoryDetail(day.date)}
                        style={{
                          padding: '8px 16px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          marginLeft: 'auto'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : viewDetail === 'history-detail' ? (
          // History Detail View - Shows all employees for selected date
          <>
            <section className="stats-section">
              <div className="stat-box green">
                <CheckIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{historyStatusCount.present}</h3>
                  <p>Present</p>
                </div>
              </div>
              <div className="stat-box red">
                <CrossIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{historyStatusCount.absent}</h3>
                  <p>Absent</p>
                </div>
              </div>
              <div className="stat-box orange">
                <CalendarIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{historyStatusCount.leave}</h3>
                  <p>On Leave</p>
                </div>
              </div>
              <div className="stat-box blue">
                <UserIcon className="icon-status" />
                <div className="stat-info">
                  <h3>{employees.length}</h3>
                  <p>Total</p>
                </div>
              </div>
            </section>

            <section className="attendance-section">
              <div className="section-header">
                <h2>{formatDateLong(selectedHistoryDate)}</h2>
                <button className="btn-back-small" onClick={() => setViewDetail('history')}>
                  <ArrowLeftIcon className="icon-small" />
                  Back to History
                </button>
              </div>

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
                    <div className={`status-label ${historyAttendance[emp.id]}`}>
                      {historyAttendance[emp.id] === 'present' && <CheckIcon style={{ width: '16px', height: '16px', marginRight: '5px' }} />}
                      {historyAttendance[emp.id] === 'absent' && <CrossIcon style={{ width: '16px', height: '16px', marginRight: '5px' }} />}
                      {historyAttendance[emp.id] === 'leave' && <CalendarIcon style={{ width: '16px', height: '16px', marginRight: '5px' }} />}
                      {historyAttendance[emp.id].charAt(0).toUpperCase() + historyAttendance[emp.id].slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          // Employee Detail View (Present/Absent/Leave/Total filters)
          <section className="attendance-section">
            <div className="details-header attendance-view">
              <h2 className="details-title">
                {viewDetail === 'present' && 'Present Employees List'}
                {viewDetail === 'absent' && 'Absent Employees List'}
                {viewDetail === 'leave' && 'Leave Employees List'}
                {viewDetail === 'total' && 'All Employees List'}
              </h2>
              <button className="btn-back-small" onClick={() => setViewDetail(null)}>
                <ArrowLeftIcon className="icon-small" />
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
        )}
      </main>
    </div>
  );
}

export default Attendance;