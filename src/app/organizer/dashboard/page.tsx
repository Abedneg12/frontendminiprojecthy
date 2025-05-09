'use client';

import OrganizerSidebar from '@/components/organizer/OrganizerSidebar';
import DashboardCards from '@/components/organizer/DashboardCards';
import ChartSection from '@/components/organizer/ChartSection';
import TopEvents from '@/components/organizer/TopEvents';

export default function OrganizerDashboardPage() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-yellow-600">Dashboard Organizer</h1>
        <DashboardCards />
        <ChartSection />
        <TopEvents />
      </main>
    </div>
  );
}
