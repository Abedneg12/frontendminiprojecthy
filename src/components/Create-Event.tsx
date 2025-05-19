'use client';
import { useState, useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Voucher } from '@/lib/interfaces/voucher.interface';
import { createEventSchema } from '@/lib/validations/createEventSchema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserFromToken } from '@/utils/auth';

export default function CreateEventForm() {
    const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Anda harus login terlebih dahulu.')
      router.push('/login')
      return
    }
    const user = getUserFromToken()
    if (!user || user.role !== 'ORGANIZER') {
      toast.error('Hanya organizer yang dapat mengakses halaman ini.')
      router.push('/login')
    }
  }, [router])
  
  const [eventData, setEventData] = useState({
    name: '',
    subtitle: '',
    description: '',
    category: '',
    location: '',
    paid: false,
    price: 0,
    start_date: '',
    end_date: '',
    total_seats: 0,
    image: null as File | null,
    previewImage: '',
    vouchers: [] as Voucher[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSeating, setHasSeating] = useState(false);
  const [activeSection, setActiveSection] = useState<'Event Details' | 'Promotions'>('Event Details');
  const [newVoucher, setNewVoucher] = useState<Voucher>({
    code: '',
    discount_amount: 0,
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : 
              value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventData({
        ...eventData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
      
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const handleAddVoucher = () => {
    setEventData(prev => ({
      ...prev,
      vouchers: [...prev.vouchers, newVoucher]
    }));
    setNewVoucher({
      code: '',
      discount_amount: 0,
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
    });
  };

  const removeVoucher = (index: number) => {
    setEventData(prev => ({
      ...prev,
      vouchers: prev.vouchers.filter((_, i) => i !== index)
    }));
  };

  const validateForm = async (): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
    try {

      const formData = {
        name: eventData.name,
        subtitle: eventData.subtitle,
        description: eventData.description,
        image: eventData.image,
        category: eventData.category,
        location: eventData.location,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        paid: eventData.paid,
        price: eventData.paid ? eventData.price : undefined,
      };


      await createEventSchema.parseAsync(formData);
      
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        

        error.errors.forEach((err) => {
          const path = err.path[0];
          if (path) {
            formattedErrors[path] = err.message;
          }
        });

        return { isValid: false, errors: formattedErrors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const { isValid, errors: validationErrors } = await validateForm();
    
    if (!isValid) {
      setErrors(validationErrors || {});
      const firstError = Object.values(validationErrors ?? {})[0];
      toast.error(firstError || 'Please complete all required fields');
      return;
    }

    try {
      const formData = new FormData();
      const finalDescription = hasSeating 
        ? `${eventData.description} [SEATING]` 
        : eventData.description;

      formData.append('name', eventData.name);
      formData.append('subtitle', eventData.subtitle);
      formData.append('description', finalDescription);
      formData.append('category', eventData.category);
      formData.append('location', eventData.location);
      formData.append('paid', String(eventData.paid));
      formData.append('price', String(eventData.price));
      formData.append('start_date', eventData.start_date);
      formData.append('end_date', eventData.end_date);
      formData.append('total_seats', String(eventData.total_seats));
      if (eventData.image) {
        formData.append('image', eventData.image);
      }

      if (eventData.vouchers.length > 0) {
        const voucher = eventData.vouchers[0];
        formData.append('voucher_code', voucher.code);
        formData.append('voucher_discount', voucher.discount_amount.toString());
        formData.append('voucher_start', voucher.start_date);
        formData.append('voucher_end', voucher.end_date);
      }

    // console.log for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events/create`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Validation failed");
      }

      toast.success("Event created successfully!");
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || "Failed to create Event");
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-white">
        <div className="bg-white max-w-4xl mx-auto pt-35 px-20 py-12 font-montserrat">
          <h1 className="text-3xl font-bold mb-2 text-yellow-600">Create your Event</h1>
          <p className="text-gray-600 mb-8">Fill in the details below to create your Event</p>
          
          <div className="flex overflow-x-auto pb-2 mb-6 md:mb-8 scrollbar-hide">
            <div className="flex space-x-1 md:space-x-4 min-w-max">
              <button
                type="button"
                onClick={() => setActiveSection('Event Details')}
                className={`px-3 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                  activeSection === 'Event Details'
                  ? "text-yellow-500 border-b-2 border-yellow-600" : "text-gray-500 hover:text-yellow-500"
                }`}>
                Event Details
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('Promotions')}
                className={`px-3 py-2 text-sm md:text-base font-medium whitespace-nowrap ${
                  activeSection === 'Promotions'
                  ? "text-yellow-500 border-b-2 border-yellow-600" : "text-gray-500 hover:text-yellow-500"
                }`}>
                Promotions
              </button>
            </div>
          </div>

          {activeSection === 'Event Details' && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your event name"
                  value={eventData.name}
                  onChange={handleInputChange}
                  className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  name="subtitle"
                  placeholder="A short description about your event"
                  value={eventData.subtitle}
                  onChange={handleInputChange}
                  className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.subtitle ? 'border-red-500' : ''
                  }`}
                />
                {errors.subtitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {eventData.previewImage ? (
                    <div className="w-full h-64 relative rounded-lg overflow-hidden mb-4">
                      <img
                        src={eventData.previewImage}
                        alt="Preview"
                        className="object-cover w-full h-full"
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
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="mt-5">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                    >
                      Select Image
                    </label>
                    <p className="mt-5 text-xs text-gray-500">Recommended: 1200x630px JPG or PNG (max 5MB)</p>
                  </div>
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter event location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.location ? 'border-red-500' : ''
                  }`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={eventData.start_date}
                  onChange={(e) => {
                    setEventData({...eventData, start_date: e.target.value});
                    if (errors.start_date) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.start_date;
                        return newErrors;
                      });
                    }
                  }}
                  className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.start_date ? 'border-red-500' : ''
                  }`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={eventData.end_date}
                  onChange={(e) => {
                    setEventData({...eventData, end_date: e.target.value});
                    if (errors.end_date) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.end_date;
                        return newErrors;
                      });
                    }
                  }}
                  className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.end_date ? 'border-red-500' : ''
                  }`}
                  min={eventData.start_date}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleInputChange}
                  className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 appearance-none pr-8 ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="MUSIC">Music</option>
                  <option value="ART">Art</option>
                  <option value="EDUCATION">Education</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-5 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label className="mt-8 block text-sm font-medium text-gray-700 mb-1">Overview</label>
                <textarea
                  name="description"
                  placeholder="Provide detailed description about your event"
                  value={eventData.description}
                  onChange={handleInputChange}
                  className={`text-gray-500 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-h-[120px] ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  rows={5}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              
              <div>
                <h2 className="pt-10 text-2xl font-bold mb-2 text-yellow-600">Tickets</h2>
                <div className="pt-5 flex">
                  <input
                    type="checkbox"
                    id="paid"
                    checked={eventData.paid}
                    onChange={(e) => setEventData({...eventData, paid: e.target.checked})}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="paid"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Is this a paid event?
                  </label>
                </div>
                
                <div className="flex pt-3">
                  <input
                    type="checkbox"
                    id="has_seating"
                    checked={hasSeating}
                    onChange={() => setHasSeating(!hasSeating)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="has_seating"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Does this event have seating areas?
                  </label>
                </div>
                
                {eventData.paid && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-yellow-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
                      <input
                        type="number"
                        name="price"
                        value={eventData.price || ''}
                        onChange={handleInputChange}
                        min="1000"
                        step="1000"
                        className={`text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                          errors.price ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        name="total_seats"
                        value={eventData.total_seats || ''}
                        onChange={handleInputChange}
                        min="1"
                        className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeSection === "Promotions" && (
            <div className="space-y-8">
              <h2 className="text-yellow-600 text-xl font-semibold">Promotions & Vouchers (optional)</h2>
              <p className="text-gray-600">Add discount vouchers for your event</p>
              
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-medium text-yellow-500">Add New Voucher</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label>
                    <input
                      type="text"
                      value={newVoucher.code}
                      onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                      className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="e.g. PROMO10"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (IDR)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={newVoucher.discount_amount === 0 ? '' : newVoucher.discount_amount.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                          setNewVoucher({ 
                            ...newVoucher, 
                            discount_amount: value === '' ? 0 : parseInt(value) 
                          });
                        }
                      }}
                      className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={newVoucher.start_date}
                      onChange={(e) => setNewVoucher({ ...newVoucher, start_date: e.target.value })}
                      className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={newVoucher.end_date}
                      onChange={(e) => setNewVoucher({ ...newVoucher, end_date: e.target.value })}
                      className="text-gray-500 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      min={newVoucher.start_date}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddVoucher}
                  disabled={!newVoucher.code || !newVoucher.discount_amount || !newVoucher.start_date || !newVoucher.end_date}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Voucher
                </button>
              </div>
              
              {eventData.vouchers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-yellow-600 text-xl font-semibold">Active Vouchers</h2>
                  {eventData.vouchers.map((voucher, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-yellow-600">{voucher.code}</p>
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                              Rp {voucher.discount_amount.toLocaleString('id-ID')} discount
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {new Date(voucher.start_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - {' '}
                            {new Date(voucher.end_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeVoucher(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-12 flex justify-end space-x-4">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg transition-colors ${
                Object.keys(errors).length === 0
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Publish Event
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}