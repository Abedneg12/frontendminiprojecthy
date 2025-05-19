'use client';

import { useRouter } from 'next/navigation';

const dummyTopEvents = [
  {
    id: 1,
    name: 'Tech Conference 2025',
    date: '2025-08-10',
    ticketsSold: 250,
    revenue: 12500000,
  },
  {
    id: 2,
    name: 'Jazz Night Jakarta',
    date: '2025-06-05',
    ticketsSold: 180,
    revenue: 9000000,
  },
  {
    id: 3,
    name: 'Startup Meetup Surabaya',
    date: '2025-09-12',
    ticketsSold: 120,
    revenue: 6000000,
  },
  {
    id: 4,
    name: 'Art Expo Bandung',
    date: '2025-07-22',
    ticketsSold: 98,
    revenue: 4900000,
  },
  {
    id: 5,
    name: 'Health & Wellness Fair',
    date: '2025-05-30',
    ticketsSold: 75,
    revenue: 3750000,
  },
];

export default function TopEvents() {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Events</h2>
      <ul className="space-y-3">
        {dummyTopEvents.map((event) => (
          <li
            key={event.id}
            onClick={() => router.push(`/organizer/dashboard/my-event/${event.id}`)} // Dynamic route placeholder
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 cursor-pointer transition"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-gray-900">{event.name}</h3>
              <span className="text-xs text-gray-500">{ new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{event.ticketsSold} tiket terjual</span>
              <span>Rp {event.revenue.toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
