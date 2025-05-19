'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Participant {
  id: number;
  name: string;
  email: string;
  tickets_quantity: number;
  totalPayment: number;
}

export default function ParticipantsPage() {
  const params = useParams();
  const eventId = typeof params?.eventId === 'string' ? params.eventId : '';

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    setEventName('Tech Conference 2025');
    setParticipants([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        tickets_quantity: 2,
        totalPayment: 750000,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        tickets_quantity: 2,
        totalPayment: 300000,
      },
    ]);
  }, [eventId]);

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10 sm:px-12 md:px-20 font-montserrat">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-600 mb-1 tracking-tight">Daftar Peserta</h1>
          <p className="text-gray-700 text-sm">Event: <span className="font-semibold">{eventName}</span></p>
        </header>

        <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-xl bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Nama</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Tiket</th>
                <th className="px-6 py-4 text-left">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500 italic">Belum ada peserta.</td>
                </tr>
              ) : (
                participants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4">{p.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {p.tickets_quantity} tiket
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Rp{p.totalPayment.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

