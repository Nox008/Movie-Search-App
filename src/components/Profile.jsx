// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Lock,
  AlertCircle,
  CheckCircle,
  Settings,
  Shield
} from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Profile update error:', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Password change error:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-primary))] pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[rgb(var(--bg-secondary))] rounded-2xl border border-[rgb(var(--border))] p-8">
            <div className="animate-pulse">
              <div className="h-24 w-24 bg-[rgb(var(--bg-tertiary))] rounded-full mx-auto mb-6"></div>
              <div className="h-6 bg-[rgb(var(--bg-tertiary))] rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-[rgb(var(--bg-tertiary))] rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[rgb(var(--text-primary))] font-[var(--font-display)] mb-2">
            Profile Settings
          </h1>
          <p className="text-[rgb(var(--text-muted))]">
            Manage your account information and preferences
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3
                          dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3
                          dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-[rgb(var(--bg-secondary))] rounded-2xl border border-[rgb(var(--border))] 
                        shadow-sm overflow-hidden">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-[rgb(var(--accent))]/10 to-[rgb(var(--accent))]/5 
                          px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--accent))]/5 to-transparent"></div>
            <div className="relative">
              <div className="w-24 h-24 bg-[rgb(var(--accent))] rounded-full mx-auto mb-4 
                              flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-1">
                {user?.name}
              </h2>
              <p className="text-[rgb(var(--text-muted))]">
                Member since {user?.createdAt && formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8 space-y-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setError('');
                    setSuccess('');
                  }}
                  className="flex items-center px-3 py-1.5 text-sm font-medium 
                             text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10
                             rounded-lg transition-all duration-200 group"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                     w-5 h-5 text-[rgb(var(--text-muted))]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                        bg-[rgb(var(--bg-primary))] border-[rgb(var(--border))]
                        text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                        ${isEditing 
                          ? 'focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))]' 
                          : 'cursor-not-allowed opacity-75'
                        }
                      `}
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                     w-5 h-5 text-[rgb(var(--text-muted))]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                        bg-[rgb(var(--bg-primary))] border-[rgb(var(--border))]
                        text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                        ${isEditing 
                          ? 'focus:ring-2 focus:ring-[rgb(var(--accent))]/20 focus:border-[rgb(var(--accent))]' 
                          : 'cursor-not-allowed opacity-75'
                        }
                      `}
                      required
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-[rgb(var(--accent))] 
                               hover:bg-[rgb(var(--accent-hover))] text-white rounded-lg 
                               transition-all duration-200 transform hover:scale-105 
                               hover:shadow-lg active:scale-95 group"
                  >
                    <Save className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                    Save Changes
                  </button>
                )}
              </form>
            </div>

            {/* Password Section */}
            <div className="border-t border-[rgb(var(--border))] pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setError('');
                    setSuccess('');
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="flex items-center px-3 py-1.5 text-sm font-medium 
                             text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/10
                             rounded-lg transition-all duration-200 group"
                >
                  <Lock className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
                  Change Password
                </button>
              </div>

              {/* Password Change Form */}
              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="space-y-4 
                                                                 bg-[rgb(var(--bg-primary))] 
                                                                 rounded-lg p-4 border 
                                                                 border-[rgb(var(--border))]">
                  
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                       w-5 h-5 text-[rgb(var(--text-muted))]" />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border 
                                   bg-[rgb(var(--bg-secondary))] border-[rgb(var(--border))]
                                   text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                                   focus:ring-2 focus:ring-[rgb(var(--accent))]/20 
                                   focus:border-[rgb(var(--accent))] transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                   text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]
                                   transition-colors duration-200"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                       w-5 h-5 text-[rgb(var(--text-muted))]" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border 
                                   bg-[rgb(var(--bg-secondary))] border-[rgb(var(--border))]
                                   text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                                   focus:ring-2 focus:ring-[rgb(var(--accent))]/20 
                                   focus:border-[rgb(var(--accent))] transition-all duration-200"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                   text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]
                                   transition-colors duration-200"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[rgb(var(--text-secondary))]">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                       w-5 h-5 text-[rgb(var(--text-muted))]" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border 
                                   bg-[rgb(var(--bg-secondary))] border-[rgb(var(--border))]
                                   text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                                   focus:ring-2 focus:ring-[rgb(var(--accent))]/20 
                                   focus:border-[rgb(var(--accent))] transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                   text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]
                                   transition-colors duration-200"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Form Actions */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-[rgb(var(--accent))] 
                                 hover:bg-[rgb(var(--accent-hover))] text-white rounded-lg 
                                 transition-all duration-200 transform hover:scale-105 
                                 hover:shadow-lg active:scale-95 group"
                    >
                      <Save className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="flex items-center px-4 py-2 
                                 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                                 hover:bg-[rgb(var(--bg-secondary))] rounded-lg 
                                 transition-all duration-200 group"
                    >
                      <X className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Info */}
            <div className="border-t border-[rgb(var(--border))] pt-6">
              <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Account Information
              </h3>
              <div className="bg-[rgb(var(--bg-primary))] rounded-lg p-4 border border-[rgb(var(--border))]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[rgb(var(--text-muted))]">Account ID:</span>
                    <span className="ml-2 text-[rgb(var(--text-primary))] font-mono">{user?.id}</span>
                  </div>
                  <div>
                    <span className="text-[rgb(var(--text-muted))]">Joined:</span>
                    <span className="ml-2 text-[rgb(var(--text-primary))]">
                      {user?.createdAt && formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;