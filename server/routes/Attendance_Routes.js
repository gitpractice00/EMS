// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllEmployees, logout, getCurrentUser, markAttendance, getAttendance } from '../services/api';
// import './Attendance.css';

// // Component Imports
// import AttendanceHeader from '../components/attendance/AttendanceHeader';
// import AttendanceStats from '../components/attendance/AttendanceStats';
// import AttendanceForm from '../components/attendance/AttendanceForm';
// import PresentList from '../components/attendance/PresentList';
// import AbsentList from '../components/attendance/AbsentList';
// import LeaveList from '../components/attendance/LeaveList';
// import TotalEmployeesList from '../components/attendance/TotalEmployeesList';

// function Attendance() {
//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const today = new Date().toISOString().split('T')[0];
//   const [loading, setLoading] = useState(true);
//   const [viewDetail, setViewDetail] = useState(null); // null, 'present', 'absent', 'leave', 'total'
//   const navigate = useNavigate();
//   const user = getCurrentUser();

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   useEffect(() => {
//     if (employees.length > 0) {
//       loadAttendanceForDate();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
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
//       employees.forEach(emp => {
//         attendanceMap[emp.id] = 'present'; // Default
//       });
//       response.data.forEach(record => {
//         attendanceMap[record.employee_id] = record.status;
//       });
//       setAttendance(attendanceMap);
//     } catch (err) {
//       const initialAttendance = {};
//       employees.forEach(emp => {
//         initialAttendance[emp.id] = 'present';
//       });
//       setAttendance(initialAttendance);
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
//       const records = Object.keys(attendance).map(empId => ({
//         employee_id: parseInt(empId),
//         date: selectedDate,
//         status: attendance[empId]
//       }));
//       await markAttendance(selectedDate, records);
//       alert(`Attendance marked for ${selectedDate}!`);
//     } catch (err) {
//       alert('Failed to mark attendance');
//       console.error('Error:', err);
//     }
//   };

//   const getStatusCount = () => {
//     const present = Object.values(attendance).filter(s => s === 'present').length;
//     const absent = Object.values(attendance).filter(s => s === 'absent').length;
//     const leave = Object.values(attendance).filter(s => s === 'leave').length;
//     return { present, absent, leave };
//   };

//   const statusCount = getStatusCount();

//   const getFilteredEmployees = (status) => {
//     if (status === 'total') {
//       return employees.map(emp => ({ ...emp, status: attendance[emp.id] }));
//     }
//     return employees
//       .filter(emp => attendance[emp.id] === status)
//       .map(emp => ({ ...emp, status: attendance[emp.id] }));
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
//       <AttendanceHeader 
//         user={user}
//         onLogout={handleLogout}
//         onNavigateBack={() => navigate('/dashboard')}
//       />

//       {/* Main Content */}
//       <main className="main-content">
//         {!viewDetail ? (
//           <>
//             {/* Stats Section */}
//             <AttendanceStats 
//               statusCount={statusCount}
//               totalEmployees={employees.length}
//               onViewDetail={setViewDetail}
//             />

//             {/* Attendance Form Section */}
//             <AttendanceForm
//               employees={employees}
//               attendance={attendance}
//               selectedDate={selectedDate}
//               today={today}
//               onDateChange={setSelectedDate}
//               onAttendanceChange={handleAttendanceChange}
//               onSubmit={handleSubmit}
//             />
//           </>
//         ) : (
//           <>
//             {/* Conditional List Views */}
//             {viewDetail === 'present' && (
//               <PresentList 
//                 employees={getFilteredEmployees('present')}
//                 onBack={() => setViewDetail(null)}
//               />
//             )}
            
//             {viewDetail === 'absent' && (
//               <AbsentList 
//                 employees={getFilteredEmployees('absent')}
//                 onBack={() => setViewDetail(null)}
//               />
//             )}
            
//             {viewDetail === 'leave' && (
//               <LeaveList 
//                 employees={getFilteredEmployees('leave')}
//                 onBack={() => setViewDetail(null)}
//               />
//             )}
            
//             {viewDetail === 'total' && (
//               <TotalEmployeesList 
//                 employees={getFilteredEmployees('total')}
//                 onBack={() => setViewDetail(null)}
//               />
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Attendance;

const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../authMiddleware');

// Test database connection
router.get('/test', function(req, res) {
  db.query('SELECT 1 + 1 AS result', function(err, results) {
    if (err) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: err.message
      });
    }
    res.json({
      success: true,
      message: 'Database connected',
      result: results
    });
  });
});

// Get attendance for a specific date
router.get('/:date', verifyToken, function(req, res) {
  const date = req.params.date;
  console.log('[GET] Fetching attendance for date:', date);
  
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD'
    });
  }
  
  const sql = `
    SELECT a.*, e.name as employee_name 
    FROM attendance a
    LEFT JOIN employees e ON a.employee_id = e.id
    WHERE a.attendance_date = ?
  `;
  
  db.query(sql, [date], function(err, results) {
    if (err) {
      console.error('[ERROR] Database error:', err);
      return res.status(500).json({
        error: 'Failed to get attendance',
        details: err.message
      });
    }
    
    console.log('[SUCCESS] Found', results.length, 'attendance records');
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

// Mark attendance (create or update)
router.post('/', verifyToken, function(req, res) {
  const { date, records } = req.body;
  
  console.log('[POST] Request body:', JSON.stringify(req.body, null, 2));
  console.log('[POST] Marking attendance for date:', date);
  console.log('[INFO] Records count:', records?.length);
  
  // Validation
  if (!date) {
    return res.status(400).json({
      error: 'Date is required'
    });
  }
  
  if (!records || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      error: 'Records array is required and must not be empty'
    });
  }
  
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD'
    });
  }
  
  // Validate each record
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record.employee_id || !record.status) {
      return res.status(400).json({
        error: `Invalid record at index ${i}. employee_id and status are required`
      });
    }
    
    if (!['present', 'absent', 'leave'].includes(record.status)) {
      return res.status(400).json({
        error: `Invalid status at index ${i}. Must be 'present', 'absent', or 'leave'`
      });
    }
  }
  
  // Delete existing attendance for this date
  const deleteSql = 'DELETE FROM attendance WHERE attendance_date = ?';
  
  console.log('[INFO] Deleting old attendance records for date:', date);
  
  db.query(deleteSql, [date], function(deleteErr, deleteResult) {
    if (deleteErr) {
      console.error('[ERROR] Delete error:', deleteErr);
      return res.status(500).json({
        error: 'Failed to delete old records',
        details: deleteErr.message
      });
    }
    
    console.log('[INFO] Deleted', deleteResult.affectedRows, 'old records');
    
    // IMPROVED: Insert new attendance records - accepts date from both parameter and individual records
    const insertSql = 'INSERT INTO attendance (employee_id, attendance_date, status) VALUES ?';
    
    const values = records.map(r => {
      // Use date from individual record if available, otherwise use the main date parameter
      const recordDate = r.date || date;
      console.log(`[DEBUG] Employee ${r.employee_id}: date=${recordDate}, status=${r.status}`);
      return [r.employee_id, recordDate, r.status];
    });
    
    console.log('[INFO] Inserting', values.length, 'attendance records');
    console.log('[DEBUG] Sample values:', JSON.stringify(values[0], null, 2));
    
    db.query(insertSql, [values], function(insertErr, insertResult) {
      if (insertErr) {
        console.error('[ERROR] Insert error:', insertErr);
        return res.status(500).json({
          error: 'Failed to mark attendance',
          details: insertErr.message,
          sqlState: insertErr.sqlState,
          code: insertErr.code
        });
      }
      
      console.log('[SUCCESS] Attendance marked successfully');
      console.log('[INFO] Insert result:', insertResult);
      
      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        recordsDeleted: deleteResult.affectedRows,
        recordsInserted: insertResult.affectedRows
      });
    });
  });
});

// Get attendance summary by date range
router.get('/summary/:startDate/:endDate', verifyToken, function(req, res) {
  const { startDate, endDate } = req.params;
  
  console.log('[GET] Fetching attendance summary from', startDate, 'to', endDate);
  
  // Validate date formats
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return res.status(400).json({
      error: 'Invalid date format. Use YYYY-MM-DD'
    });
  }
  
  const sql = `
    SELECT 
      e.id, 
      e.name, 
      e.position,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
      COUNT(CASE WHEN a.status = 'leave' THEN 1 END) as leave_days,
      COUNT(a.id) as total_days
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id 
      AND a.attendance_date BETWEEN ? AND ?
    GROUP BY e.id, e.name, e.position
    ORDER BY e.name
  `;
  
  db.query(sql, [startDate, endDate], function(err, results) {
    if (err) {
      console.error('[ERROR] Database error:', err);
      return res.status(500).json({
        error: 'Failed to get summary',
        details: err.message
      });
    }
    
    console.log('[SUCCESS] Summary generated for', results.length, 'employees');
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

module.exports = router;