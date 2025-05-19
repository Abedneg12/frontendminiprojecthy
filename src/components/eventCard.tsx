'use client';
import Image from 'next/image';
import Link from 'next/link';
import { EventData } from '@/lib/interfaces/event.interface';

interface EventCardProps {
  event: EventData;
  imageUrl: string;
}

export default function EventCard({ event, imageUrl }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const hasSeating = event.description.includes('[SEATING]');
  const cleanDescription = event.description.replace('[SEATING]', '').trim();

  const SeatingIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v10H5V6zm5 3a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  return (
    <Link href={`/tickets?id=${event.name}`} className="border rounded-lg overflow-hidden hover:shadow-md transition-all block">
            <div className="relative h-40 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              unoptimized={imageUrl.startsWith('blob:')}
            />
          ) : (
            <div className="bg-gray-200 h-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-yellow-600">{event.name}</h3>
        <p className="text-sm font-light text-gray-500 mb-2">{event.category}</p>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            {startDate.toLocaleDateString('id-ID', dateOptions)} Â· {' '}
            {startDate.toLocaleTimeString('id-ID', timeOptions)} WIB
          </p>
          <p>{event.location}</p>
          <p className="font-medium mt-2 text-yellow-500">
            {event.paid ? `Rp ${(event.price).toLocaleString('id-ID')}` : 'Free'}
          </p>
        </div>
        
        <div className="mt-2 flex items-center gap-1">
          {hasSeating && <SeatingIcon className="w-4 h-4 text-yellow-500" />}
          <span className={hasSeating ? "text-yellow-600 text-sm" : "text-gray-600 text-sm"}>
            {event.remaining_seats} {hasSeating ? "seating" : "tickets"} left
          </span>
        </div>
      </div>
    </Link>
  );
}