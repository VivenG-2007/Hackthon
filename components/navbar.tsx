'use client';

import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const NavBar = () => {
  const [theme, setTheme] = useState('dark');
  const isDark = theme === 'dark';

  // Sync with home page theme if needed
  useEffect(() => {
    const checkTheme = () => {
      const homeTheme = localStorage.getItem('theme') || 'dark';
      setTheme(homeTheme);
    };
    checkTheme();
    window.addEventListener('storage', checkTheme);
    return () => window.removeEventListener('storage', checkTheme);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 h-16 border-b transition-all duration-500 ${
      isDark 
        ? 'bg-gray-900/80 backdrop-blur-lg border-gray-800 text-white' 
        : 'bg-white/80 backdrop-blur-lg border-gray-200 text-gray-900'
    }`}>
      {/* Logo/Brand */}
      <div className={`text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
        The Resume Hub
      </div>

      {/* Center: Navigation Links */}
      <ul className="flex gap-8">
        <li>
          <Link 
            href="/" 
            className={`transition-colors duration-300 ${
              isDark ? 'hover:text-cyan-400' : 'hover:text-purple-600'
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            href="/about" 
            className={`transition-colors duration-300 ${
              isDark ? 'hover:text-cyan-400' : 'hover:text-purple-600'
            }`}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            href="/services" 
            className={`transition-colors duration-300 ${
              isDark ? 'hover:text-cyan-400' : 'hover:text-purple-600'
            }`}
          >
            Services
          </Link>
        </li>
        <li>
          <Link 
            href="/contact" 
            className={`transition-colors duration-300 ${
              isDark ? 'hover:text-cyan-400' : 'hover:text-purple-600'
            }`}
          >
            Contact Us
          </Link>
        </li>
      </ul>

      {/* Right: User Auth Buttons */}
      <div className="flex justify-end gap-4 items-center">
        <SignedOut>
          <SignInButton>
            <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700 border border-cyan-500/30'
                : 'bg-gray-100 text-purple-600 hover:bg-gray-200 border border-purple-200'
            }`}>
              Log In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
            }`}>
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default NavBar;