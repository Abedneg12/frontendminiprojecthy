'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import type { Transaction } from '@/lib/interfaces/transaction.interface';

export default function MyTransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions([
      {
        id: 1,
        customerName: 'Dani Putra',
        eventName: 'JavaScript Conference 2025',
        tickets: [
          { type: 'VIP', quantity: 1 },
          { type: 'Regular', quantity: 2 },
        ],
        totalPrice: 300000,
        status: 'WAITING_FOR_ADMIN_CONFIRMATION',
        createdAt: new Date(),
        paymentProof: 'https://via.placeholder.com/100',
      },
      {
        id: 2,
        customerName: 'Sari Rahma',
        eventName: 'Next.js Mastery Bootcamp',
        tickets: [{ type: 'Regular', quantity: 1 }],
        totalPrice: 150000,
        status: 'DONE',
        createdAt: new Date(),
        paymentProof: 'https://via.placeholder.com/100',
      },
      {
        id: 3,
        customerName: 'Budi Setiawan',
        eventName: 'Cloud Innovation Summit',
        tickets: [],
        totalPrice: 0,
        status: 'WAITING_FOR_PAYMENT',
        createdAt: new Date(),
        paymentProof: '',
      },
    ]);
  }, []);

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-6 py-12 font-montserrat">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-800">Transaksi Saya</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau dan kelola transaksi event Anda dengan mudah.</p>
        </header>

        <div className="rounded-xl overflow-hidden shadow bg-white border">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-left text-gray-500">
              <tr>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Event</th>
                <th className="py-4 px-6 font-semibold">Jumlah Tiket</th>
                <th className="py-4 px-6 font-semibold">Total Harga</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Bukti</th>
                <th className="py-4 px-6 font-semibold">Tanggal</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const totalQty = tx.tickets?.reduce((acc, t) => acc + t.quantity, 0) || 0;
                return (
                  <tr key={tx.id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-4 px-6">{tx.customerName}</td>
                    <td className="py-4 px-6">{tx.eventName}</td>
                    <td className="py-4 px-6">{totalQty}</td>
                    <td className="py-4 px-6">Rp {tx.totalPrice.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          tx.status === 'DONE'
                            ? 'bg-green-100 text-green-700'
                            : tx.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : tx.status === 'EXPIRED' || tx.status === 'CANCELED'
                            ? 'bg-gray-200 text-gray-500'
                            : tx.status === 'WAITING_FOR_PAYMENT'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {tx.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {tx.paymentProof ? (
                        <a
                          href={tx.paymentProof}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Belum ada</span>
                      )}
                    </td>
                    <td className="py-4 px-6">{format(tx.createdAt, 'dd MMM yyyy')}</td>
                    <td className="py-4 px-6 text-center space-x-2">
                      {tx.status === 'WAITING_FOR_ADMIN_CONFIRMATION' && (
                        <>
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition">
                            <FaCheck className="mr-1" /> Terima
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition">
                            <FaTimes className="mr-1" /> Tolak
                          </button>
                        </>
                      )}
                      {['DONE', 'REJECTED'].includes(tx.status) && (
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-700 rounded hover:bg-gray-800 transition">
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 px-4 text-center text-gray-400 text-sm italic">
                    Tidak ada transaksi tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
