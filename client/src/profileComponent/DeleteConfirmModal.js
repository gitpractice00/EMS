// File: client/src/components/DeleteConfirmModal.js
import React, { useState, useEffect } from 'react';
import './DeleteConfirmModal.css';

function DeleteConfirmModal({ isOpen, employeeName, onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await onConfirm(password);
      // Success - modal will be closed by parent
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // SVG Icons
  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94 6.06 6.06M10.73 5.08A9.93 9.93 0 0 1 12 5c5.52 0 10 4.48 10 7-.44.89-1.07 1.72-1.8 2.45M6.24 6.24C4.35 7.39 3 9.06 3 12c.44.89 1.07 1.72 1.8 2.45"/>
    </svg>
  );

  const AlertIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="alert-icon-container">
            {AlertIcon}
          </div>
          <h2>Delete Employee</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="warning-message">
            <p>Are you sure you want to delete <strong>{employeeName}</strong>?</p>
            <p className="sub-warning">This employee will be moved to the archive. You can restore them later if needed.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Enter your password to confirm</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
                <span 
                  className="toggle-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? EyeOffIcon : EyeIcon}
                </span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="delete-btn"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;