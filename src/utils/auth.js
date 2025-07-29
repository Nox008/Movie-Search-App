// utils/auth.js - Create this file to help with token management

export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  export const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;
    
    try {
      // Basic check - decode JWT payload without verification
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        removeToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      removeToken();
      return false;
    }
  };
  
  export const verifyTokenWithServer = async () => {
    const token = getToken();
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return true;
      } else {
        removeToken();
        return false;
      }
    } catch (error) {
      console.error('Server token verification error:', error);
      return false;
    }
  };
  
  export const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle 401 responses by clearing token
    if (response.status === 401) {
      removeToken();
      throw new Error('Authentication failed - please log in again');
    }
    
    return response;
  };