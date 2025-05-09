'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Transaction } from '@/lib/interfaces/transaction.interface';

export default function MyTransactionPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions([
      {
        id: 1,
        customerName: 'Dani Putra',
        eventName: 'JavaScript Conference 2025',
        ticketQty: 2,
        totalPrice: 200000,
        status: 'WAITING_FOR_ADMIN_CONFIRMATION',
        createdAt: new Date(),
        paymentProof: 'https://via.placeholder.com/100',
      },
      {
        id: 2,
        customerName: 'Sari Rahma',
        eventName: 'Next.js Mastery Bootcamp',
        ticketQty: 1,
        totalPrice: 150000,
        status: 'DONE',
        createdAt: new Date(),
        paymentProof: 'https://via.placeholder.com/100',
      },
    ]);
  }, []);

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-6 py-12 font-montserrat transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor & manage event payments easily.</p>
        </header>

        <div className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b text-gray-500 text-left">
              <tr>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Event</th>
                <th className="py-4 px-6 font-medium">Qty</th>
                <th className="py-4 px-6 font-medium">Total</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Proof</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6">{tx.customerName}</td>
                  <td className="py-4 px-6">{tx.eventName}</td>
                  <td className="py-4 px-6">{tx.ticketQty}</td>
                  <td className="py-4 px-6">Rp {tx.totalPrice.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      tx.status === 'DONE'
                        ? 'bg-green-100 text-green-700'
                        : tx.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {tx.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <a href={tx.paymentProof} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 transition">
                      View
                    </a>
                  </td>
                  <td className="py-4 px-6">{format(tx.createdAt, 'dd MMM yyyy')}</td>
                  <td className="py-4 px-6 text-center space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition">
                      <FaCheck className="mr-1" /> Accept
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition">
                      <FaTimes className="mr-1" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 px-4 text-center text-gray-400 text-sm italic">No transactions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

