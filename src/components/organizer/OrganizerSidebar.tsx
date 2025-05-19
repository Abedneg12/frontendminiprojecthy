'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'My Profile', href: '/organizer/dashboard/profile-organizer' },
  { label: 'Dashboard', href: '/organizer/dashboard' },
  { label: 'My Events', href: '/organizer/dashboard/my-event' },
  { label: 'Transaction', href: '/organizer/dashboard/transaction' },
  { label: 'Statistics', href: '/organizer/dashboard/stats'}
];

export default function OrganizerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen px-6 py-8 font-montserrat">
      <h2 className="text-xl font-semibold text-yellow-600 mb-8">Organizer Panel</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md font-medium transition ${
              pathname === link.href
                ? 'bg-yellow-500 text-white'
                : 'text-gray-700 hover:bg-yellow-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
