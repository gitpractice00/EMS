// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('./database');

// const router = express.Router();

// // SIGNUP
// router.post('/signup', function (req, res) {
//   console.log(' Signup request received:', req.body);

//   const { username, email, password } = req.body;

//   // Validation
//   if (!username || !email || !password) {
//     console.log(' Missing fields');
//     return res.status(400).json({
//       error: 'Please provide username, email and password'
//     });
//   }

//   // Check if email exists
//   const checkEmailSql = 'SELECT * FROM users WHERE email = ?';

//   db.query(checkEmailSql, [email], function (err, results) {
//     if (err) {
//       console.error(' Database error:', err);
//       return res.status(500).json({
//         error: 'Database error',
//         details: err.message
//       });
//     }

//     if (results.length > 0) {
//       console.log('Email already exists');
//       return res.status(400).json({
//         error: 'Email already registered'
//       });
//     }

//     // Hash password
//     bcrypt.hash(password, 10, function (err, hashedPassword) {
//       if (err) {
//         console.error(' Hashing error:', err);
//         return res.status(500).json({
//           error: 'Error encrypting password'
//         });
//       }

//       console.log('Password hashed successfully');

//       // Insert user
//       const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

//       db.query(insertSql, [username, email, hashedPassword], function (err, result) {
//         if (err) {
//           console.error('Insert error:', err);
//           return res.status(500).json({
//             error: 'Failed to create user',
//             details: err.message
//           });
//         }

//         console.log(' User created successfully, ID:', result.insertId);

//         res.status(201).json({
//           success: true,
//           message: 'User registered successfully!',
//           userId: result.insertId
//         });
//       });
//     });
//   });
// });

// // LOGIN
// router.post('/login', function (req, res) {
//   console.log('Login request received:', { email: req.body.email });

//   const { email, password } = req.body;

//   // Validation
//   if (!email || !password) {
//     console.log(' Missing email or password');
//     return res.status(400).json({
//       error: 'Please provide email and password'
//     });
//   }

//   // Find user
//   const sql = 'SELECT * FROM users WHERE email = ?';

//   db.query(sql, [email], function (err, results) {
//     if (err) {
//       console.error(' Database error:', err);
//       return res.status(500).json({
//         error: 'Database error',
//         details: err.message
//       });
//     }

//     if (results.length === 0) {
//       console.log(' User not found');
//       return res.status(401).json({
//         error: 'Invalid email or password'
//       });
//     }

//     const user = results[0];
//     console.log('User found:', user.id, user.email);

//     // Compare password
//     bcrypt.compare(password, user.password, function (err, isMatch) {
//       if (err) {
//         console.error('Password comparison error:', err);
//         return res.status(500).json({
//           error: 'Error checking password'
//         });
//       }

//       if (!isMatch) {
//         console.log(' Password does not match');
//         return res.status(401).json({
//           error: 'Invalid email or password'
//         });
//       }

//       console.log('Password matched!');

//       // Check JWT_SECRET
//       if (!process.env.JWT_SECRET) {
//         console.error(' JWT_SECRET not found in .env file!');
//         return res.status(500).json({
//           error: 'Server configuration error'
//         });
//       }

//       // Create token
//       const token = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: '24h' }
//       );

//       console.log(' Token created successfully');

//       res.json({
//         success: true,
//         message: 'Login successful!',
//         token: token,
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email
//         }
//       });
//     });
//   });
// });

// module.exports = router;

//After the profile (pasword change features)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const verifyToken = require('./authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Signup route
router.post('/signup', async function(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async function(err, results) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(sql, [username, email, hashedPassword], function(insertErr, result) {
        if (insertErr) {
          console.error('Insert error:', insertErr);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        res.status(201).json({
          success: true,
          message: 'User created successfully',
          userId: result.insertId
        });
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async function(err, results) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    try {
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// FIXED: NEW ROUTE - Get all user emails (for signup validation)
router.get('/users/emails', function(req, res) {
  console.log('[GET] Fetching all user emails');
  
  const sql = 'SELECT email FROM users';
  
  db.query(sql, function(err, results) {
    if (err) {
      console.error('[ERROR] Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to get emails',
        details: err.message 
      });
    }
    
    const emails = results.map(row => row.email);
    console.log('[SUCCESS] Found', emails.length, 'emails');
    
    res.json({
      success: true,
      count: emails.length,
      emails: emails
    });
  });
});

// FIXED: NEW ROUTE - Update user profile (email/password with old password verification)
router.put('/users/profile', verifyToken, async function(req, res) {
  const { currentPassword, newEmail, newPassword } = req.body;
  const userId = req.user.id;
  
  console.log('[PUT] Updating profile for user ID:', userId);
  
  // Validation
  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required' });
  }
  
  if (!newEmail && !newPassword) {
    return res.status(400).json({ error: 'Please provide new email or new password to update' });
  }
  
  try {
    // Get current user data
    db.query('SELECT * FROM users WHERE id = ?', [userId], async function(err, results) {
      if (err) {
        console.error('[ERROR] Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = results[0];
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // Check if new email already exists (if changing email)
      if (newEmail && newEmail !== user.email) {
        db.query('SELECT * FROM users WHERE email = ? AND id != ?', [newEmail, userId], async function(emailErr, emailResults) {
          if (emailErr) {
            console.error('[ERROR] Email check error:', emailErr);
            return res.status(500).json({ error: 'Database error' });
          }
          
          if (emailResults.length > 0) {
            return res.status(400).json({ error: 'Email is already in use' });
          }
          
          // Proceed with update
          await performUpdate();
        });
      } else {
        // Proceed with update (only password change or same email)
        await performUpdate();
      }
      
      async function performUpdate() {
        let updateSql;
        let updateValues;
        
        if (newEmail && newPassword) {
          // Update both email and password
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          updateSql = 'UPDATE users SET email = ?, password = ? WHERE id = ?';
          updateValues = [newEmail, hashedPassword, userId];
        } else if (newEmail) {
          // Update only email
          updateSql = 'UPDATE users SET email = ? WHERE id = ?';
          updateValues = [newEmail, userId];
        } else if (newPassword) {
          // Update only password
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          updateSql = 'UPDATE users SET password = ? WHERE id = ?';
          updateValues = [hashedPassword, userId];
        }
        
        db.query(updateSql, updateValues, function(updateErr, result) {
          if (updateErr) {
            console.error('[ERROR] Update error:', updateErr);
            return res.status(500).json({ error: 'Failed to update profile' });
          }
          
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          console.log('[SUCCESS] Profile updated successfully');
          
          // Get updated user data
          db.query('SELECT id, username, email FROM users WHERE id = ?', [userId], function(getUserErr, getUserResults) {
            if (getUserErr) {
              return res.status(500).json({ error: 'Failed to get updated user data' });
            }
            
            res.json({
              success: true,
              message: 'Profile updated successfully',
              user: getUserResults[0]
            });
          });
        });
      }
    });
  } catch (error) {
    console.error('[ERROR] Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;