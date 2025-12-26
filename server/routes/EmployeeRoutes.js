// const express = require('express');
// const router = express.Router();
// const db = require('../database');
// const verifyToken = require('../authMiddleware');

// // Get all employees (PROTECTED)
// router.get('/', verifyToken, function(req, res) {
//   console.log('[GET] Fetching all employees');
  
//   const sql = 'SELECT * FROM employees';
  
//   db.query(sql, function(err, results) {
//     if (err) {
//       console.error('[ERROR] Database error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to get employees',
//         details: err.message 
//       });
//     }
    
//     console.log('[SUCCESS] Found', results.length, 'employees');
//     res.json({
//       success: true,
//       count: results.length,
//       data: results,
//       requestedBy: req.user.email
//     });
//   });
// });

// // Get one employee by ID (PROTECTED)
// router.get('/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[GET] Fetching employee ID:', id);
  
//   const sql = 'SELECT * FROM employees WHERE id = ?';
  
//   db.query(sql, [id], function(err, results) {
//     if (err) {
//       console.error('[ERROR] Database error:', err);
//       return res.status(500).json({ 
//         error: 'Database error',
//         details: err.message 
//       });
//     }
    
//     if (results.length === 0) {
//       console.log('[ERROR] Employee not found');
//       return res.status(404).json({ 
//         error: 'Employee not found' 
//       });
//     }
    
//     console.log('[SUCCESS] Employee found');
//     res.json({
//       success: true,
//       data: results[0]
//     });
//   });
// });

// // CREATE - Add new employee (PROTECTED)
// router.post('/', verifyToken, function(req, res) {
//   console.log('[POST] Adding new employee:', req.body);
  
//   const { name, email, phone, position, salary, hire_date } = req.body;
  
//   if (!name || !email) {
//     console.log('[ERROR] Missing required fields');
//     return res.status(400).json({ 
//       error: 'Name and email are required' 
//     });
//   }
  
//   const sql = 'INSERT INTO employees (name, email, phone, position, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [name, email, phone, position, salary, hire_date];
  
//   db.query(sql, values, function(err, result) {
//     if (err) {
//       console.error('[ERROR] Insert error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to add employee',
//         details: err.message 
//       });
//     }
    
//     console.log('[SUCCESS] Employee added, ID:', result.insertId);
//     res.status(201).json({
//       success: true,
//       message: 'Employee added successfully!',
//       employeeId: result.insertId
//     });
//   });
// });

// // UPDATE - Edit existing employee (PROTECTED)
// router.put('/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[PUT] Updating employee ID:', id);
  
//   const { name, email, phone, position, salary, hire_date } = req.body;
  
//   const sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, salary = ?, hire_date = ? WHERE id = ?';
//   const values = [name, email, phone, position, salary, hire_date, id];
  
//   db.query(sql, values, function(err, result) {
//     if (err) {
//       console.error('[ERROR] Update error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to update employee',
//         details: err.message 
//       });
//     }
    
//     if (result.affectedRows === 0) {
//       console.log('[ERROR] Employee not found');
//       return res.status(404).json({ 
//         error: 'Employee not found' 
//       });
//     }
    
//     console.log('[SUCCESS] Employee updated');
//     res.json({
//       success: true,
//       message: 'Employee updated successfully!'
//     });
//   });
// });

// // DELETE - Remove employee (PROTECTED)
// router.delete('/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[DELETE] Removing employee ID:', id);
  
//   const sql = 'DELETE FROM employees WHERE id = ?';
  
//   db.query(sql, [id], function(err, result) {
//     if (err) {
//       console.error('[ERROR] Delete error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to delete employee',
//         details: err.message 
//       });
//     }
    
//     if (result.affectedRows === 0) {
//       console.log('[ERROR] Employee not found');
//       return res.status(404).json({ 
//         error: 'Employee not found' 
//       });
//     }
    
//     console.log('[SUCCESS] Employee deleted');
//     res.json({
//       success: true,
//       message: 'Employee deleted successfully!'
//     });
//   });
// });

// module.exports = router;


// After the soft delete feature from the database

// const express = require('express');
// const router = express.Router();
// const db = require('../database');
// const verifyToken = require('../authMiddleware');
// const bcrypt = require('bcryptjs');

// // Get all employees (PROTECTED) - FIXED: Exclude deleted employees
// router.get('/', verifyToken, function(req, res) {
//   console.log('[GET] Fetching all employees');
  
//   const sql = 'SELECT * FROM employees WHERE deleted = 0';
  
//   db.query(sql, function(err, results) {
//     if (err) {
//       console.error('[ERROR] Database error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to get employees',
//         details: err.message 
//       });
//     }
    
//     console.log('[SUCCESS] Found', results.length, 'employees');
//     res.json({
//       success: true,
//       count: results.length,
//       data: results,
//       requestedBy: req.user.email
//     });
//   });
// });

// // FIXED: NEW ROUTE - Get deleted/archived employees
// router.get('/archived', verifyToken, function(req, res) {
//   console.log('[GET] Fetching archived employees');
  
//   const sql = 'SELECT * FROM employees WHERE deleted = 1 ORDER BY deleted_at DESC';
  
//   db.query(sql, function(err, results) {
//     if (err) {
//       console.error('[ERROR] Database error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to get archived employees',
//         details: err.message 
//       });
//     }
    
//     console.log('[SUCCESS] Found', results.length, 'archived employees');
//     res.json({
//       success: true,
//       count: results.length,
//       data: results
//     });
//   });
// });

// // Get one employee by ID (PROTECTED)
// router.get('/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[GET] Fetching employee ID:', id);
  
//   const sql = 'SELECT * FROM employees WHERE id = ? AND deleted = 0';
  
//   db.query(sql, [id], function(err, results) {
//     if (err) {
//       console.error('[ERROR] Database error:', err);
//       return res.status(500).json({ 
//         error: 'Database error',
//         details: err.message 
//       });
//     }
    
//     if (results.length === 0) {
//       console.log('[ERROR] Employee not found');
//       return res.status(404).json({ 
//         error: 'Employee not found' 
//       });
//     }
    
//     console.log('[SUCCESS] Employee found');
//     res.json({
//       success: true,
//       data: results[0]
//     });
//   });
// });

// // CREATE - Add new employee (PROTECTED)
// router.post('/', verifyToken, function(req, res) {
//   console.log('[POST] Adding new employee:', req.body);
  
//   const { name, email, phone, position, salary, hire_date } = req.body;
  
//   if (!name || !email) {
//     console.log('[ERROR] Missing required fields');
//     return res.status(400).json({ 
//       error: 'Name and email are required' 
//     });
//   }
  
//   const sql = 'INSERT INTO employees (name, email, phone, position, salary, hire_date) VALUES (?, ?, ?, ?, ?, ?)';
//   const values = [name, email, phone, position, salary, hire_date];
  
//   db.query(sql, values, function(err, result) {
//     if (err) {
//       console.error('[ERROR] Insert error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to add employee',
//         details: err.message 
//       });
//     }
    
//     console.log('[SUCCESS] Employee added, ID:', result.insertId);
//     res.status(201).json({
//       success: true,
//       message: 'Employee added successfully!',
//       employeeId: result.insertId
//     });
//   });
// });

// // UPDATE - Edit existing employee (PROTECTED)
// router.put('/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[PUT] Updating employee ID:', id);
  
//   const { name, email, phone, position, salary, hire_date } = req.body;
  
//   const sql = 'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, salary = ?, hire_date = ? WHERE id = ? AND deleted = 0';
//   const values = [name, email, phone, position, salary, hire_date, id];
  
//   db.query(sql, values, function(err, result) {
//     if (err) {
//       console.error('[ERROR] Update error:', err);
//       return res.status(500).json({ 
//         error: 'Failed to update employee',
//         details: err.message 
//       });
//     }
    
//     if (result.affectedRows === 0) {
//       console.log('[ERROR] Employee not found');
//       return res.status(404).json({ 
//         error: 'Employee not found' 
//       });
//     }
    
//     console.log('[SUCCESS] Employee updated');
//     res.json({
//       success: true,
//       message: 'Employee updated successfully!'
//     });
//   });
// });

// // DELETE - Soft delete employee with password verification (PROTECTED)
// router.delete('/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   const { password } = req.body;
  
//   console.log('[DELETE] Soft deleting employee ID:', id);
//   console.log('[INFO] Requested by user:', req.user.email);
  
//   if (!password) {
//     return res.status(400).json({
//       error: 'Password is required for deletion'
//     });
//   }
  
//   // First, verify the user's password
//   const getUserSql = 'SELECT * FROM users WHERE id = ?';
  
//   db.query(getUserSql, [req.user.id], async function(getUserErr, userResults) {
//     if (getUserErr) {
//       console.error('[ERROR] User lookup error:', getUserErr);
//       return res.status(500).json({
//         error: 'Database error',
//         details: getUserErr.message
//       });
//     }
    
//     if (userResults.length === 0) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }
    
//     const user = userResults[0];
    
//     // Verify password
//     try {
//       const isValidPassword = await bcrypt.compare(password, user.password);
      
//       if (!isValidPassword) {
//         console.log('[ERROR] Invalid password');
//         return res.status(401).json({
//           error: 'Incorrect password'
//         });
//       }
      
//       // Password is correct, proceed with soft delete
//       const softDeleteSql = 'UPDATE employees SET deleted = 1, deleted_at = NOW(), deleted_by = ? WHERE id = ?';
      
//       db.query(softDeleteSql, [req.user.email, id], function(deleteErr, deleteResult) {
//         if (deleteErr) {
//           console.error('[ERROR] Soft delete error:', deleteErr);
//           return res.status(500).json({
//             error: 'Failed to delete employee',
//             details: deleteErr.message
//           });
//         }
        
//         if (deleteResult.affectedRows === 0) {
//           console.log('[ERROR] Employee not found or already deleted');
//           return res.status(404).json({
//             error: 'Employee not found'
//           });
//         }
        
//         console.log('[SUCCESS] Employee soft deleted');
//         res.json({
//           success: true,
//           message: 'Employee deleted successfully!'
//         });
//       });
      
//     } catch (bcryptErr) {
//       console.error('[ERROR] Password verification error:', bcryptErr);
//       return res.status(500).json({
//         error: 'Password verification failed',
//         details: bcryptErr.message
//       });
//     }
//   });
// });

// // FIXED: NEW ROUTE - Restore deleted employee
// router.put('/restore/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[PUT] Restoring employee ID:', id);
  
//   const sql = 'UPDATE employees SET deleted = 0, deleted_at = NULL, deleted_by = NULL WHERE id = ?';
  
//   db.query(sql, [id], function(err, result) {
//     if (err) {
//       console.error('[ERROR] Restore error:', err);
//       return res.status(500).json({
//         error: 'Failed to restore employee',
//         details: err.message
//       });
//     }
    
//     if (result.affectedRows === 0) {
//       console.log('[ERROR] Employee not found');
//       return res.status(404).json({
//         error: 'Employee not found'
//       });
//     }
    
//     console.log('[SUCCESS] Employee restored');
//     res.json({
//       success: true,
//       message: 'Employee restored successfully!'
//     });
//   });
// });

// // FIXED: NEW ROUTE - Permanently delete employee (only for archived employees)
// router.delete('/permanent/:id', verifyToken, function(req, res) {
//   const id = req.params.id;
//   console.log('[DELETE] Permanently deleting employee ID:', id);
  
//   const sql = 'DELETE FROM employees WHERE id = ? AND deleted = 1';
  
//   db.query(sql, [id], function(err, result) {
//     if (err) {
//       console.error('[ERROR] Permanent delete error:', err);
//       return res.status(500).json({
//         error: 'Failed to permanently delete employee',
//         details: err.message
//       });
//     }
    
//     if (result.affectedRows === 0) {
//       console.log('[ERROR] Employee not found or not archived');
//       return res.status(404).json({
//         error: 'Employee not found or not in archive'
//       });
//     }
    
//     console.log('[SUCCESS] Employee permanently deleted');
//     res.json({
//       success: true,
//       message: 'Employee permanently deleted!'
//     });
//   });
// });

// module.exports = router;

//After the hard delete and stored in employee-archieve file

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

// DELETE - Archive employee and move to separate table with password verification (PROTECTED)
router.delete('/:id', verifyToken, function(req, res) {
  const id = req.params.id;
  const { password } = req.body;
  
  console.log('[DELETE] Archiving employee ID:', id);
  console.log('[INFO] Requested by user:', req.user.email);
  
  if (!password) {
    return res.status(400).json({
      error: 'Password is required for deletion'
    });
  }
  
  // First, verify the user's password
  const getUserSql = 'SELECT * FROM users WHERE id = ?';
  
  db.query(getUserSql, [req.user.id], async function(getUserErr, userResults) {
    if (getUserErr) {
      console.error('[ERROR] User lookup error:', getUserErr);
      return res.status(500).json({
        error: 'Database error',
        details: getUserErr.message
      });
    }
    
    if (userResults.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    const user = userResults[0];
    
    // Verify password
    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.log('[ERROR] Invalid password');
        return res.status(401).json({
          error: 'Incorrect password'
        });
      }
      
      // Password is correct, get employee data
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
        
        // FIXED: Insert into employees_archive table (separate table)
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
          
          // FIXED: Now delete from main employees table
          const deleteSql = 'DELETE FROM employees WHERE id = ?';
          
          db.query(deleteSql, [id], function(deleteErr, deleteResult) {
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
      
    } catch (bcryptErr) {
      console.error('[ERROR] Password verification error:', bcryptErr);
      return res.status(500).json({
        error: 'Password verification failed',
        details: bcryptErr.message
      });
    }
  });
});

// FIXED: NEW ROUTE - Restore employee from archive
router.put('/restore/:archiveId', verifyToken, function(req, res) {
  const archiveId = req.params.archiveId;
  console.log('[PUT] Restoring employee from archive ID:', archiveId);
  
  // Get employee data from archive
  const getArchiveSql = 'SELECT * FROM employees_archive WHERE id = ?';
  
  db.query(getArchiveSql, [archiveId], function(getErr, archiveResults) {
    if (getErr) {
      console.error('[ERROR] Get archive error:', getErr);
      return res.status(500).json({
        error: 'Failed to get archived employee',
        details: getErr.message
      });
    }
    
    if (archiveResults.length === 0) {
      console.log('[ERROR] Archived employee not found');
      return res.status(404).json({
        error: 'Archived employee not found'
      });
    }
    
    const archivedEmployee = archiveResults[0];
    
    // Insert back into employees table
    const restoreSql = `
      INSERT INTO employees 
      (name, email, phone, position, salary, hire_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const restoreValues = [
      archivedEmployee.name,
      archivedEmployee.email,
      archivedEmployee.phone,
      archivedEmployee.position,
      archivedEmployee.salary,
      archivedEmployee.hire_date
    ];
    
    db.query(restoreSql, restoreValues, function(restoreErr, restoreResult) {
      if (restoreErr) {
        console.error('[ERROR] Restore error:', restoreErr);
        return res.status(500).json({
          error: 'Failed to restore employee',
          details: restoreErr.message
        });
      }
      
      console.log('[SUCCESS] Employee restored with new ID:', restoreResult.insertId);
      
      // Delete from archive table
      const deleteArchiveSql = 'DELETE FROM employees_archive WHERE id = ?';
      
      db.query(deleteArchiveSql, [archiveId], function(deleteErr, deleteResult) {
        if (deleteErr) {
          console.error('[ERROR] Delete from archive error:', deleteErr);
          // Don't return error since employee is already restored
        }
        
        console.log('[SUCCESS] Employee removed from archive');
        res.json({
          success: true,
          message: 'Employee restored successfully!',
          newEmployeeId: restoreResult.insertId
        });
      });
    });
  });
});

// FIXED: NEW ROUTE - Permanently delete from archive
router.delete('/permanent/:archiveId', verifyToken, function(req, res) {
  const archiveId = req.params.archiveId;
  console.log('[DELETE] Permanently deleting from archive ID:', archiveId);
  
  const sql = 'DELETE FROM employees_archive WHERE id = ?';
  
  db.query(sql, [archiveId], function(err, result) {
    if (err) {
      console.error('[ERROR] Permanent delete error:', err);
      return res.status(500).json({
        error: 'Failed to permanently delete employee',
        details: err.message
      });
    }
    
    if (result.affectedRows === 0) {
      console.log('[ERROR] Archived employee not found');
      return res.status(404).json({
        error: 'Archived employee not found'
      });
    }
    
    console.log('[SUCCESS] Employee permanently deleted from archive');
    res.json({
      success: true,
      message: 'Employee permanently deleted!'
    });
  });
});

module.exports = router;