'use client';

import Navbar from '@/components/Navbar';
/*Dashboard layout*/
import OrganizerSidebar from '@/components/organizer/OrganizerSidebar';
import React from 'react';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />
      
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
