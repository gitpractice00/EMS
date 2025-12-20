
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const { testConnection } = require('./database');

// Import routes
const authRoutes = require('./auth');
const employeeRoutes = require('./routes/EmployeeRoutes');
const attendanceRoutes = require('./routes/Attendance_Routes');
const payrollRoutes = require('./routes/payrollRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);              // Authentication routes
app.use('/employees', employeeRoutes);     // Employee CRUD routes
app.use('/api/attendance', attendanceRoutes);  // Attendance routes
app.use('/api/payroll', payrollRoutes);        // Payroll routes

// Homepage
app.get('/', function(req, res) {
  res.json({ 
    message: 'Employee Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth (login, signup)',
      employees: '/employees (CRUD)',
      attendance: '/api/attendance',
      payroll: '/api/payroll'
    }
  });
});

// 404 handler
app.use(function(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` API Docs: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();