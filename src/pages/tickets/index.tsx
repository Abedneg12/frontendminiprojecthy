// 'use client';

// import Image from 'next/image';



// interface Event {
//   id: string;
//   title: string;
//   category: string;
//   date: string;
//   time: string;
//   location: string;
//   price: string;
// }

// export default function Tickets() {
//   const eventImages = [
//     '/placeholder4.jpg',
//     '/placeholder5.jpg',
//     '/placeholder6.jpg',
//     '/placeholder3.jpg'
//   ];

//   const events: Event[] = [
//     {
//       id: '1',
//       title: 'TITLE',
//       category: 'Category',
//       date: 'DD/MM/YY',
//       time: '00:00 WIB',
//       location: 'Location',
//       price: 'Free'
//     },
//     {
//       id: '2',
//       title: 'TITLE',
//       category: 'Category',
//       date: 'DD/MM/YY',
//       time: '00:00 WIB',
//       location: 'Location',
//       price: 'Free'
//     },
//     {
//         id: '3',
//         title: 'TITLE',
//         category: 'Category',
//         date: 'DD/MM/YY',
//         time: '00:00 WIB',
//         location: 'Location',
//         price: 'Free'
//       },
//       {
//         id: '4',
//         title: 'TITLE',
//         category: 'Category',
//         date: 'DD/MM/YY',
//         time: '00:00 WIB',
//         location: 'Location',
//         price: 'Free'
//       },

//   ];

//   return (
//     <section className="py-10 px-6 md:px-16 bg-white">
//       <h2 className="text-2xl font-bold mb-8 text-gray-800">UPCOMING EVENTS</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {events.map((event, index) => (
//           <div key={event.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
//             <div className="relative h-40 w-full">
//               <Image
//                 src={eventImages[index % eventImages.length]}
//                 alt={event.title}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
//               <p className="text-sm font-light text-gray-500 mb-2">{event.category}</p>
//               <div className="space-y-1 text-sm text-gray-600">
//                 <p>{event.date} · {event.time}</p>
//                 <p>{event.location}</p>
//                 <p className="font-medium mt-2">{event.price}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }