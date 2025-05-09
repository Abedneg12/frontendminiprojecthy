'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logout, setUserFromToken } from '@/lib/redux/slices/authSlice';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customerProfilePicture, setCustomerProfilePicture] = useState<string | null>(null);
  const [organizerProfilePicture, setOrganizerProfilePicture] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = () => {
    if (user?.role === 'CUSTOMER') {
      router.push('/profile');
    } else if (user?.role === 'ORGANIZER') {
      router.push('/organizer/dashboard');
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user?.role) return;

      try {
        const endpoint =
          user.role === 'CUSTOMER'
            ? '/profile/me/customer'
            : '/organizer/me';

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          if (user.role === 'CUSTOMER') {
            setCustomerProfilePicture(result.data.profile_picture || null);
          } else if (user.role === 'ORGANIZER') {
            setOrganizerProfilePicture(result.data.profile_picture || null);
          }
        }
      } catch (err) {
        console.error('Gagal mengambil foto profil', err);
      }
    };

    fetchProfilePicture();
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const locations = [
    'All Locations', 'Bali', 'Batam', 'Bogor', 'Balikpapan', 'Baubau', 'Bandung', 'Bekasi', 'Banjarbaru', 'Binjai',
    'Cikarang', 'Depok', 'Duri', 'Jakarta', 'Jambi', 'Jember', 'Kendari', 'Ketapang', 'Kupang', 'Lubuklinggau',
    'Makassar', 'Malang', 'Mamuju', 'Manado', 'Mataram', 'Medan', 'Palembang', 'Prabumulih', 'Pekanbaru',
    'Pematang Siantar', 'Ponorogo', 'Sampit', 'Surabaya', 'Semarang', 'Serang', 'Sidoarjo', 'Tangerang', 'Tegal',
    'Yogyakara'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExploreClick = () => {
    router.push('/');
    setTimeout(() => {
      const trendingSection = document.getElementById('trending-now');
      if (trendingSection) {
        trendingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  return (
    <header className="w-full backdrop-blur bg-white/70 border-b border-gray-200 fixed top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src="findyourticket.png" alt="findyourticket" className="h-10 object-contain" />
          </Link>

          <div className="hidden md:block flex-grow mx-4">
            <input
              type="text"
              placeholder="Search Ticket"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
            <Link href="/" onClick={handleExploreClick} className="hover:text-yellow-500">Explore</Link>
            <Link href="/create-event" className="hover:text-yellow-500">Create Event</Link>
            <Link href="/favorites" className="hover:text-yellow-500">Favorites</Link>
            <Link href="/my-tickets" className="hover:text-yellow-500">My Tickets</Link>
          </nav>

          <div className="ml-4 flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm font-semibold shadow-sm"
              >
                Sign In
              </button>
            ) : (
              <div className="relative">
                <img
                  src={user?.role === 'CUSTOMER' ? customerProfilePicture || "/avatar.png" : organizerProfilePicture || "/avatar.png"}
                  alt="avatar"
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 rounded-full cursor-pointer border border-gray-300 hover:opacity-80 transition"
                />
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md text-sm z-50">
                    <button
                      onClick={handleAvatarClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {user?.role === 'CUSTOMER' ? 'Profile' : 'Dashboard'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="hidden sm:flex items-center space-x-2 px-4 py-1.5 border border-gray-300 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span>📍</span>
                <span className="truncate max-w-[100px] lg:max-w-[120px]">{selectedLocation}</span>
                <span className={`transition ${isLocationOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isLocationOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50 text-sm max-h-60 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Cari lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-gray-700 border-b focus:outline-none"
                />
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-800"
                  >
                    {loc}
                  </button>
                ))}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
