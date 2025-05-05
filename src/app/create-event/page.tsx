'use client';
import { useState } from 'react';
import Image from 'next/image';
import SeatImport, { useSeatImport, Seat } from '@/pages/seating';

export default function CreateEventPage() {

  const isFormValid = () => {
    if (!eventData.title.trim()) return false;
    if (!eventData.shortDescription.trim()) return false;
    if (!eventData.startDate) return false;
    if (!eventData.location.trim()) return false;
    if (!eventData.previewImage) return false;
    
    if (eventData.tickets.length === 0) return false;
    
    return eventData.tickets.every(ticket => 
      ticket.type.trim() !== '' && 
      ticket.price > 0 && 
      ticket.quantity > 0
    );
  };

  const [eventData, setEventData] = useState({
    title: '',
    shortDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    showMap: false,
    overview: '',
    ageRestriction: '',
    doorTime: '',
    pickupInfo: '',
    category: '',
    image: null as File | null,
    previewImage: '',
    tickets: [] as Array<{
      type: string;
      price: number;
      quantity: number;
      description: string;
    }>,
      faqs: [] as Array<{
      question: string;
      answer: string;
    }>,
  });

  const [activeSection, setActiveSection] = useState<'details' | 'tickets' | 'promotions'>('details');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newTicket, setNewTicket] = useState({
    type: '',
    price: 0,
    quantity: 0,
    description: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventData({
        ...eventData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setEventData({
        ...eventData,
        faqs: [...eventData.faqs, newFaq],
      });
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleAddTicket = () => {
    if (newTicket.type && newTicket.price >= 0) {
      setEventData({
        ...eventData,
        tickets: [...eventData.tickets, newTicket],
      });
      setNewTicket({
        type: '',
        price: 0,
        quantity: 0,
        description: '',
      });
    }
  };

  const { seats, handleFileUpload, error } = useSeatImport();
  

  return (
    <div className="min-h-screen bg-white">
    <div className="bg-white max-w-4xl mx-auto pt-35 px-20 py-12 font-montserrat">
      <h1 className="text-3xl font-bold mb-2 text-yellow-600">Create Your Event</h1>
      <p className="text-gray-600 mb-8">Fill in the details below to list your event</p>
<div className="flex overflow-x-auto pb-2 mb-6 md:mb-8 scrollbar-hide">
  <div className="flex space-x-1 md:space-x-4 min-w-max">
    <button
      onClick={() => setActiveSection('details')}
      className={`px-3 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
        activeSection === 'details'
          ? 'text-yellow-500 border-b-2 border-yellow-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Event Details
    </button>
    <button
      onClick={() => setActiveSection('tickets')}
      className={`px-3 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
        activeSection === 'tickets'
          ? 'text-yellow-500 border-b-2 border-yellow-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Tickets
    </button>
    <button
      onClick={() => setActiveSection('promotions')}
      className={`px-3 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
        activeSection === 'promotions'
          ? 'text-yellow-500 border-b-2 border-yellow-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Promotions
    </button>
  </div>
</div>

      {activeSection === 'details' && (
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter your event title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={eventData.shortDescription}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="A short and sweet sentence about your event"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{eventData.shortDescription.length}/100 characters</p>
            </div>


            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      {eventData.previewImage ? (
        <div className="w-full h-64 relative rounded-lg overflow-hidden mb-4">
          <Image
            src={eventData.previewImage}
            alt="Event preview"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">Drag & drop your image here</p>
          <p className="text-xs text-gray-400 mt-1">or</p>
        </div>
      )}
      
      <label className="cursor-pointer inline-block">
        <span className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
          Select Image
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
      
      <p className="text-xs text-gray-500">
        Recommended: 1200x630px JPG or PNG (max 5MB)
      </p>
    </div>
  </div>
</div>
          </div>

          <div className="space-y-4">
            <h2 className="text-yellow-600 text-xl font-semibold">Date and Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  className="text-gray-400 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={eventData.endDate}
                  onChange={handleInputChange}
                  className="text-gray-400 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleInputChange}
                  className="text-gray-400 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleInputChange}
                  className="text-gray-400 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-yellow-600 text-xl font-semibold">Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter a location"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showMap"
                name="showMap"
                checked={eventData.showMap}
                onChange={(e) => setEventData({ ...eventData, showMap: e.target.checked })}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="showMap" className="ml-2 block text-sm text-gray-700">
                Show map on event page
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-yellow-600 text-xl font-semibold">Overview</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="overview"
                value={eventData.overview}
                onChange={handleInputChange}
                rows={5}
                className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Provide more details about your event..."
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleInputChange}
              className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Select a category</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts & Theater</option>
              <option value="food">Food & Drink</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
            </select>
          </div>
        </div>
      )}

{activeSection === 'tickets' && (
  <div className="space-y-8">
    <h2 className="text-yellow-600 text-xl font-semibold">Ticket Types</h2>

    <div className="space-y-4">
  {eventData.tickets.map((ticket, index) => (
    <div key={index} className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-yellow-600">{ticket.type}</p>
          <p className="text-gray-600">
            Rp {ticket.price.toLocaleString('id-ID')} · {ticket.quantity} available
          </p>
          {ticket.description && <p className="text-gray-500 mt-1">{ticket.description}</p>}
        </div>
        <button className="text-red-500 hover:text-red-700">
          Remove
        </button>
      </div>
    </div>
  ))}
</div>

    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-gray-600 font-medium mb-4">Seating Arrangement (Optional)</h3>
      <SeatImport />
      {seats.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Imported Seats Preview</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {seats.slice(0, 4).map((seat, i) => (
              <div key={i} className="text-xs p-2 border rounded">
                <p>{seat.section} {seat.row}{seat.number}</p>
                <p>Rp {seat.price.toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
          {seats.length > 4 && (
            <p className="text-xs text-gray-500 mt-1">
              + {seats.length - 4} more seats imported
            </p>
          )}
        </div>
      )}
    </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-gray-600 font-medium">Add New Ticket Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
                <input
                  type="text"
                  value={newTicket.type}
                  onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                  className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="e.g. General Admission"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({ ...newTicket, price: parseFloat(e.target.value) || 0 })}
                  className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={newTicket.quantity}
                  onChange={(e) => setNewTicket({ ...newTicket, quantity: parseInt(e.target.value) || 0 })}
                  className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="e.g. Includes access to main event"
                />
              </div>
            </div>
            <button
              onClick={handleAddTicket}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
            >
              Add Ticket Type
            </button>
          </div>
        </div>
      )}

      {activeSection === 'promotions' && (
        <div className="space-y-8">
          <h2 className="text-yellow-600 text-xl font-semibold">Promotions & Vouchers</h2>
          <p className="text-gray-600">Otw bang, bentar yh msih bingung</p>
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-gray-500">Promotion features will be available soon</p>
          </div>
        </div>
      )}

      <div className="mt-12 flex justify-end space-x-4">
        <button className="text-gray-500 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Save Draft
        </button>
        <button className={`px-6 py-2 ${
        isFormValid() 
          ? 'bg-yellow-500 hover:bg-yellow-600' 
          : 'bg-gray-300 cursor-not-allowed'
         } text-white rounded-lg`}
        disabled={!isFormValid()}
        >
  Publish Event
</button>
  {!isFormValid() && (
    <div className="absolute hidden group-hover:block bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded">
      {eventData.tickets.length === 0 
        ? "Please add at least one ticket" 
        : "Please complete all required fields"}
    </div>
  )}
        
      </div>
    </div>
    </div>
  );
}