// File: client/src/components/ProfileSettingsModal.js
import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../services/api';
import './ProfileSettingsModal.css';

function ProfileSettingsModal({ user, isOpen, onClose, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newEmail: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      return 'Current password is required';
    }

    if (!formData.newEmail && !formData.newPassword) {
      return 'Please provide new email or new password to update';
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8 || formData.newPassword.length > 15) {
        return 'New password must be 8 to 15 characters long';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        return 'New passwords do not match';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        currentPassword: formData.currentPassword
      };

      if (formData.newEmail && formData.newEmail !== user.email) {
        updateData.newEmail = formData.newEmail;
      }

      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
      }

      const response = await updateUserProfile(updateData);
      
      alert('Profile updated successfully!');
      
      // Update user in localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        onProfileUpdate(response.user);
      }
      
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="current-info">
            <p><strong>Current Email:</strong> {user?.email}</p>
            <p><strong>Username:</strong> {user?.username}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password *</label>
              <div className="password-wrapper">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  required
                />
                <span 
                  className="toggle-icon" 
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? EyeOffIcon : EyeIcon}
                </span>
              </div>
            </div>

            <div className="divider">
              <span>Update Information</span>
            </div>

            {/* New Email */}
            <div className="form-group">
              <label htmlFor="newEmail">New Email (optional)</label>
              <input
                id="newEmail"
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                placeholder="Enter new email"
              />
            </div>

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password (optional)</label>
              <div className="password-wrapper">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (8-15 chars)"
                />
                <span 
                  className="toggle-icon" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? EyeOffIcon : EyeIcon}
                </span>
              </div>
            </div>

            {/* Confirm New Password */}
            {formData.newPassword && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  <span 
                    className="toggle-icon" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? EyeOffIcon : EyeIcon}
                  </span>
                </div>
              </div>
            )}

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
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsModal;