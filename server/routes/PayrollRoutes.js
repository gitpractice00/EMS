const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../authMiddleware');

/**
 * TEST ROUTE
 * GET /api/payroll/test
 */
router.get('/test', (req, res) => {
  res.json({ message: 'Payroll routes working!' });
});

/**
 * GET payroll for a specific month
 * GET /api/payroll/:month
 */
router.get('/:month', verifyToken, (req, res) => {
  const { month } = req.params;

  // Validate month format YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      error: 'Invalid month format. Use YYYY-MM'
    });
  }

  const sql = `
    SELECT 
      p.*,
      e.name AS employee_name,
      e.position
    FROM payroll p
    INNER JOIN employees e ON p.employee_id = e.id
    WHERE p.month = ?
    ORDER BY e.name
  `;

  db.query(sql, [month], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to get payroll',
        details: err.message
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });
});

/**
 * SAVE / UPDATE payroll for a month
 * POST /api/payroll
 */
router.post('/', verifyToken, (req, res) => {
  const { month, records } = req.body;

  // Validation
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      error: 'Valid month (YYYY-MM) is required'
    });
  }

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      error: 'Records array is required'
    });
  }

  let completed = 0;
  let errors = [];

  records.forEach((record, index) => {
    const {
      employee_id,
      basic_salary,
      allowances = 0,
      deductions = 0,
      net_salary,
      payment_status = 'pending',
      paid_date
    } = record;

    if (!employee_id || basic_salary === undefined) {
      errors.push(`Record ${index}: employee_id and basic_salary required`);
      completed++;
      return;
    }

    const finalNetSalary =
      net_salary !== undefined
        ? net_salary
        : basic_salary + allowances - deductions;

    const finalPaidDate =
      payment_status === 'paid'
        ? paid_date || new Date().toISOString().split('T')[0]
        : null;

    // Check existing payroll
    const checkSql =
      'SELECT id FROM payroll WHERE employee_id = ? AND month = ?';

    db.query(checkSql, [employee_id, month], (checkErr, rows) => {
      if (checkErr) {
        errors.push(`Employee ${employee_id}: ${checkErr.message}`);
        completed++;
        return;
      }

      const sql = rows.length
        ? `
          UPDATE payroll
          SET basic_salary=?, allowances=?, deductions=?, net_salary=?,
              payment_status=?, paid_date=?
          WHERE employee_id=? AND month=?
        `
        : `
          INSERT INTO payroll
          (employee_id, month, basic_salary, allowances, deductions,
           net_salary, payment_status, paid_date)
          VALUES (?,?,?,?,?,?,?,?)
        `;

      const params = rows.length
        ? [
            basic_salary,
            allowances,
            deductions,
            finalNetSalary,
            payment_status,
            finalPaidDate,
            employee_id,
            month
          ]
        : [
            employee_id,
            month,
            basic_salary,
            allowances,
            deductions,
            finalNetSalary,
            payment_status,
            finalPaidDate
          ];

      db.query(sql, params, err => {
        if (err) {
          errors.push(`Employee ${employee_id}: ${err.message}`);
        }

        completed++;
        if (completed === records.length) finish();
      });
    });
  });

  function finish() {
    if (errors.length) {
      return res.status(500).json({
        error: 'Some payroll records failed',
        details: errors
      });
    }

    res.json({
      success: true,
      message: 'Payroll saved successfully',
      count: records.length
    });
  }
});

/**
 * MARK payroll record as paid
 * PUT /api/payroll/:id/pay
 */
router.put('/:id/pay', verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE payroll
    SET payment_status = 'paid',
        paid_date = CURDATE()
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: 'Failed to mark as paid',
        details: err.message
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        error: 'Payroll record not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment marked as paid'
    });
  });
});

module.exports = router;
