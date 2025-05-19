'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { logout} from '@/lib/redux/slices/authSlice';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [showMenu, setShowMenu] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerProfilePicture, setCustomerProfilePicture] = useState<string | null>(null);
  const [organizerProfilePicture, setOrganizerProfilePicture] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user?.role) return;

      try {
        const endpoint =
          user.role === 'CUSTOMER'
            ? '/profile/me/customer'
            : '/profile/me/organizer';

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (res.ok) {
          if (user.role === 'CUSTOMER') {
            setCustomerProfilePicture(result.data.profile_picture || null);
          } else {
            setOrganizerProfilePicture(result.data.profile_picture || null);
          }
        }
      } catch (err) {
        console.error('Gagal mengambil foto profil', err);
      }
    };

    fetchProfilePicture();
  }, [user]);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="w-28 sm:w-32 md:w-40 lg:w-48 h-10 sm:h-12 md:h-14 lg:h-16 mr-2 sm:mr-3 md:mr-4">
              <img src="/findyourticket.png" alt="findyourticket" className="h-full w-full object-contain object-left" />
            </Link>
          </div>

          <div className="hidden md:block flex-grow mx-4">
            <input
              type="text"
              placeholder="Search Ticket"
              className="w-full px-4 py-1.5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:border-yellow-400 text-sm text-gray-600"
            />
          </div>

          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
            <Link href="/" onClick={handleExploreClick} className="hover:text-yellow-500">Explore</Link>
            <button onClick={() => router.push('/create-event')} className="hover:text-yellow-500">Create Your Event</button>
            <button onClick={() => router.push('/favorites')} className="hover:text-yellow-500">Favorites</button>
            <button onClick={() => router.push('/my-tickets')} className="hover:text-yellow-500">Find My Tickets</button>
          </div>

          <div className="ml-4 flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full text-sm font-semibold"
              >
                Sign In
              </button>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => {
                  if (menuTimeout.current) clearTimeout(menuTimeout.current);
                  setShowMenu(true);
                }}
                onMouseLeave={() => {
                  menuTimeout.current = setTimeout(() => setShowMenu(false), 250);
                }}
              >
                <img
                  src={user?.role === 'CUSTOMER'
                    ? customerProfilePicture || "/avatar.png"
                    : organizerProfilePicture || "/avatar.png"
                  }
                  alt="avatar"
                  className="w-9 h-9 rounded-full cursor-pointer border-2 border-yellow-500 hover:opacity-80 transition"
                />
                <div className={`absolute right-0 mt-2 w-44 bg-white border rounded shadow text-sm z-50 transition-all duration-200 ease-out ${showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
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
              </div>
            )}

            {/* Location Dropdown (Tetap Ditampilkan) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="hidden sm:flex items-center space-x-2 px-4 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>📍</span>
                <span className="truncate max-w-[120px]">{selectedLocation}</span>
                <span className={`transition ${isLocationOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isLocationOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50 text-sm max-h-60 overflow-y-auto">
                  <input
                    type="text"
                    placeholder="Cari lokasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1 border-b text-black text-xs focus:outline-none"
                  />
                  {locations.filter(loc =>
                    loc.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100"
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
