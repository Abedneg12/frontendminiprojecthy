
'use client';

import { SummaryCard } from '@/components/organizer/DashboardCards';
import TopEvents from '@/components/organizer/TopEvents';
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserFromToken, isAuthenticated } from '@/utils/auth';
import { toast } from 'react-toastify';

export default function OrganizerDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Anda harus login terlebih dahulu.')
      router.push('/login')
      return
    }
    const user = getUserFromToken()
    if (!user || user.role !== 'ORGANIZER') {
      toast.error('Hanya organizer yang dapat mengakses halaman ini.')
      router.push('/login')
    }
  }, [router])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-yellow-600">Dashboard Organizer</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user?.full_name}</p>
          </div>
          <img
            src={user?.profile_picture || '/avatar.png'}
            alt="Organizer Avatar"
            className="w-10 h-10 rounded-full border-2 border-yellow-500"
          />
        </div>

        {/* Notifikasi Terkini */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Notifikasi Terkini</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-yellow-600 transition cursor-pointer">
              ✅ Event "Jazz Night" berhasil diverifikasi
            </li>
            <li
              onClick={() => router.push('/organizer/dashboard/transaction')}
              className="hover:text-yellow-600 transition cursor-pointer"
            >
              💳 Transaksi REF#12345 ditolak, kupon dan seat dikembalikan
            </li>
            <li
              onClick={() => router.push('/organizer/dashboard/stats')}
              className="hover:text-yellow-600 transition cursor-pointer"
            >
              👥 102 tiket terjual untuk "Tech Conference 2025"
            </li>
          </ul>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => router.push('/organizer/dashboard/my-event')}
            className="cursor-pointer hover:shadow-md transition"
          >
            <SummaryCard title="Total Event" value="12" />
          </div>
          <div
            onClick={() => router.push('/organizer/dashboard/transaction')}
            className="cursor-pointer hover:shadow-md transition"
          >
            <SummaryCard title="Total Transaksi" value="147" />
          </div>
          <div
            onClick={() => router.push('/organizer/dashboard/stats')}
            className="cursor-pointer hover:shadow-md transition"
          >
            <SummaryCard title="Total Tiket Terjual" value="3.021" />
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-lg shadow p-4">
          <TopEvents />
        </div>
      </main>
    </div>
  );
}