'use client';

export default function LandingPage() {
  return (
    <main className="font-montserrat">
      {/* Hero Section */}
      <section
        className="h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/login1.png')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {[1, 2, 3, 4].map(i => (
            <span key={i} className="w-3 h-3 bg-white rounded-full opacity-60" />
          ))}
        </div>
      </section>

      {/* Category Navigation */}
      <section className="overflow-x-auto whitespace-nowrap py-4 border-b px-4 text-sm text-gray-700 font-medium bg-white">
        {['Music', 'Art', 'Tech', 'Sports', 'Festival', 'Business', 'Education', 'Gaming', 'Fashion', 'Comedy'].map((cat, i) => (
          <span key={i} className="inline-block mx-3 cursor-pointer hover:text-yellow-600">
            {cat}
          </span>
        ))}
      </section>

      {/* Ticket Showcase */}
      <section className="px-6 py-10 bg-[#f9f9f9]">
        <h2 className="text-xl font-bold mb-6 text-gray-800">🎟️ TICKET SHOWCASE</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-orange-600 text-white p-4 rounded-lg shadow-md hover:bg-orange-700 transition"
            >
              <h3 className="text-lg font-semibold mb-1">Event #{i + 1}</h3>
              <p className="text-sm">Exciting experience awaits</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
