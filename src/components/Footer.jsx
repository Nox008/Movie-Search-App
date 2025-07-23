import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About', href: '#about' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#github' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
    { name: 'Email', icon: Mail, href: '#email' }
  ];

  return (
    <footer className="relative border-t border-[rgb(var(--border))] bg-[rgb(var(--bg-primary))] 
                     transition-colors duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(var(--accent))]/5 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Brand section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] font-[var(--font-display)]">
                Search Movies
              </h3>
              <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed max-w-xs">
                Discover your next favorite film with our comprehensive movie database and search platform.
              </p>
            </div>

            {/* Links section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[rgb(var(--text-primary))] uppercase tracking-wider">
                Links
              </h4>
              <nav className="flex flex-col space-y-3">
                {footerLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]
                             transition-colors duration-200 w-fit group relative"
                  >
                    {link.name}
                    <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-[rgb(var(--accent))] 
                                  transition-all duration-300 group-hover:w-full"></div>
                  </a>
                ))}
              </nav>
            </div>

            {/* Social section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[rgb(var(--text-primary))] uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="p-2 rounded-lg text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]
                               hover:bg-[rgb(var(--bg-secondary))] transition-all duration-200
                               transform hover:scale-110 hover:-translate-y-0.5 group"
                      title={social.name}
                    >
                      <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-[rgb(var(--border))]">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-sm text-[rgb(var(--text-muted))]">
                <span>&copy; {currentYear} Search Movies. All rights reserved.</span>
              </div>

              {/* Made with love */}
              <div className="flex items-center space-x-2 text-sm text-[rgb(var(--text-muted))]">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>for movie lovers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgb(var(--accent))] to-transparent"></div>
    </footer>
  );
};

export default Footer;