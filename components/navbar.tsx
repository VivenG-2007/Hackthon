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
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const [theme, setTheme] = useState('dark');
  const pathname = usePathname();
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 h-16 border-b transition-all duration-500 ${
      isDark 
        ? 'bg-gray-900/80 backdrop-blur-lg border-gray-800 text-white' 
        : 'bg-white/80 backdrop-blur-lg border-gray-200 text-gray-900'
    }`}>
      {/* Logo/Brand */}
      <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
        The Resume Hub
      </Link>

      {/* Center: Navigation Links */}
      <nav>
        <ul className="flex gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`transition-all duration-300 font-medium relative ${
                    isDark ? 'hover:text-cyan-400' : 'hover:text-purple-600'
                  } ${
                    isActive 
                      ? isDark 
                        ? 'text-cyan-400' 
                        : 'text-purple-600'
                      : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      isDark ? 'bg-cyan-400' : 'bg-purple-600'
                    }`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right: User Auth Buttons */}
      <div className="flex justify-end gap-4 items-center">
        <SignedOut>
          <SignInButton mode="modal">
            <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700 border border-cyan-500/30'
                : 'bg-gray-100 text-purple-600 hover:bg-gray-200 border border-purple-200'
            }`}>
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
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
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonTrigger: "focus:shadow-none"
              }
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default NavBar;