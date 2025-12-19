
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../services/api';
// import './Login.css';


// function Login() {
//   // State for form inputs
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Call login API
//       const response = await login({ email, password });
      
//       console.log('Login successful:', response);
      
//       // Redirect to dashboard
//       navigate('/dashboard');
      
//     } catch (err) {
//       setError(err.response?.data?.error || 'wrong username or password');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h1>Employee Management System</h1>
//         <h2>Login</h2>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor='email'>Email:</label>
//             <input
//             id='email'
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor='password'>Password:</label>
//             <input
//             id='password'
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="signup-link">
//           Don't have an account? <a href="/signup">Sign up</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;

// after the password hide feature
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../services/api';
// import './Login.css';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // NEW
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // SVG Icons 
//   const EyeIcon = (
//     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
//       <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
//       <circle cx="12" cy="12" r="3"/>
//     </svg>
//   );

//   const EyeOffIcon = (
//     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//       <path d="M17.94 17.94 6.06 6.06M10.73 5.08A9.93 9.93 0 0 1 12 5c5.52 0 10 4.48 10 7-.44.89-1.07 1.72-1.8 2.45M6.24 6.24C4.35 7.39 3 9.06 3 12c.44.89 1.07 1.72 1.8 2.45"/>
//     </svg>
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await login({ email, password });
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'wrong username or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h1>Employee Management System</h1>
//         <h2>Login</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password Field with Icon */}
//           <div className="form-group" style={{ position: 'relative' }}>
//             <label htmlFor="password">Password:</label>
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//               style={{ paddingRight: '40px' }}
//             />

//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               style={{
//                 position: 'absolute',
//                 right: '10px',
//                 top: '38px',
//                 cursor: 'pointer'
//               }}
//             >
//               {showPassword ? EyeOffIcon : EyeIcon}
//             </span>
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p className="signup-link">
//           Don't have an account? <a href="/signup">Sign up</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;

//After the SetIntervalTime for the error message 

import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // SVG Icons 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'wrong username or password';
      setError(message);

      // Clear the error automatically after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Employee Management System</h1>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ paddingRight: '40px' }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                cursor: 'pointer'
              }}
            >
              {showPassword ? EyeOffIcon : EyeIcon}
            </span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;


// another way of error message clearance as we use the useEffect

/*
import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // SVG Icons 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'wrong username or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Automatically clear error after 3 seconds whenever it changes
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError('');
    }, 3000); // 3 seconds

    // Cleanup in case error changes before 3 seconds
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Employee Management System</h1>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ paddingRight: '40px' }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                cursor: 'pointer'
              }}
            >
              {showPassword ? EyeOffIcon : EyeIcon}
            </span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
*/