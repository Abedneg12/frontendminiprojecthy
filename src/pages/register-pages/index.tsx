'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { registerSchema, RegisterInput } from '@/lib/validations/registerSchema';
import { z } from 'zod';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterInput>({
    full_name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    referral_code: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(form); // Validasi
      await axios.post('http://localhost:5000/auth/register', form);
      alert('Registrasi berhasil!');
      router.push('/login');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof RegisterInput;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(error.response?.data?.message || 'Gagal registrasi');
      }
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
          {/* Input fields */}
          {[
            { label: 'Nama Lengkap', name: 'full_name', type: 'text', placeholder: 'Nama lengkap' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name as keyof RegisterInput] as string}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              {errors[name as keyof RegisterInput] && (
                <p className="text-sm text-red-500">{errors[name as keyof RegisterInput]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
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
              value={form.referral_code}
              onChange={handleChange}
              placeholder="Contoh: REF-BUDI-0215"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
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
