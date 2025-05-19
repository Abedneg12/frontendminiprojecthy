// src/components/DashboardCards.tsx
'use client';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
      <div className="text-sm text-gray-500 font-medium">{title}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {description && (
        <div className="text-xs text-gray-400 mt-1">{description}</div>
      )}
    </div>
  );
}
