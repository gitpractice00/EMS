const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../authMiddleware');
const bcrypt = require('bcryptjs');

// Get all employees (PROTECTED) - Only active employees
router.get('/', verifyToken, function(req, res) {
  console.log('[GET] Fetching all employees');
  
  const sql = 'SELECT * FROM employees';
  
  db.query(sql, function(err, results) {
    if (err) {
      console.error('[ERROR] Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to get employees',
        details: err.message 
      });
    }
    
    console.log('[SUCCESS] Found', results.length, 'employees');
    res.json({
      success: true,
      count: results.length,
      data: results,
      requestedBy: req.user.email
    });
  });
});

// FIXED: NEW ROUTE - Get deleted/archived employees from separate table
router.get('/archived', verifyToken, function(req, res) {
  console.log('[GET] Fetching archived employees');
  
  const sql = 'SELECT * FROM employees_archive ORDER BY deleted_at DESC';
  
  db.query(sql, function(err, results) {
    if (err) {
      console.error('[ERROR] Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to get archived employees',
        details: err.message 
      });
    }
    
    console.log('[SUCCESS] Found', results.length, 'archived employees');
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

// Get one employee by ID (PROTECTED)
router.get('/:id', verifyToken, function(req, res) {
  const id = req.params.id;
  console.log('[GET] Fetching employee ID:', id);
  
  const sql = 'SELECT * FROM employees WHERE id = ?';
  
  db.query(sql, [id], function(err, results) {
    if (err) {
      console.error('[ERROR] Database error:', err);
      return res.status(500).json({ 
        error: 'Database error',
        details: err.message 
      });
    }
    
    if (results.length === 0) {
      console.log('[ERROR] Employee not found');
      return res.status(404).json({ 
        error: 'Employee not found' 
      });
    }
    
    console.log('[SUCCESS] Employee found');
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// CREATE - Add new employee (PROTECTED)
router.post('/', verifyToken, function(req, res) {
  console.log('[POST] Adding new employee:', req.body);
  
  const { name, email, phone, position, salary, hire_date } = req.body;
  
  if (!name || !email) {
    console.log('[ERROR] Missing required fields');
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  const sql = 'INSERT INTO employees (name, email, phone, position, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, email, phone, position, salary, hire_date];
  
  db.query(sql, values, function(err, result) {
    if (err) {
      console.error('[ERROR] Insert error:', err);
      return res.status(500).json({ 
        error: 'Failed to add employee',
        details: err.message 
      });
    }
    
    console.log('[SUCCESS] Employee added, ID:', result.insertId);
    res.status(201).json({
      success: true,
      message: 'Employee added successfully!',
      employeeId: result.insertId
    });
  });
});

// UPDATE - Edit existing employee (PROTECTED)
router.put('/:id', verifyToken, function(req, res) {
  const id = req.params.id;
  console.log('[PUT] Updating employee ID:', id);
  
  const { name, email, phone, position, salary, hire_date } = req.body;
  
  const sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, salary = ?, hire_date = ? WHERE id = ?';
  const values = [name, email, phone, position, salary, hire_date, id];
  
  db.query(sql, values, function(err, result) {
    if (err) {
      console.error('[ERROR] Update error:', err);
      return res.status(500).json({ 
        error: 'Failed to update employee',
        details: err.message 
      });
    }
    
    if (result.affectedRows === 0) {
      console.log('[ERROR] Employee not found');
      return res.status(404).json({ 
        error: 'Employee not found' 
      });
    }
    
    console.log('[SUCCESS] Employee updated');
    res.json({
      success: true,
      message: 'Employee updated successfully!'
    });
  });
});
// DELETE - Archive employee and move to separate table WITHOUT password verification (PROTECTED)
router.delete('/:id', verifyToken, function(req, res) {
  const id = req.params.id;
  
  console.log('[DELETE] Archiving employee ID:', id);
  console.log('[INFO] Requested by user:', req.user.email);
  
  // Get employee data first
  const getEmployeeSql = 'SELECT * FROM employees WHERE id = ?';
  
  db.query(getEmployeeSql, [id], function(getEmpErr, empResults) {
    if (getEmpErr) {
      console.error('[ERROR] Get employee error:', getEmpErr);
      return res.status(500).json({
        error: 'Failed to get employee',
        details: getEmpErr.message
      });
    }
    
    if (empResults.length === 0) {
      console.log('[ERROR] Employee not found');
      return res.status(404).json({
        error: 'Employee not found'
      });
    }
    
    const employee = empResults[0];
    
    // Insert into employees_archive table
    const archiveSql = `
      INSERT INTO employees_archive 
      (original_id, name, email, phone, position, salary, hire_date, deleted_at, deleted_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;
    
    const archiveValues = [
      employee.id,
      employee.name,
      employee.email,
      employee.phone,
      employee.position,
      employee.salary,
      employee.hire_date,
      req.user.email
    ];
    
    db.query(archiveSql, archiveValues, function(archiveErr, archiveResult) {
      if (archiveErr) {
        console.error('[ERROR] Archive insert error:', archiveErr);
        return res.status(500).json({
          error: 'Failed to archive employee',
          details: archiveErr.message
        });
      }
      
      console.log('[SUCCESS] Employee archived with archive ID:', archiveResult.insertId);
      
      // Disable foreign key checks temporarily
      const disableFKSql = 'SET FOREIGN_KEY_CHECKS = 0';
      
      db.query(disableFKSql, function(disableErr) {
        if (disableErr) {
          console.error('[ERROR] Failed to disable FK checks:', disableErr);
          return res.status(500).json({
            error: 'Failed to prepare deletion',
            details: disableErr.message
          });
        }
        
        console.log('[INFO] Foreign key checks disabled');
        
        // Delete from main employees table
        const deleteSql = 'DELETE FROM employees WHERE id = ?';
        
        db.query(deleteSql, [id], function(deleteErr, deleteResult) {
          // Re-enable foreign key checks regardless of delete result
          const enableFKSql = 'SET FOREIGN_KEY_CHECKS = 1';
          
          db.query(enableFKSql, function(enableErr) {
            if (enableErr) {
              console.error('[ERROR] Failed to re-enable FK checks:', enableErr);
            }
            console.log('[INFO] Foreign key checks re-enabled');
          });
          
          // Check delete result after re-enabling FKs
          if (deleteErr) {
            console.error('[ERROR] Delete error:', deleteErr);
            return res.status(500).json({
              error: 'Failed to delete employee from main table',
              details: deleteErr.message
            });
          }
          
          console.log('[SUCCESS] Employee deleted from main table');
          res.json({
            success: true,
            message: 'Employee deleted and archived successfully!',
            archiveId: archiveResult.insertId
          });
        });
      });
    });
  });
});
module.exports = router;