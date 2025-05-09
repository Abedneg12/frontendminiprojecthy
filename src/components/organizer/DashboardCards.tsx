// src/pages/organizer/dashboard/components/DashboardCards.tsx
'use client';

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="flex flex-col items-start p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200">
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function DashboardCards() {
  // Untuk testing awal, pakai dummy data
  const stats = [
    { label: 'Total Events', value: 12 },
    { label: 'Total Transactions', value: 87 },
    { label: 'Revenue', value: 'Rp 12.450.000' },
    { label: 'Tickets Sold', value: 324 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
