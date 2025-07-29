// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Leaf, Search, Bookmark, User, LogIn, LogOut } from 'lucide-react';
import AuthModal from './Auth';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { theme, themes, changeTheme } = useTheme();
  const [user, setUser] = useState(null);

  // Check for user session on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload(); // Reload to clear all state
  };

  const navItems = [
    { name: 'Search', icon: Search, href: '/' },
    { name: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
    { name: 'Profile', icon: User, href: '/profile' }
  ];

  return (
    <>
      {showAuthModal && (
        <AuthModal 
          initialMode={authMode} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
      <nav className={`
        fixed top-0 w-full z-50 transition-all duration-500 ease-out
        ${isScrolled 
          ? 'bg-[rgb(var(--bg-glass))] backdrop-blur-xl border-b border-[rgb(var(--border))] shadow-sm' 
          : 'bg-transparent'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 group">
              <a href="/" className="text-xl font-bold text-[rgb(var(--text-primary))] font-[var(--font-display)] 
                                  transform transition-all duration-300 group-hover:scale-105
                                  relative">
                Search Movies
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[rgb(var(--accent))] 
                                 transition-all duration-500 group-hover:w-full"></div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium
                                 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                                 hover:bg-[rgb(var(--bg-secondary))] transition-all duration-200
                                 relative overflow-hidden"
                    >
                      <IconComponent className="w-4 h-4 mr-2 transition-transform duration-200 
                                                  group-hover:scale-110 group-hover:rotate-3" />
                      {item.name}
                      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent))] 
                                      to-transparent opacity-0 group-hover:opacity-10 
                                      transition-opacity duration-200"></div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Theme Switcher */}
              <div className="flex items-center bg-[rgb(var(--bg-secondary))] rounded-lg p-1 
                                border border-[rgb(var(--border))]">
                {themes.map((themeOption) => {
                  const IconComponent = themeOption.icon;
                  return (
                    <button
                      key={themeOption.name}
                      onClick={() => changeTheme(themeOption.name)}
                      className={`
                        p-2 rounded-md transition-all duration-200 relative group
                        ${theme === themeOption.name 
                          ? 'bg-[rgb(var(--accent))] text-white shadow-lg scale-110' 
                          : 'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-primary))]'
                        }
                      `}
                      title={themeOption.label}
                    >
                      <IconComponent className={`w-4 h-4 transition-all duration-300
                        ${theme === themeOption.name ? 'rotate-180 scale-110' : 'group-hover:rotate-12'}
                      `} />
                    </button>
                  );
                })}
              </div>

              {/* Conditional Auth Buttons */}
              {user ? (
                // Authenticated View
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-[rgb(var(--text-primary))]">
                    Welcome, {user.name}!
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium 
                               text-[rgb(var(--text-secondary))] hover:text-red-500
                               hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-all duration-200
                               group">
                    <LogOut className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                    Logout
                  </button>
                </div>
              ) : (
                // Guest View
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium 
                               text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                               hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-all duration-200
                               group">
                    <LogIn className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium 
                               bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                               text-white rounded-lg transition-all duration-200 
                               transform hover:scale-105 hover:shadow-lg
                               active:scale-95 group">
                    <User className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-12" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-secondary))]
                             transition-all duration-200 transform hover:scale-105"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <Menu className={`w-6 h-6 absolute transition-all duration-300 transform
                    ${isMenuOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'}
                  `} />
                  <X className={`w-6 h-6 absolute transition-all duration-300 transform
                    ${isMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'}
                  `} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ⬇️ OVERHAULED MOBILE NAVIGATION ⬇️ */}
        <div className={`
          md:hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-screen' : 'max-h-0'} 
          overflow-hidden
        `}>
          <div className="pt-4 pb-3 space-y-3 bg-[rgb(var(--bg-glass))] backdrop-blur-xl 
                          border-t border-[rgb(var(--border))] sm:px-3">
            
            {/* Conditional User/Auth Section */}
            <div className="px-2">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center px-3 py-2">
                    <User className="w-6 h-6 mr-3 text-[rgb(var(--text-secondary))]" />
                    <span className="font-medium text-[rgb(var(--text-primary))]">
                      Welcome, {user.name}!
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium
                               bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg 
                               transition-all duration-200 group">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium
                               text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                               hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-all duration-200
                               border border-[rgb(var(--border))] group">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium
                               bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                               text-white rounded-lg transition-all duration-200 group">
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <hr className="border-[rgb(var(--border))] my-2" />

            {/* Mobile Nav Items */}
            <div className="px-2 space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)} // Closes menu on navigation
                    className="group flex items-center px-3 py-3 text-base font-medium
                               text-[rgb(var(--text-primary))] hover:text-[rgb(var(--accent))]
                               hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-all duration-200"
                  >
                    <IconComponent className="w-5 h-5 mr-3 text-[rgb(var(--text-secondary))] 
                                              group-hover:text-[rgb(var(--accent))] transition-colors duration-200" />
                    {item.name}
                  </a>
                );
              })}
            </div>

            <hr className="border-[rgb(var(--border))] my-2" />

            {/* Mobile Theme Switcher */}
            <div className="px-2">
                <p className="px-3 py-2 text-sm font-semibold text-[rgb(var(--text-muted))]">Appearance</p>
                <div className="flex items-center justify-around bg-[rgb(var(--bg-secondary))] rounded-lg p-1 
                                border border-[rgb(var(--border))]">
                  {themes.map((themeOption) => {
                    const IconComponent = themeOption.icon;
                    return (
                      <button
                        key={themeOption.name}
                        onClick={() => changeTheme(themeOption.name)}
                        className={`
                          flex-1 p-2 rounded-md transition-all duration-300 transform
                          ${theme === themeOption.name 
                            ? 'bg-[rgb(var(--accent))] text-white shadow-md scale-105' 
                            : 'text-[rgb(var(--text-muted))]'
                          }
                        `}
                        title={themeOption.label}
                      >
                        <IconComponent className="w-5 h-5 mx-auto" />
                      </button>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;