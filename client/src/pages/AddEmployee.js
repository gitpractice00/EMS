import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee, getAllEmployees } from '../services/api';
import './EmployeeForm.css';

import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingEmails, setExistingEmails] = useState([]);
  const navigate = useNavigate();

  // FIXED: Load existing emails on component mount
  useEffect(() => {
    loadExistingEmails();
  }, []);

  // FIXED: Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadExistingEmails = async () => {
    try {
      const response = await getAllEmployees();
      const emails = response.data.map(emp => emp.email.toLowerCase());
      setExistingEmails(emails);
    } catch (err) {
      console.error('Failed to load existing employees:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // FIXED: Limit phone number to 10 digits
    if (name === 'phone' && value.length > 10) {
      return; // Don't update if more than 10 digits
    }

    setFormData({
      ...formData,
      [name]: value
    });
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
    setError('');
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const salaryRegex = /^[0-9]+$/;
    const positionRegex = /^[A-Za-z\s]+$/;

    if (!formData.name || !formData.email || !formData.hire_date || !formData.salary) {
      return 'Please fill all required fields';
    }

    if (!nameRegex.test(formData.name)) {
      return 'Name must contain letters only';
    }

    // FIXED: Check if email is unique (case-insensitive)
    if (existingEmails.includes(formData.email.toLowerCase())) {
      return 'Email already exists. Please use a different email';
    }

    if (!phoneRegex.test(formData.phone)) {
      return 'Phone number must be exactly 10 digits';
    }

    if (!positionRegex.test(formData.position)) {
      return 'Position must contain letters only';
    }

    if (!salaryRegex.test(formData.salary)) {
      return 'Salary must be a number';
    }

    // FIXED: Validate hire date (cannot be future date)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const selectedDate = new Date(formData.hire_date);
    
    if (selectedDate > today) {
      return 'Hire date cannot be a future date';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await addEmployee(formData);
      alert('Employee added successfully!');
      resetForm();
      // Reload existing emails after adding new employee
      await loadExistingEmails();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
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

          <button
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
             <ArrowLeftIcon className="icon-small" />
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
                placeholder="Kistan Kharel"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="kistan@example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                id="position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Developer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hire_date">Hire Date</label>
              <input
                id="hire_date"
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              <CloseIcon width={14} height={14} style={{ marginRight: 6 }} />
              Clear
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
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
