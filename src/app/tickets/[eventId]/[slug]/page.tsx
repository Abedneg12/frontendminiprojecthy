'use client';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { addEvent } from '@/lib/redux/slices/eventDataSlice';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';


export default function TicketsPage({params,}:{params:{eventName:string};}) {
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { events, currentEvent } = useSelector((state: RootState) => state.events);
  const event = events.find(e => e.name.toLowerCase());
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  

  useEffect(() => {
    if(!event?.image){
      setImageUrl(null);
      return;
    }

    if(event.image instanceof File) {
      const url = URL.createObjectURL(event.image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(event.image);
    }
  }, [event?.image]);

  if (!event) {
    return notFound();
  }

  const handleButtonClick = () => {
    if (!currentEvent) return; 
    
    if (currentEvent.paid) {
      router.push(`/transaction?event=${encodeURIComponent(currentEvent.name)}`);
    } else {
      router.push(`/register?event=${encodeURIComponent(currentEvent.name)}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    
    if (eventId) { 
      const eventToAdd = events.find(event => event.name === eventId);
      
      if (eventToAdd) {
        dispatch(addEvent({
          id: eventToAdd.id, 
          name: eventToAdd.name,
          subtitle: eventToAdd.subtitle || "",
          description: eventToAdd.description || "",
          category: eventToAdd.category || "General",
          location: eventToAdd.location || "",
          paid: eventToAdd.paid || false,
          price: eventToAdd.price || 0,
          total_seats: eventToAdd.total_seats || 0,
          start_date: eventToAdd.start_date || new Date().toISOString(),
          end_date: eventToAdd.end_date || new Date().toISOString(),
          image: eventToAdd.image || null
        }));
      }
    }
  }, [dispatch, events]);

  useEffect(() => {
    if (currentEvent?.image) {
      if (currentEvent.image instanceof File) {
        const url = URL.createObjectURL(currentEvent.image);
        setImageUrl(url);
        
        return () => URL.revokeObjectURL(url);
      } else {
        setImageUrl(currentEvent.image);
      }
    } else {
      setImageUrl(null);
    }
  }, [currentEvent?.image]);

  if (!currentEvent) {
    return (
      <section className="py-10 px-6 md:px-16 bg-white">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </section>
    );
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const startTime = startDate.toLocaleTimeString('id-ID', timeOptions);
  const endTime = endDate.toLocaleTimeString('id-ID', timeOptions);
  
    return(
    <section className="py-10 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{currentEvent.name}</h1>
          {currentEvent.subtitle && (
            <h2 className="text-xl text-gray-600 mt-1">{currentEvent.subtitle}</h2>
          )}
          <p className="text-gray-500 mt-2">{currentEvent.description.substring(0,100)}...</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              {imageUrl ? (
                <Image 
                  src={imageUrl}
                  alt={currentEvent.name}
                  fill
                  className="object-cover"
                  unoptimized={currentEvent?.image instanceof File}
               />
              ) : (
                <span className="text-gray-500">Event Image</span>
              )}
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Event Details</h2>
              <p className="text-gray-600 mb-6">{currentEvent.description}</p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Date & Time</h3>
                <p className="text-gray-600">
                  {startDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} pukul {startTime}
                  <br />
                  sampai {endDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} pukul {endTime}
                </p>

                <h3 className="font-semibold text-lg mt-6 mb-3 text-gray-800">Location</h3>
                <p className="text-gray-600">{currentEvent.location}</p>
                <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map should be displayed here...if able.</span>
                </div>
              </div>
            </div>
          </div>
          
         
          {/* Ticket Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Tickets</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800">
                      {currentEvent.paid ? 'Paid Admission' : 'Free Admission'}
                    </h3>
                    {currentEvent.paid && (
                      <p className="text-yellow-600 text-xl font-semibold my-2">
                       Rp {(currentEvent.price).toLocaleString('id-ID')}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-3">
                      {currentEvent.category} Event
                    </p>
                    <p className="text-gray-500 text-sm">
                      {currentEvent.total_seats} seats available
                    </p>
                    <button
                    onClick={handleButtonClick}
                    disabled={!currentEvent} 
                    className={`mt-4 w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors ${
                    !currentEvent ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                    {currentEvent ? (currentEvent.paid ? 'Purchase Ticket' : 'Register') : 'Loading...'}
                   </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}