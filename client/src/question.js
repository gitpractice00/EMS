// In login page  we have a feature of "Don't have an account? Sign up" and while clicking it again the login form should appear as the new account can be created by the admin only and to verify before  doing signUp and if verified allow them to sign up new account
// To save data, you'd need to create backend routes for:

// POST /attendance - Save attendance
// GET /attendance/:date - Get attendance for date
// POST /payroll - Save payroll
// GET /payroll/:month - Get payroll for month
// create a route for backend aznd database for the attendance and payroll
//Don't use the icons use instead svg image in all the parts and also avoid the use of the icons.  

// Add New Employee Validation with the suggestions below
/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../services/api';
import './EmployeeForm.css';

import { ReactComponent as BackIcon } from '../assets/icons/BackArrow.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/Close.svg';
import { ReactComponent as PlusIcon } from '../assets/icons/Plus.svg';
import { ReactComponent as LoaderIcon } from '../assets/icons/Loader.svg';

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    salary: '',
    hire_date: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const salaryRegex = /^[0-9]+$/;
  const positionRegex = /^[A-Za-z\s]+$/;

  // Validate single field on change
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (!nameRegex.test(value)) return 'Name must contain letters only';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        // simple email regex
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'phone':
        if (!value) return 'Phone is required';
        if (!phoneRegex.test(value)) return 'Phone must be exactly 10 digits';
        return '';
      case 'position':
        if (!value) return 'Position is required';
        if (!positionRegex.test(value)) return 'Position must contain letters only';
        return '';
      case 'salary':
        if (!value) return 'Salary is required';
        if (!salaryRegex.test(value)) return 'Salary must be a number';
        return '';
      case 'hire_date':
        if (!value) return 'Hire Date is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate this field live
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      salary: '',
      hire_date: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await addEmployee(formData);
      alert('Employee added successfully!');
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add employee');
      console.error('Add employee error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Employee</h2>

          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <BackIcon width={14} height={14} style={{ marginRight: 6 }} />
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                id="position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Developer"
              />
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Salary *</label>
              <input
                id="salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50000"
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="hire_date">Hire Date *</label>
              <input
                id="hire_date"
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
              />
              {errors.hire_date && <span className="error-message">{errors.hire_date}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={resetForm}>
              <CloseIcon width={14} height={14} style={{ marginRight: 6 }} />
              Clear
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <LoaderIcon width={16} height={16} style={{ marginRight: 6 }} />
              ) : (
                <PlusIcon width={16} height={16} style={{ marginRight: 6 }} />
              )}
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;



While clicking the UI of attendance like present, absent ,leave , total It must redirect me to the details

*/

// this the css code before the status clickable

// .attendance-page {
//   min-height: 100vh;
//   background: #f8f9fa;
// }

// .btn-back {
//   padding: 10px 20px;
//   background: #6c757d;
//   color: white;
//   border: none;
//   border-radius: 8px;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s;
// }

// .btn-back:hover {
//   background: #5a6268;
//   transform: translateY(-2px);
// }

// .attendance-section {
//   background: white;
//   padding: 30px;
//   border-radius: 12px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// }

// .date-input {
//   padding: 10px 20px;
//   border: 1px solid #e0e0e0;
//   border-radius: 8px;
//   font-size: 14px;
//   outline: none;
//   cursor: pointer;
// }

// .date-input:focus {
//   border-color: #667eea;
// }

// .btn-submit {
//   padding: 12px 24px;
//   background: #28a745;
//   color: white;
//   border: none;
//   border-radius: 8px;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s;
// }

// .btn-submit:hover {
//   background: #218838;
//   transform: translateY(-2px);
// }

// .attendance-list {
//   display: flex;
//   flex-direction: column;
//   gap: 15px;
// }

// .attendance-card {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 20px;
//   background: #f8f9fa;
//   border: 1px solid #e0e0e0;
//   border-radius: 12px;
//   transition: all 0.3s;
// }

// .attendance-card:hover {
//   border-color: #667eea;
//   box-shadow: 0 4px 12px rgba(0,0,0,0.1);
// }

// .employee-details {
//   display: flex;
//   align-items: center;
//   gap: 15px;
// }

// .status-buttons {
//   display: flex;
//   gap: 10px;
// }

// .status-btn {
//   padding: 10px 20px;
//   border: 2px solid #e0e0e0;
//   background: white;
//   border-radius: 8px;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: all 0.3s;
// }

// .status-btn:hover {
//   transform: scale(1.05);
// }

// .status-btn.present {
//   border-color: #28a745;
//   color: #28a745;
// }

// .status-btn.present.active {
//   background: #28a745;
//   color: white;
// }

// .status-btn.absent {
//   border-color: #dc3545;
//   color: #dc3545;
// }

// .status-btn.absent.active {
//   background: #dc3545;
//   color: white;
// }

// .status-btn.leave {
//   border-color: #ffc107;
//   color: #ff8800;
// }

// .status-btn.leave.active {
//   background: #ffc107;
//   color: white;
// }

// .stat-box.green .stat-icon { background: #e8f5e9; }
// .stat-box.red .stat-icon { background: #ffebee; }
// .stat-box.orange .stat-icon { background: #fff3e0; }

// @media (max-width: 768px) {
//   .attendance-card {
//     flex-direction: column;
//     gap: 15px;
//     align-items: flex-start;
//   }

//   .status-buttons {
//     width: 100%;
//     flex-wrap: wrap;
//   }

//   .status-btn {
//     flex: 1;
//     min-width: 100px;
//   }
// }