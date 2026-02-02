'use client';

import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const NavBar = () => {
  return (
    <header className="flex justify-between items-center p-4 h-16 border-b bg-gray-800 text-white w-700">
      {/* Center: Navigation Links */}
      <ul className="flex gap-6">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
        </li>
        <li>
          <Link href="/services" className="hover:text-gray-300">
            Services
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-gray-300">
            Contact Us
          </Link>
        </li>
      </ul>

      {/* Right: User Auth Buttons */}
      <div className="flex justify-end gap-4">
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-500">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-4 py-1 bg-green-600 rounded hover:bg-green-500">
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
