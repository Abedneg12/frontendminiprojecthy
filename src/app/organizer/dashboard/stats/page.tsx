'use client';

import { Chart } from '@/components/organizer/ChartSection';
import { SummaryCard } from '@/components/organizer/DashboardCards';

export default function OrganizerStatsPage() {
  return (
    <section className="min-h-screen bg-white px-6 py-12 sm:px-12 md:px-20 lg:px-32 font-montserrat">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-yellow-600 mb-8">Statistik Event</h1>

        {/* filter tahun, bulan, dan tanggal */}
        <div className="flex flex-wrap gap-4 items-center mb-8">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tahun</label>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700"
              defaultValue="2025"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bulan</label>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700"
              defaultValue=""
            >
              <option value="">Semua</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Bagian Summary dan Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard title="Total Event" value={12} />
          <SummaryCard title="Total Tiket Terjual" value={327} />
          <SummaryCard title="Pendapatan" value={12500000} />
          <SummaryCard title="Total Transaksi" value={500} />
          <SummaryCard title="Total Review" value={1500} />
          <SummaryCard title="Rating Rata-rata" value={4.5} />
        </div>

        <Chart />

      </div>
    </section>
  );
}

