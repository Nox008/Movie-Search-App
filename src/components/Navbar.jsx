import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Leaf, Search, Bookmark, User, LogIn } from 'lucide-react';
import AuthModal from './Auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Handle scroll effect with throttling for better performance
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

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'viridian', icon: Leaf, label: 'Viridian' }
  ];

  const navItems = [
    { name: 'Search', icon: Search, href: '/' },
    { name: 'Bookmarks', icon: Bookmark, href: '#bookmarks' },
    { name: 'Profile', icon: User, href: '#profile' }
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
              <h1 className="text-xl font-bold text-[rgb(var(--text-primary))] font-[var(--font-display)] 
                           transform transition-all duration-300 group-hover:scale-105 cursor-pointer
                           relative">
                Search Movies
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[rgb(var(--accent))] 
                              transition-all duration-500 group-hover:w-full"></div>
              </h1>
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
                      onClick={() => setTheme(themeOption.name)}
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

              {/* Auth Buttons */}
             {/*  <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 text-sm font-medium 
                                 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                                 hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-all duration-200
                                 group">
                  <LogIn className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                  Login
                </button>
                <button className="flex items-center px-4 py-2 text-sm font-medium 
                                 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                                 text-white rounded-lg transition-all duration-200 
                                 transform hover:scale-105 hover:shadow-lg
                                 active:scale-95 group">
                  <User className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-12" />
                  Sign Up
                </button>
              </div> */}
            </div>

            {/* Desktop Auth Buttons */}
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--bg-secondary))]
                         transition-all duration-200 transform hover:scale-105"
              >
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

          {/* Mobile Navigation */}
          <div className={`
            md:hidden transition-all duration-300 ease-out overflow-hidden
            ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="px-2 pt-2 pb-6 space-y-0 bg-[rgb(var(--bg-glass))] backdrop-blur-xl 
                          rounded-b-xl border-t border-[rgb(var(--border))] mt-2">
              
              {/* Mobile Nav Items */}
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-4 py-3 rounded-lg text-base font-medium
                             text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                             hover:bg-[rgb(var(--bg-secondary))] transition-all duration-200
                             transform hover:scale-[1.02] active:scale-95"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <IconComponent className="w-5 h-5 mr-3 transition-transform duration-200 
                                           group-hover:scale-110" />
                    {item.name}
                  </a>
                );
              })}

              {/* Mobile Theme Switcher */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-[rgb(var(--text-muted))] mb-3">Theme</p>
                <div className="flex space-x-2">
                  {themes.map((themeOption) => {
                    const IconComponent = themeOption.icon;
                    return (
                      <button
                        key={themeOption.name}
                        onClick={() => setTheme(themeOption.name)}
                        className={`
                          flex-1 flex items-center justify-center p-3 rounded-lg 
                          transition-all duration-200 transform hover:scale-105
                          ${theme === themeOption.name 
                            ? 'bg-[rgb(var(--accent))] text-white shadow-lg' 
                            : 'bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-primary))]'
                          }
                        `}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{themeOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="px-4 pt-2 space-y-2">
                <button className="w-full flex items-center justify-center px-4 py-3 
                                 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                                 hover:bg-[rgb(var(--bg-secondary))] rounded-lg transition-all duration-200
                                 border border-[rgb(var(--border))] group">
                  <LogIn className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                  Login
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 
                                 bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))]
                                 text-white rounded-lg transition-all duration-200 
                                 transform hover:scale-[1.02] active:scale-95 group">
                  <User className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-12" />
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
