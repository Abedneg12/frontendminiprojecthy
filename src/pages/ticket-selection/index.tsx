'use client';
import EventCard from '@/components/eventCard';
import { useState, useEffect } from 'react';
import { EventData } from '@/lib/interfaces/event.interface'; 
import Link from 'next/link';

export default function TicketSelection() {

  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState<number>(0);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const filteredEvents = events.filter(event => 
    selectedCategory ? event.category === selectedCategory : true
  );

  useEffect(() => {
    const urls: Record<string, string> = {};
    
    events.forEach((event: EventData) => { 
      if (event.image) {
        if (event.image instanceof File) {
          urls[event.name] = URL.createObjectURL(event.image);
        } else if (typeof event.image === 'string') {
          urls[event.name] = event.image;
        }
      }
    });

    setImageUrls(urls);

    return () => {
      Object.values(urls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [events]);

  useEffect(() => {
    const urls: Record<string, string> = {};
    
    events.forEach((event: EventData) => { 
      if (event.image) {
        if (event.image instanceof File) {
          urls[event.name] = URL.createObjectURL(event.image);
        } else if (typeof event.image === 'string') {
          urls[event.name] = event.image;
        }
      }
    });

    setImageUrls(urls);

    return () => {
      Object.values(urls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [events]);

  return (
    <div>
        <section className="py-6 sm:py-8 md:py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {['Art', 'Education', 'Festival', 'Music'].map((category, i) => (
              <span 
                key={i}
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  selectedCategory === category.toUpperCase() 
                    ? 'bg-yellow-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-500'
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.toUpperCase() 
                    ? null 
                    : category.toUpperCase()
                )}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

<section className="py-10 px-6 md:px-16 bg-white">
  <h2 className="text-2xl font-bold mb-8 text-gray-800">TICKETS FOR YOU</h2>
  {events.length === 0 ? (
    <p className="text-gray-600">No events available. Create your first event!</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredEvents.map(event => {

        const slug = event.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') 
          .replace(/\s+/g, '-') 
          .replace(/--+/g, '-'); 
        
        return (
        <Link href={`/tickets/${event.id}/${slug}`} passHref>
          <div 
            key={event.id} 
            onClick={() => window.location.href = `/tickets/${event.id}/${slug}`}
            className="cursor-pointer"
          >
            <EventCard 
              event={event} 
              imageUrl={event.image_url || ''} 
            />
          </div>
        </Link>
        );
      })}
    </div>
  )}
</section>
    </div>
  );
}

// 'use client';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/lib/redux/store';
// import EventCard from '@/components/eventCard';
// import { useState, useEffect } from 'react';


// export default function TicketSelection() {
//   const { events } = useSelector((state: RootState) => state.events);
//   const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const urls: Record<string, string> = {};
    
//     events.forEach(event => {
//       if (event.image) {
//         if (event.image instanceof File) {
//           urls[event.name] = URL.createObjectURL(event.image);
//         } else if (typeof event.image === 'string') {
//           urls[event.name] = event.image;
//         }
//       }
//     });

//     setImageUrls(urls);

//     return () => {
//       Object.values(urls).forEach(url => {
//         if (url.startsWith('blob:')) {
//           URL.revokeObjectURL(url);
//         }
//       });
//     };
//   }, [events]);

//   return (
//     <section className="py-10 px-6 md:px-16 bg-white">
//       <h2 className="text-2xl font-bold mb-8 text-gray-800">TICKETS FOR YOU</h2>
//       {events.length === 0 ? (
//         <p className="text-gray-600">No events available. Create your first event!</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {events.map(event => (
//             <EventCard 
//               key={event.name} 
//               event={event} 
//               imageUrl={imageUrls[event.name] || ''} 
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }