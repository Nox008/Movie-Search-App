// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import { User, Mail, Edit, Sun, Moon, Leaf, Loader2, Save, X } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  // State for user data and UI control
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // State for loading, errors, and success messages
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for theme switcher
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        // Optionally redirect to login page after a delay
        // setTimeout(() => window.location.href = '/', 2000);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Apply and save theme
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      // Also update user in localStorage to keep Navbar in sync
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const themes = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'viridian', icon: Leaf }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[rgb(var(--bg-primary))]">
        <Loader2 className="w-12 h-12 text-[rgb(var(--accent))] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] font-[var(--font-body)]">
      <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-[var(--font-display)]">
            User Profile
          </h1>
          <div className="flex items-center bg-[rgb(var(--bg-secondary))] rounded-lg p-1 border border-[rgb(var(--border))]">
            {themes.map((themeOption) => (
              <button
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
                className={`p-2 rounded-md transition-all ${theme === themeOption.name ? 'bg-[rgb(var(--accent))] text-white' : 'hover:bg-[rgb(var(--bg-primary))]'}`}
              >
                <themeOption.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border))] rounded-xl shadow-lg p-6 sm:p-8">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg border border-green-200">{success}</div>}

          {user && (
            <form onSubmit={handleUpdateProfile}>
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-[rgb(var(--accent))] rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{isEditing ? formData.name : user.name}</h2>
                  <p className="text-md text-[rgb(var(--text-secondary))]">{isEditing ? formData.email : user.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                        bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]
                        ${isEditing ? 'border-[rgb(var(--border))] focus:ring-[rgb(var(--accent)/0.2)] focus:border-[rgb(var(--accent))]' : 'border-transparent bg-transparent'}`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                        bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]
                        ${isEditing ? 'border-[rgb(var(--border))] focus:ring-[rgb(var(--accent)/0.2)] focus:border-[rgb(var(--accent))]' : 'border-transparent bg-transparent'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[rgb(var(--border))] mt-8 pt-6 flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setFormData(user); setError(''); setSuccess(''); }}
                      className="flex items-center px-4 py-2 text-sm font-medium 
                                 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                                 bg-[rgb(var(--bg-secondary))] hover:bg-[rgb(var(--bg-primary))] rounded-lg transition-all duration-200
                                 border border-[rgb(var(--border))] group">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center px-6 py-2 text-sm font-medium 
                                 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white 
                                 rounded-lg transition-all duration-200 transform hover:scale-105
                                 disabled:bg-[rgb(var(--accent)/0.7)] disabled:cursor-not-allowed">
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium 
                               bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white 
                               rounded-lg transition-all duration-200 transform hover:scale-105">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;