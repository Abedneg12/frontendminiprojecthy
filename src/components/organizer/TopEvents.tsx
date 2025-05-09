// src/pages/organizer/dashboard/components/TopEvents.tsx
'use client';

interface EventData {
  id: number;
  name: string;
  ticketsSold: number;
  revenue: number;
}

const dummyTopEvents: EventData[] = [
  { id: 1, name: 'Music Festival 2025', ticketsSold: 320, revenue: 32000000 },
  { id: 2, name: 'Tech Conference', ticketsSold: 250, revenue: 27500000 },
  { id: 3, name: 'Art Exhibition', ticketsSold: 180, revenue: 9000000 },
  { id: 4, name: 'Charity Gala Night', ticketsSold: 120, revenue: 18000000 },
  { id: 5, name: 'Startup Pitching Day', ticketsSold: 95, revenue: 14250000 }
];

export default function TopEvents() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Events</h2>
      <ul className="space-y-3 text-sm text-gray-700">
        {dummyTopEvents.map((event) => (
          <li
            key={event.id}
            className="flex justify-between items-center p-3 rounded-md border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-semibold">{event.name}</p>
              <p className="text-xs text-gray-500">
                {event.ticketsSold} tiket terjual – Rp {event.revenue.toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
