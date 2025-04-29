'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setUserFromToken } from '@/lib/redux/slices/authSlice';
import { getUserFromToken } from '@/utils/auth';

export default function EmailVerifiedSuccessPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      dispatch(setUserFromToken({ ...user, is_verified: true }));
    }

    // Redirect ke home atau dashboard setelah 3 detik
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 text-center">
      <div className="bg-white p-10 rounded shadow-md">
        <h1 className="text-2xl font-bold text-green-600">Email Terverifikasi!</h1>
        <p className="mt-3 text-gray-600">Akunmu sudah berhasil diverifikasi. Mengarahkan ke halaman utama...</p>
      </div>
    </div>
  );
}
