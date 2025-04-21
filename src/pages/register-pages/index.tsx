'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    referral_code: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/register', form);
      alert('Registrasi berhasil!');
      router.push('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal registrasi');
    }
  };

  return (
  <div
  className="min-h-screen w-full bg-cover bg-center flex justify-end items-center px-6 lg:px-12 font-montserrat"
  style={{ backgroundImage: "url('/login1.png')" }}
    >
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-gray-800 mr-0 lg:mr-35">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Akun</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Nama lengkap"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Kode Referral (opsional)</label>
            <input
              type="text"
              name="referral_code"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Contoh: REF-BUDI-0215"
              value={form.referral_code}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            Daftar
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}