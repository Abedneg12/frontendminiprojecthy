'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loginSchema, LoginInput } from '@/lib/validations/loginSchema';
import { z } from 'zod';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login as loginAction } from '@/lib/redux/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<LoginInput>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(form); // Validasi form
      const res = await axios.post('http://localhost:5000/auth/login', form);
      const { token, user } = res.data.data;

      dispatch(loginAction({ user, token }));
      router.push('/');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof LoginInput;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(error.response?.data?.message || 'Login gagal');
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-end items-center px-6 lg:px-12 font-montserrat"
      style={{ backgroundImage: "url('/login1.png')" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-gray-800 mr-0 lg:mr-35">
        <h1 className="text-3xl font-bold text-center mb-6">Log in</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500 transition-all duration-200"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500 transition-all duration-200"
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold rounded"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Daftar, yuk!
          </a>
        </p>
      </div>
    </div>
  );
}
