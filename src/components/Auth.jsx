import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';

const AuthModal = ({ onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Reset errors when mode changes
  useEffect(() => {
    setErrors({});
    setServerError('');
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const endpoint = mode === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
      const payload = mode === 'login' 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setAuthSuccess(true);
        // Store token in localStorage or context
        localStorage.setItem('authToken', response.data.token);
        // Close modal after delay or redirect
        setTimeout(() => {
          onClose();
          window.location.reload(); // Or use router to navigate
        }, 1500);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setServerError(
        error.response?.data?.message || 
        error.message || 
        'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[rgb(var(--bg-primary))] rounded-xl shadow-xl 
                     border border-[rgb(var(--border))] overflow-hidden animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[rgb(var(--text-secondary))] 
                   hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-secondary))] 
                   transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Auth Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              {mode === 'login' 
                ? 'Log in to access your account' 
                : 'Join us to get started'}
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
              {serverError}
            </div>
          )}

          {/* Success Message */}
          {authSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg border border-green-200">
              {mode === 'login' 
                ? 'Login successful! Redirecting...' 
                : 'Account created successfully! Redirecting...'}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field (Signup only) */}
            {mode === 'signup' && (
              <div className="mb-4">
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
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                              ${errors.name ? 'border-red-500 focus:ring-red-200' : 
                                'border-[rgb(var(--border))] focus:ring-[rgb(var(--accent)/0.2)] focus:border-[rgb(var(--accent))]'}
                              bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
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
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                            ${errors.email ? 'border-red-500 focus:ring-red-200' : 
                              'border-[rgb(var(--border))] focus:ring-[rgb(var(--accent)/0.2)] focus:border-[rgb(var(--accent))]'}
                            bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                            ${errors.password ? 'border-red-500 focus:ring-red-200' : 
                              'border-[rgb(var(--border))] focus:ring-[rgb(var(--accent)/0.2)] focus:border-[rgb(var(--accent))]'}
                            bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {mode === 'signup' && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                              ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 
                                'border-[rgb(var(--border))] focus:ring-[rgb(var(--accent)/0.2)] focus:border-[rgb(var(--accent))]'}
                              bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center
                        ${isLoading 
                          ? 'bg-[rgb(var(--accent)/0.7)] cursor-not-allowed' 
                          : 'bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] hover:shadow-md'}
                        text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--accent))]`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Log in' : 'Sign up'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm text-[rgb(var(--text-secondary))]">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))] hover:underline focus:outline-none"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))] hover:underline focus:outline-none"
                >
                  Log in
                </button>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgb(var(--border))]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-muted))]">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login (Optional) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-[rgb(var(--border))] rounded-lg 
                        bg-[rgb(var(--bg-primary))] hover:bg-[rgb(var(--bg-secondary))] transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-[rgb(var(--border))] rounded-lg 
                        bg-[rgb(var(--bg-primary))] hover:bg-[rgb(var(--bg-secondary))] transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;