'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const locations = [
    'All Locations',
    'Bali',
    'Batam',
    'Bogor',
    'Balikpapan',
    'Baubau',
    'Bandung',
    'Bekasi',
    'Banjarbaru',
    'Binjai',
    'Cikarang',
    'Depok',
    'Duri',
    'Jakarta',
    'Jambi',
    'Jember',
    'Kendari',
    'Ketapang',
    'Kupang',
    'Lubuklinggau',
    'Makassar',
    'Malang',
    'Mamuju',
    'Manado',
    'Mataram',
    'Medan',
    'Palembang',
    'Prabumulih',
    'Pekanbaru',
    'Pematang Siantar',
    'Ponorogo',
    'Sampit',
    'Surabaya',
    'Semarang',
    'Serang',
    'Sidoarjo',
    'Tangerang',
    'Tegal',
    'Yogyakara',
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
        trendingSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 200);
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="w-28 sm:w-32 md:w-40 lg:w-48 h-10 sm:h-12 md:h-14 lg:h-16 mr-2 sm:mr-3 md:mr-4">
              <img 
                src="findyourticket.png" 
                alt="findyourticket" 
                className="h-full w-full object-contain object-left"
              />
            </Link>
          </div>


          <div className="hidden md:block flex-grow mx-3 sm:mx-4 md:mx-5 lg:mx-6">
            <input
              type="text"
              placeholder="Search Ticket"
              className="w-full px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:border-yellow-400 text-xs sm:text-sm text-gray-600"
            />
          </div>


          <div className="hidden md:flex space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6 text-xs sm:text-sm font-medium text-gray-700">
            <Link href="/" onClick={handleExploreClick} className="hover:text-yellow-500 whitespace-nowrap">
              Explore
            </Link>
            <Link href="/create-event" className="hover:text-yellow-500 whitespace-nowrap">
              Create Event
            </Link>
            <button className="hover:text-yellow-500 whitespace-nowrap">Favorites</button>
            <button className="hover:text-yellow-500 whitespace-nowrap">My Tickets</button>
          </div>


          <div className="ml-2 sm:ml-3 md:ml-4 flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
            <button className="px-2 sm:px-3 py-0.5 sm:py-1 md:px-4 md:py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
              Sign In
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="hidden sm:flex items-center space-x-1 md:space-x-2 px-2 sm:px-3 py-0.5 sm:py-1 md:px-4 md:py-1.5 border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition whitespace-nowrap"
              >
                <span>📍</span>
                <span className="hidden md:inline truncate max-w-[100px] lg:max-w-[120px] xl:max-w-none">
                  {selectedLocation}
                </span>
                <span className={`transition ${isLocationOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>


            </div>


            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 sm:p-2 rounded-md text-gray-700 hover:text-yellow-500 focus:outline-none"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>


        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">

              <div className="px-2 mb-2">
                <input
                  type="text"
                  placeholder="Search Ticket"
                  className="w-full px-3 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:border-yellow-400 text-sm text-gray-600"
                />
              </div>
              

              <div className="grid grid-cols-2 gap-1">
                <Link
                  href="/"
                  onClick={() => {
                    handleExploreClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50 text-center"
                >
                  Explore
                </Link>
                <Link
                  href="/create-event"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50 text-center"
                >
                  Create Event
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50 text-center"
                >
                  Favorites
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500 hover:bg-gray-50 text-center"
                >
                  My Tickets
                </button>
              </div>
              

              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-sm text-gray-700"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}