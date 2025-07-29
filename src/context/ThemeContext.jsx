import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon, Leaf } from 'lucide-react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  // Available themes
  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'viridian', icon: Leaf, label: 'Viridian' }
  ];

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('movieAppTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  // Update theme and save to localStorage
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('movieAppTheme', newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <ThemeContext.Provider value={{ theme, themes, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};