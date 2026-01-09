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

// CREATE - Add new employee (PROTECTED) with duplicate validation
router.post('/', verifyToken, function(req, res) {
  console.log('[POST] Adding new employee:', req.body);
  
  const { name, email, phone, position, salary, hire_date } = req.body;
  
  if (!name || !email) {
    console.log('[ERROR] Missing required fields');
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  // FIXED: Check for duplicate email
  const checkEmailSql = 'SELECT id FROM employees WHERE email = ?';
  
  db.query(checkEmailSql, [email], function(emailErr, emailResults) {
    if (emailErr) {
      console.error('[ERROR] Email check error:', emailErr);
      return res.status(500).json({
        error: 'Failed to validate email',
        details: emailErr.message
      });
    }
    
    if (emailResults.length > 0) {
      console.log('[ERROR] Duplicate email:', email);
      return res.status(409).json({
        error: 'This email address is already registered with another employee'
      });
    }
    
    // FIXED: Check for duplicate phone (only if phone is provided)
    if (phone && phone.trim() !== '') {
      const checkPhoneSql = 'SELECT id FROM employees WHERE phone = ?';
      
      db.query(checkPhoneSql, [phone], function(phoneErr, phoneResults) {
        if (phoneErr) {
          console.error('[ERROR] Phone check error:', phoneErr);
          return res.status(500).json({
            error: 'Failed to validate phone number',
            details: phoneErr.message
          });
        }
        
        if (phoneResults.length > 0) {
          console.log('[ERROR] Duplicate phone:', phone);
          return res.status(409).json({
            error: 'This phone number is already registered with another employee'
          });
        }
        
        // Proceed with insert if no duplicates
        insertEmployee();
      });
    } else {
      // No phone provided, proceed with insert
      insertEmployee();
    }
  });
  
  // Helper function to insert employee
  function insertEmployee() {
    const sql = 'INSERT INTO employees (name, email, phone, position, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, email, phone, position, salary, hire_date];
    
    db.query(sql, values, function(err, result) {
      if (err) {
        console.error('[ERROR] Insert error:', err);
        
        // FIXED: Handle MySQL duplicate key errors
        if (err.code === 'ER_DUP_ENTRY') {
          if (err.message.includes('email')) {
            return res.status(409).json({
              error: 'This email address is already registered with another employee'
            });
          } else if (err.message.includes('phone')) {
            return res.status(409).json({
              error: 'This phone number is already registered with another employee'
            });
          }
        }
        
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
  }
});

// UPDATE - Edit existing employee (PROTECTED) with duplicate validation
router.put('/:id', verifyToken, function(req, res) {
  const id = req.params.id;
  console.log('[PUT] Updating employee ID:', id);
  
  const { name, email, phone, position, salary, hire_date } = req.body;
  
  // FIXED: Check for duplicate email (excluding current employee)
  const checkEmailSql = 'SELECT id FROM employees WHERE email = ? AND id != ?';
  
  db.query(checkEmailSql, [email, id], function(emailErr, emailResults) {
    if (emailErr) {
      console.error('[ERROR] Email check error:', emailErr);
      return res.status(500).json({
        error: 'Failed to validate email',
        details: emailErr.message
      });
    }
    
    if (emailResults.length > 0) {
      console.log('[ERROR] Duplicate email:', email);
      return res.status(409).json({
        error: 'This email address is already registered with another employee'
      });
    }
    
    // FIXED: Check for duplicate phone (only if phone is provided and not empty)
    if (phone && phone.trim() !== '') {
      const checkPhoneSql = 'SELECT id FROM employees WHERE phone = ? AND id != ?';
      
      db.query(checkPhoneSql, [phone, id], function(phoneErr, phoneResults) {
        if (phoneErr) {
          console.error('[ERROR] Phone check error:', phoneErr);
          return res.status(500).json({
            error: 'Failed to validate phone number',
            details: phoneErr.message
          });
        }
        
        if (phoneResults.length > 0) {
          console.log('[ERROR] Duplicate phone:', phone);
          return res.status(409).json({
            error: 'This phone number is already registered with another employee'
          });
        }
        
        // Proceed with update if no duplicates
        updateEmployee();
      });
    } else {
      // No phone provided, proceed with update
      updateEmployee();
    }
  });
  
  // Helper function to update employee
  function updateEmployee() {
    const sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, salary = ?, hire_date = ? WHERE id = ?';
    const values = [name, email, phone, position, salary, hire_date, id];
    
    db.query(sql, values, function(err, result) {
      if (err) {
        console.error('[ERROR] Update error:', err);
        
        // FIXED: Handle MySQL duplicate key errors
        if (err.code === 'ER_DUP_ENTRY') {
          if (err.message.includes('email')) {
            return res.status(409).json({
              error: 'This email address is already registered with another employee'
            });
          } else if (err.message.includes('phone')) {
            return res.status(409).json({
              error: 'This phone number is already registered with another employee'
            });
          }
        }
        
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
  }
});

// DELETE - Archive employee and move to separate table WITHOUT password verification (PROTECTED)
router.delete('/:id', verifyToken, function(req, res) {
  const id = req.params.id;
  const { deleted_by } = req.body; // FIXED: Get deleted_by from request body
  
  console.log('[DELETE] Archiving employee ID:', id);
  console.log('[INFO] Requested by user:', req.user.email);
  console.log('[INFO] Deleted by:', deleted_by || req.user.email);
  
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
    
    // FIXED: Use deleted_by from request or fallback to authenticated user
    const deletedByEmail = deleted_by || req.user.email;
    
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
      deletedByEmail // FIXED: Store the email of who deleted the employee
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
      console.log('[SUCCESS] Deleted by:', deletedByEmail);
      
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
            archiveId: archiveResult.insertId,
            deletedBy: deletedByEmail
          });
        });
      });
    });
  });
});

module.exports = router;