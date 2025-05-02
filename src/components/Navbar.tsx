'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/authSlice'

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);


  const handleAvatarClick = () => {
    if (user?.role === 'CUSTOMER') {
      router.push('/profile');
    } else if (user?.role === 'ORGANIZER') {
      router.push('/organizer/dashboard');
    }
    setShowMenu(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span
              onClick={() => router.push('/')}
              className="text-xl font-bold text-yellow-500 cursor-pointer flex items-center gap-1"
            >
              <img src="/logo-icon.png" alt="logo" className="h-6 w-6" />
              FindYourTicket
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <button onClick={() => router.push('/explore')} className="hover:text-yellow-500">Explore</button>
            <button onClick={() => router.push('/create-event')} className="hover:text-yellow-500">Create Your Event</button>
            <button onClick={() => router.push('/favorites')} className="hover:text-yellow-500">Favorites</button>
            <button onClick={() => router.push('/my-tickets')} className="hover:text-yellow-500">Find My Tickets</button>
          </div>

          {/* Auth Area */}
          <div className="ml-4 flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full text-sm font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full text-sm font-semibold"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <img
                  src="/avatar.png"
                  alt="avatar"
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 rounded-full cursor-pointer border-2 border-yellow-500 hover:opacity-80 transition"
                />
                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow text-sm w-44 z-50">
                    <button
                      onClick={handleAvatarClick}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-gray-700"
                    >
                      {user?.role === 'CUSTOMER' ? 'Profile' : 'Dashboard'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
