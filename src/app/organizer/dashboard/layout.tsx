'use client';

import Navbar from '@/components/Navbar';
/*Dashboard layout*/
import OrganizerSidebar from '@/components/organizer/OrganizerSidebar';
import React from 'react';
import StoreProvider from '@/lib/redux/storeProvider';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StoreProvider>
        <OrganizerSidebar />
        <div className="flex-1 p-6">{children}</div>
      </StoreProvider>
    </div>
  );
}
