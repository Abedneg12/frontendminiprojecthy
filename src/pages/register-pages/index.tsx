'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { registerSchema, RegisterInput } from '@/lib/validations/registerSchema';
import { z } from 'zod';
import toast from 'react-hot-toast';

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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleRoleSelect = (role: 'CUSTOMER' | 'ORGANIZER') => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(form);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, form);
      toast.success('Registrasi berhasil, silahkan cek email untuk verifikasi!');
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
      style={{ backgroundImage: "url('/onboard.png')" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-gray-800 mr-0 lg:mr-35">
        <h1 className="text-3xl font-bold text-center mb-6">Daftar Akun</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Input Fields */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500 transition-all duration-200"
                required
              />
              {errors[name as keyof RegisterInput] && (
                <p className="text-xs text-red-500 mt-1">{errors[name as keyof RegisterInput]}</p>
              )}
            </div>
          ))}

          {/* Role Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Pilih Kamu Sebagai Apa Disini</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'CUSTOMER', title: 'Customer', desc: 'Beli tiket event favoritmu.' },
                { value: 'ORGANIZER', title: 'Organizer', desc: 'Buat & kelola event-mu.' },
              ].map(({ value, title, desc }) => (
                <div
                  key={value}
                  onClick={() => handleRoleSelect(value as 'CUSTOMER' | 'ORGANIZER')}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                    form.role === value
                      ? 'border-yellow-500 bg-yellow-50 scale-105'
                      : 'border-gray-300 hover:border-yellow-400'
                  }`}
                >
                  <h3 className="text-base font-bold mb-1">{title}</h3>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          {/* Referral Code */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Kode Referral (opsional)</label>
            <input
              type="text"
              name="referral_code"
              value={form.referral_code}
              onChange={handleChange}
              placeholder="Contoh: REF-BUDI-0215"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition-all duration-200"
          >
            Daftar
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center mt-6 text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Masuk disini
          </a>
        </p>
      </div>
    </div>
  );
}
