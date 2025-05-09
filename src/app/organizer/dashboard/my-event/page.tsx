'use client';

import React from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const dummyEvents = [
  {
    id: 1,
    name: 'Konser Musik Akhir Tahun',
    location: 'Jakarta',
    date: '2025-12-20',
    status: 'Aktif',
    ticketsSold: 120,
  },
  {
    id: 2,
    name: 'Webinar Teknologi AI',
    location: 'Online',
    date: '2025-11-10',
    status: 'Selesai',
    ticketsSold: 350,
  },
  {
    id: 3,
    name: 'Pameran Seni Rupa',
    location: 'Bandung',
    date: '2025-10-05',
    status: 'Batal',
    ticketsSold: 0,
  },
];

export default function MyEventPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] px-8 py-12 font-montserrat">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Event Saya</h1>
          <button className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white text-sm font-medium shadow transition">
            + Tambah Event
          </button>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dummyEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">{event.name}</h2>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
                <p className="text-sm text-gray-500">📅 {event.date}</p>
                <p className="text-sm text-gray-500">🎟️ {event.ticketsSold} tiket terjual</p>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                    event.status === 'Aktif'
                      ? 'bg-green-100 text-green-700'
                      : event.status === 'Selesai'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="mt-6 flex justify-between text-sm text-gray-600">
                <button className="flex items-center gap-1 hover:text-black transition">
                  <FiEye className="text-base" />
                  Lihat
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600 transition">
                  <FiEdit2 className="text-base" />
                  Edit
                </button>
                <button className="flex items-center gap-1 hover:text-red-500 transition">
                  <FiTrash2 className="text-base" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
