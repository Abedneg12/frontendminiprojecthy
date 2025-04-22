'use client';

import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="w-full font-montserrat">
      {/* Banner / Hero */}
      <section className="w-full h-[500px] bg-cover bg-center relative" style={{ backgroundImage: "url('/banner.jpg')" }}>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
          <div className="text-center text-white max-w-3xl">
            <h1 className="text-5xl font-bold leading-tight mb-4">Create. Connect. Celebrate.</h1>
            <p className="text-lg mb-6">FindYourTicket is your gateway to amazing events. Discover or host your own!</p>
            <div className="flex justify-center gap-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded">
                Explore Events
              </button>
              <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded">
                Create Your Event
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 bg-white text-center text-sm text-gray-600">
        <div className="flex justify-center flex-wrap gap-4 px-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>Category</span>
          ))}
        </div>
      </section>

      {/* Ticket Showcase */}
      <section className="py-10 px-6 md:px-16 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">TICKET SHOWCASE</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-orange-700 text-white p-4 rounded shadow-md text-center">
              <h3 className="font-bold text-lg mb-2">Lorem Ipsum</h3>
              <p className="text-sm">Lorem ipsum dolor sit amet</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
