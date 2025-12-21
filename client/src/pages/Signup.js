
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // For toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Username should start with a letter
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_ ]*$/;

    if (!usernameRegex.test(formData.username)) {
      setError("Username must start with a letter and contain only letters, numbers, or underscores.");
      return;
    }

    // Password length validation
    if (formData.password.length < 8 || formData.password.length > 15) {
      setError("Password must be 8 to 15 characters long.");
      return;
    }

    // Match password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert("Account created successfully!");
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  // SVG icons
  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94 6.06 6.06M10.73 5.08A9.93 9.93 0 0 1 12 5c5.52 0 10 4.48 10 7-.44.89-1.07 1.72-1.8 2.45M6.24 6.24C4.35 7.39 3 9.06 3 12c.44.89 1.07 1.72 1.8 2.45"/>
    </svg>
  );

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Employee Management System</h1>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div className="form-group">
            <label htmlFor='Username'>Username:</label>
            <input
            id='Username'
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor='email'>Email:</label>
            <input
            id='email'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD WITH TOGGLE */}
          <div className="form-group password-group">
            <label htmlFor='password'>Password:</label>
            <div className="password-wrapper">
              <input
              id='password'
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? EyeOffIcon : EyeIcon}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD WITH TOGGLE */}
          <div className="form-group password-group">
            <label htmlFor='confirm'>Confirm Password:</label>
            <div className="password-wrapper">
              <input
              id='confirm'
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <span className="toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? EyeOffIcon : EyeIcon}
              </span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && <div className="error-message">{error}</div>}

          {/* SUBMIT */}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;

