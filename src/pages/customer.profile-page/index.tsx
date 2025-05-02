'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCustomerProfile } from '@/lib/redux/slices/customerProfileSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data: profile, loading } = useAppSelector((state) => state.customerProfile);

  useEffect(() => {
    dispatch(fetchCustomerProfile());
  }, [dispatch]);

  if (loading || !profile) {
    return <div className="p-10 text-center text-blue-600 font-semibold">Memuat data profil...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 flex justify-center items-start px-4 py-10 font-montserrat">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-8 uppercase tracking-wide">Profil Saya</h1>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="w-32 h-32 rounded-full border-4 border-yellow-400 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Foto
          </div>

          <div className="flex-1 space-y-2 text-gray-800">
            <div>
              <span className="block text-sm font-semibold text-gray-600">Nama Lengkap:</span>
              <p className="text-lg font-medium">{profile.full_name}</p>
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-600">Email:</span>
              <p className="text-base">{profile.email}</p>
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-600">Referral Code:</span>
              <p className="text-blue-700 font-semibold">{profile.referral_code || '-'}</p>
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-600">Status Verifikasi:</span>
              <span className={`inline-block mt-1 px-3 py-1 text-sm rounded-full font-semibold ${profile.is_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {profile.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow text-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Total Poin</h3>
            <p className="text-2xl font-bold text-yellow-600">{profile.point ?? 0}</p>
          </div>

          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow text-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Kupon Aktif</h3>
            <p className="text-2xl font-bold text-blue-600">{profile.coupons?.length ?? 0}</p>
          </div>

          <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded shadow text-center">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Voucher Aktif</h3>
            <p className="text-2xl font-bold text-purple-600">{profile.vouchers?.length ?? 0}</p>
          </div>
        </div>

        {/* Kupon Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Kupon Saya</h2>
          {profile.coupons?.length > 0 ? (
            <ul className="space-y-3">
              {profile.coupons.map((coupon) => (
                <li key={coupon.id} className="bg-yellow-50 border border-yellow-300 p-4 rounded shadow text-sm sm:text-base text-gray-800">
                  <span className="font-bold text-yellow-800">{coupon.code}</span>
                  <span className="ml-2 font-medium text-gray-700">– Diskon {coupon.discount_amount}</span>
                  <span className="ml-2 text-gray-700">– exp: {dayjs.utc(coupon.expired_at).format('DD MMM YYYY')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">Tidak ada kupon aktif.</p>
          )}
        </div>

        {/* Voucher Section */}
        <div>
          <h2 className="text-xl font-bold text-purple-800 mb-4">Voucher Event Aktif</h2>
          {profile.vouchers?.length > 0 ? (
            <ul className="space-y-3">
              {profile.vouchers.map((voucher) => (
                <li key={voucher.id} className="bg-purple-50 border border-purple-300 p-4 rounded shadow">
                  <span className="font-semibold text-purple-700">{voucher.code}</span> – Diskon {voucher.discount_amount} ({voucher.discount_type}) untuk event "<span className="font-semibold">{voucher.event.name}</span>" mulai <span className="text-gray-700">{dayjs.utc(voucher.event.start_date).format('DD MMM YYYY')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">Tidak ada voucher event aktif.</p>
          )}
        </div>
      </div>
    </div>
  );
}
