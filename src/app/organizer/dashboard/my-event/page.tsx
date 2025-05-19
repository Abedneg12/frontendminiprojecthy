'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { EventStatus, EventData } from '@/lib/interfaces/event.interface';

const categories = ['FESTIVAL', 'MUSIC', 'ART', 'EDUCATION'] as const;
const statusFilters = ['All', 'Sedang Berlangsung', 'Akan Datang', 'Selesai'] as const;

export default function MyEventsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<EventStatus>({ events: [], currentEvent: null });
  const [categoryFilter, setCategoryFilter] = useState<'All' | typeof categories[number]>('All');
  const [statusFilter, setStatusFilter] = useState<typeof statusFilters[number]>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EventData>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizer/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json.success) {
          setStatus({ events: json.data, currentEvent: null });
        } else {
          throw new Error(json.message);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const now = dayjs();
  const filtered = status.events.filter(evt => {
    const start = dayjs(evt.start_date);
    const end = dayjs(evt.end_date);
    const byCat = categoryFilter === 'All' || evt.category === categoryFilter;
    const byStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Sedang Berlangsung' && now.isAfter(start) && now.isBefore(end)) ||
      (statusFilter === 'Selesai' && now.isAfter(end)) ||
      (statusFilter === 'Akan Datang' && now.isBefore(start));
    return byCat && byStatus;
  });

  const openModal = (evt: EventData) => {
    setStatus(s => ({ ...s, currentEvent: evt }));
    setFormData(evt);
    setIsEditing(false);
    setNewImageFile(null);
  };

  const handleChange = (field: keyof EventData, val: any) => {
    setFormData(fd => ({ ...fd!, [field]: val }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!status.currentEvent) return;
    const token = localStorage.getItem('token');
    const payload = {
      name: formData.name,
      subtitle: formData.subtitle,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      paid: formData.paid,
      price: formData.price,
      total_seats: formData.total_seats,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/update/${status.currentEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) {
      alert(json.message);
      return;
    }
    const updated = json.data as EventData;
    setStatus(s => ({
      events: s.events.map(ev => (ev.id === updated.id ? updated : ev)),
      currentEvent: updated,
    }));
    setIsEditing(false);
  };

    const handleDelete = async () => {
      if (!status.currentEvent) return;
      const confirm = window.confirm('Apakah Anda yakin ingin menghapus event ini?');
      if (!confirm) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${status.currentEvent.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.message);
        return;
      }
      setStatus(s => ({
        events: s.events.filter(ev => ev.id !== status.currentEvent!.id),
        currentEvent: null,
      }));
    };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const uploadNewImage = async () => {
    if (!newImageFile || !status.currentEvent) return;
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('image', newImageFile);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${status.currentEvent.id}/image`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const json = await res.json();
    if (!json.success) {
      alert(json.message);
      return;
    }
    const updated = json.data as EventData;
    setStatus(s => ({
      events: s.events.map(ev => (ev.id === updated.id ? updated : ev)),
      currentEvent: updated,
    }));
    setNewImageFile(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-montserrat">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">Event Saya</h1>
        <p className="text-gray-600 text-sm mb-6">Kelola semua event yang Anda buat sebagai organizer.</p>

        <div className="flex flex-wrap gap-4 mb-6">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              className={`px-4 py-1 rounded-full text-sm border ${
                categoryFilter === cat ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setCategoryFilter(cat as typeof categoryFilter)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mb-8">
          {statusFilters.map(stat => (
            <button
              key={stat}
              className={`px-4 py-1 rounded-full text-sm border ${
                statusFilter === stat ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => setStatusFilter(stat)}
            >
              {stat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map(evt => (
            <div
              key={evt.id}
              onClick={() => openModal(evt)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden border border-gray-200"
            >
              <img src={evt.image_url || '/placeholder.jpg'} alt={evt.name} className="w-full h-40 object-cover" />
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold text-black">{evt.name}</h2>
                <p className="text-sm italic text-gray-500">{evt.subtitle}</p>
                <p className="text-sm text-gray-600">{evt.location}</p>
                <p className="text-sm text-gray-600">
                  {dayjs(evt.start_date).format('DD MMM')} - {dayjs(evt.end_date).format('DD MMM YYYY')}
                </p>
                <p className="text-sm text-gray-700">
                  Seat: {evt.remaining_seats}/{evt.total_seats}
                </p>
                <p className="text-sm text-blue-600 underline cursor-pointer"
                  onClick={() => router.push(`/organizer/dashboard/my-event/${evt.id}/participants`)}>
                  View Participants
                </p>
                <p className="text-sm text-gray-700">{evt.paid ? `Rp${evt.price.toLocaleString()}` : 'Gratis'}</p>
              </div>
            </div>
          ))}
        </div>

        {status.currentEvent && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-screen">
              <button
                onClick={() => setStatus(s => ({ ...s, currentEvent: null }))}
                className="absolute top-2 right-1 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <div className="relative mb-4">
                <label htmlFor="imageUpload" className=" text-blue-500 absolute top-2 right-2 bg-white bg-opacity-80 px-3 py-1 rounded text-sm cursor-pointer hover:bg-opacity-100">
                  Ubah Gambar
                </label>
                <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <img
                  src={status.currentEvent.image_url || '/placeholder.jpg'}
                  alt={status.currentEvent.name}
                  className="w-full h-60 object-cover rounded"
                />
              </div>
              {newImageFile && (
                <div className="mb-4">
                  <button onClick={uploadNewImage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Upload
                  </button>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className=" text-black text-sm font-medium">Nama Event</span>
                    <input className="text-black mt-1 block w-full border rounded p-2" value={formData.name} onChange={e => handleChange('name', e.target.value)} disabled={!isEditing} />
                  </label>
                  <label className="block">
                    <span className=" text-black text-sm font-medium">Sub Judul</span>
                    <input className="text-black mt-1 block w-full border rounded p-2" value={formData.subtitle} onChange={e => handleChange('subtitle', e.target.value)} disabled={!isEditing} />
                  </label>
                </div>
                <label className="block">
                  <span className=" text-black text-sm font-medium">Deskripsi</span>
                  <textarea className="text-black mt-1 block w-full border rounded p-2" rows={3} value={formData.description} onChange={e => handleChange('description', e.target.value)} disabled={!isEditing} />
                </label>
                <label className="block">
                  <span className=" text-black text-sm font-medium">Kategori</span>
                  <select className="text-black mt-1 block w-full border rounded p-2" value={formData.category} onChange={e => handleChange('category', e.target.value)} disabled={!isEditing}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className=" text-black text-sm font-medium">Lokasi</span>
                  <input className="text-black mt-1 block w-full border rounded p-2" value={formData.location} onChange={e => handleChange('location', e.target.value)} disabled={!isEditing} />
                </label>
                <label className="font-bold text-black block">
                  <span className=" text-black text-sm font-medium">Harga</span>
                  <input type="number" className="mt-1 block w-full border rounded p-2" value={formData.price} onChange={e => handleChange('price', Number(e.target.value))} disabled={!isEditing} />
                </label>
                <label className="font-bold text-black blockblock">
                  <span className=" text-black text-sm font-medium">Total Seats</span>
                  <input type="number" className="mt-1 block w-full border rounded p-2" value={formData.total_seats} onChange={e => handleChange('total_seats', Number(e.target.value))} disabled={!isEditing} />
                </label>
                <label className="text-black block">
                  <span className="text-sm font-medium">Tanggal Mulai</span>
                  <input type="datetime-local" className="mt-1 block w-full border rounded p-2" value={dayjs(formData.start_date).format('YYYY-MM-DDTHH:mm')} onChange={e => handleChange('start_date', new Date(e.target.value))} disabled={!isEditing} />
                </label>
                <label className="text-black block">
                  <span className="text-sm font-medium">Tanggal Selesai</span>
                  <input type="datetime-local" className="mt-1 block w-full border rounded p-2" value={dayjs(formData.end_date).format('YYYY-MM-DDTHH:mm')} onChange={e => handleChange('end_date', new Date(e.target.value))} disabled={!isEditing} />
                </label>
                </form>
                <div className="mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Event
                </button>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className=" bg-blue-600 px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!isEditing}
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
           