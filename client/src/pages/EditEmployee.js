// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getEmployee, updateEmployee } from '../services/api';
// import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';
// import './EmployeeForm.css';

// function EditEmployee() {
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     position: '',
//     salary: '',
//     hire_date: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [loadingData, setLoadingData] = useState(true);
//   const navigate = useNavigate();

//   // Load employee data
//   useEffect(() => {
//     loadEmployee();
//   }, [id]);

//   const loadEmployee = async () => {
//     try {
//       const response = await getEmployee(id);
//       const emp = response.data;
      
//       // Format date for input field
//       const hireDate = emp.hire_date ? emp.hire_date.split('T')[0] : '';
      
//       setFormData({
//         name: emp.name || '',
//         email: emp.email || '',
//         phone: emp.phone || '',
//         position: emp.position || '',
//         salary: emp.salary || '',
//         hire_date: hireDate
//       });
//       setLoadingData(false);
//     } catch (err) {
//       setError('Failed to load employee data');
//       setLoadingData(false);
//       console.error('Load employee error:', err);
//     }
//   };
//    const resetForm = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       position: '',
//       salary: '',
//       hire_date: ''
//     });
//     setError('');
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Validation
//     if (!formData.name || !formData.email) {
//       setError('Name and email are required');
//       setLoading(false);
//       return;
//     }

//     try {
//       await updateEmployee(id, formData);
//       alert('Employee updated successfully!');
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to update employee');
//       console.error('Update employee error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingData) {
//     return <div className="loading">Loading employee data...</div>;
//   }

//   return (
//     <div className="form-page">
//       <div className="form-container">
//         <div className="form-header">
//           <h2>Edit Employee</h2>
//           <button 
//             className="back-btn"
//             onClick={() => navigate('/dashboard')}
//           >
//             {/* ← Back to Dashboard */}
//              <ArrowLeftIcon className="icon-small" />
//             Dashboard
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label>Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Kistan Kharel"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="kistan@example.com"
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Phone</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="1234567890"
//               />
//             </div>

//             <div className="form-group">
//               <label>Position</label>
//               <input
//                 type="text"
//                 name="position"
//                 value={formData.position}
//                 onChange={handleChange}
//                 placeholder="Software Developer"
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Salary</label>
//               <input
//                 type="number"
//                 name="salary"
//                 value={formData.salary}
//                 onChange={handleChange}
//                 placeholder="50000"
//               />
//             </div>

//             <div className="form-group">
//               <label>Hire Date</label>
//               <input
//                 type="date"
//                 name="hire_date"
//                 value={formData.hire_date}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <div className="form-actions">
//             <button 
//               type="button" 
//               className="cancel-btn"
//               onClick={resetForm}
              
//             >
//               Clear
//             </button>
//             <button 
//               type="submit" 
//               className="submit-btn"
//               disabled={loading}
//             >
//               {loading ? 'Updating...' : 'Update Employee'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
//   <div>
    
//   </div>
// }

// export default EditEmployee;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../services/api';
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/ArrowLeft.svg';
import './EmployeeForm.css';

function EditEmployee() {
  const { id } = useParams();
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
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  // Load employee data
  useEffect(() => {
    loadEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await getEmployee(id);
      const emp = response.data;
      
      // Format date for input field
      const hireDate = emp.hire_date ? emp.hire_date.split('T')[0] : '';
      
      setFormData({
        name: emp.name || '',
        email: emp.email || '',
        phone: emp.phone || '',
        position: emp.position || '',
        salary: emp.salary || '',
        hire_date: hireDate
      });
      setLoadingData(false);
    } catch (err) {
      setError('Failed to load employee data');
      setLoadingData(false);
      console.error('Load employee error:', err);
    }
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Phone validation (if provided)
    if (formData.phone && formData.phone.length < 10) {
      setError('Phone number must be at least 10 digits');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await updateEmployee(id, formData);
      alert('Employee updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      // FIXED: Handle specific error messages for duplicates
      let errorMessage = 'Failed to update employee';
      
      if (err.response?.data?.error) {
        const backendError = err.response.data.error.toLowerCase();
        
        // Check for duplicate email
        if (backendError.includes('email') && backendError.includes('already')) {
          errorMessage = 'This email address is already registered with another employee';
        }
        // Check for duplicate phone
        else if (backendError.includes('phone') && backendError.includes('already')) {
          errorMessage = 'This phone number is already registered with another employee';
        }
        // Check for duplicate constraint violations
        else if (backendError.includes('duplicate') || backendError.includes('unique')) {
          if (backendError.includes('email')) {
            errorMessage = 'This email address is already registered with another employee';
          } else if (backendError.includes('phone')) {
            errorMessage = 'This phone number is already registered with another employee';
          } else {
            errorMessage = err.response.data.error;
          }
        }
        // Use backend error message as-is
        else {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Update employee error:', err);
      
      // FIXED: Auto-clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Loading employee data...</div>;
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Edit Employee</h2>
          <button 
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeftIcon className="icon-small" />
            Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Kistan Kharel"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
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
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Software Developer"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>

            <div className="form-group">
              <label>Hire Date</label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
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
              Clear
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;