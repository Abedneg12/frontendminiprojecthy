'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchCustomerProfile } from '@/lib/redux/slices/customerProfileSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import toast from 'react-hot-toast';

dayjs.extend(utc);

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data: profile, loading } = useAppSelector((state) => state.customerProfile);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.full_name) setNewName(profile.full_name);
  }, [profile]);

  const handleSaveName = async () => {
    if (!newName.trim()) {
      toast.error('Username tidak boleh kosong');
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: newName }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Username berhasil diperbarui');
        dispatch(fetchCustomerProfile());
        setIsEditingName(false);
      } else {
        toast.error(result.message || 'Gagal memperbarui username');
      }
    } catch {
      toast.error('Terjadi kesalahan saat update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/customer/upload-picture`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

      const result = await res.json();
      if (res.ok) {
        toast.success('Foto profil berhasil diupload');
        dispatch(fetchCustomerProfile());
      } else {
        toast.error(result.message || 'Gagal upload foto');
      }
    } catch {
      toast.error('Terjadi kesalahan saat upload foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
  try {
    setIsDeleting(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/customer/delete-picture`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    if (res.ok) {
      toast.success('Foto profil berhasil dihapus');
      dispatch(fetchCustomerProfile());
    } else {
      toast.error(result.message || 'Gagal menghapus foto');
    }
  } catch {
    toast.error('Terjadi kesalahan saat menghapus foto');
  } finally {
    setIsDeleting(false);
  }
};

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadPhoto(e.target.files[0]);
      e.target.value = ''; // reset input
    }
  };

  if (loading || !profile) {
    return <div className="bg-white p-10 text-center text-black font-semibold">Memuat data profil...</div>;
  }

  return (
    <section className="min-h-screen bg-slate-100 px-6 py-12 sm:px-12 md:px-20 lg:px-32 font-montserrat">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-gray-500 text-sm">Informasi akun dan aktivitas Anda.</p>
        </header>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            {profile.profile_picture ? (
              <>
                <img src={profile.profile_picture} alt="Foto Profil" className="w-28 h-28 rounded-full object-cover border" />
                <div className="flex flex-col gap-1 w-full text-center">
                  <label className={`text-sm text-blue-600 hover:underline cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" onChange={onFileChange} disabled={isUploading} />
                    {isUploading ? 'Mengunggah...' : 'Ubah Foto'}
                  </label>
                  <button
                    onClick={handleDeletePhoto}
                    className="text-sm text-red-500 hover:underline"
                    disabled={isUploading}
                  >
                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-28 h-28 bg-gray-100 text-gray-400 flex items-center justify-center rounded-full border text-sm">
                  Belum Ada
                </div>
                <label className={`text-sm text-blue-600 hover:underline cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" onChange={onFileChange} disabled={isUploading} />
                  {isUploading ? 'Mengunggah...' : 'Upload Foto'}
                </label>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600">Username</label>
              {isEditingName ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-black border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-auto"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="text-sm px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(profile.full_name);
                    }}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[15px] text-gray-900 font-semibold">{profile.full_name}</p>
                  <button onClick={() => setIsEditingName(true)} className="text-sm text-blue-600 hover:underline">
                    Ubah
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <p className="text-[15px] text-gray-900 font-semibold">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Referral Code</label>
              <p className="text-[15px] text-gray-900 font-semibold">{profile.referral_code || '-'}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Status Verifikasi</label>
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded font-medium ${
                profile.is_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {profile.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
              </span>
            </div>
          </div>
        </div>

        <hr className="my-10 border-black" />

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <SummaryCard title="Point" value={profile.point} />
          <SummaryCard title="Coupon" value={profile.coupons?.length} />
          <SummaryCard title="Voucher" value={profile.vouchers?.length} />
        </div>

        <div className="mt-10 space-y-8">
          <CouponList coupons={profile.coupons} />
          <VoucherList vouchers={profile.vouchers} />
        </div>
      </div>
    </section>
  );
}

// Ringkasan dan List Component
function SummaryCard({ title, value }: { title: string; value?: number }) {
  return (
    <div className="bg-gray-400 border-2 border-black rounded-lg p-4 text-center">
      <p className="text-xs text-white uppercase tracking-wide font-semibold">{title}</p>
      <p className="text-xl font-semibold text-gray-900 mt-1">{value ?? 0}</p>
    </div>
  );
}

function CouponList({ coupons }: { coupons: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Coupon Saya</h2>
      {coupons?.length > 0 ? (
        <ul className="space-y-3 text-sm">
          {coupons.map((coupon) => (
            <li key={coupon.id} className="border border-gray-200 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">{coupon.code}</span>
                <span className="text-gray-600">
                  Diskon {coupon.discount_amount} – exp: {dayjs.utc(coupon.expired_at).format('DD MMM YYYY')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-gray-500">Tidak ada kupon aktif.</p>
      )}
    </div>
  );
}

function VoucherList({ vouchers }: { vouchers: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Voucher Event Aktif</h2>
      {vouchers?.length > 0 ? (
        <ul className="space-y-3 text-sm">
          {vouchers.map((voucher) => (
            <li key={voucher.id} className="border border-gray-200 p-3 rounded-md">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{voucher.code}</span>
                <span className="text-gray-600">
                  Diskon {voucher.discount_amount} ({voucher.discount_type}) untuk event <b>{voucher.event.name}</b> mulai{' '}
                  {dayjs.utc(voucher.event.start_date).format('DD MMM YYYY')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-gray-500">Tidak ada voucher event aktif.</p>
      )}
    </div>
  );
}
