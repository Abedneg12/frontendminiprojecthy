'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token);
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login gagal');
    }
  };

  return (
  <div
  className="min-h-screen w-full bg-cover bg-center flex justify-end items-center px-6 lg:px-12 font-montserrat"
  style={{ backgroundImage: "url('/login1.png')" }}
    >
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-gray-800 mr-0 lg:mr-35">
        <h1 className="text-3xl font-bold text-center mb-6">Log in</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
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