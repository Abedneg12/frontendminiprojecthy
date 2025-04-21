'use client';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <div className="text-yellow-600 font-bold text-xl flex items-center gap-2">
        <span className="text-2xl">🎟️</span>
        FindYourTicket
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 mx-6 max-w-md">
        <input
          type="text"
          placeholder="Search Ticket"
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-yellow-500"
        />
      </div>

      {/* Menu & Buttons */}
      <div className="flex items-center gap-6 text-sm">
        <nav className="hidden lg:flex gap-4 text-gray-800 font-medium">
          <a href="#" className="hover:text-yellow-600">Explore</a>
          <a href="#" className="hover:text-yellow-600">Create Your Event</a>
          <a href="#" className="hover:text-yellow-600">Favorites</a>
          <a href="#" className="hover:text-yellow-600">Find My Tickets</a>
        </nav>

        <div className="flex gap-2">
          <a
            href="/login"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}