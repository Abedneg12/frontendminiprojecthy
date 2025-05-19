'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Image from 'next/image';
import axios from 'axios';
import { TransactionStatus } from '@prisma/client';

export default function TransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventName = searchParams.get('event');
  const { events } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.auth);
  const event = events.find(e => e.name === eventName);
  
  const [quantity, setQuantity] = useState(1);
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);
  const [countdown, setCountdown] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);

  useEffect(() => {
    if (!event || !user) {
      router.push('/');
    } else {
      // Fetch user's available points
      axios.get(`/api/users/${user.id}/points`).then(res => {
        const activePoints = res.data.filter((point: any) => 
          !point.is_expired && new Date(point.expired_at) > new Date()
        );
        const total = activePoints.reduce((sum: number, point: any) => sum + point.amount, 0);
        setAvailablePoints(total);
      });

      // Fetch user's available coupons
      axios.get(`/api/users/${user.id}/coupons`).then(res => {
        setAvailableCoupons(res.data.filter((coupon: any) => 
          !coupon.is_used && new Date(coupon.expired_at) > new Date()
        ));
      });

      // Fetch available vouchers for this event
      axios.get(`/api/events/${event.id}/vouchers`).then(res => {
        setAvailableVouchers(res.data.filter((voucher: any) => 
          voucher.is_active && 
          new Date(voucher.start_date) <= new Date() && 
          new Date(voucher.end_date) >= new Date()
        ));
      });
    }
  }, [event, user, router]);

  const calculateTotal = () => {
    if (!event) return 0;
    let total = quantity * event.price;
    
    // Apply max possible discounts (for display purposes)
    const maxVoucherDiscount = availableVouchers.length > 0 
      ? Math.max(...availableVouchers.map(v => v.discount_amount))
      : 0;
    
    const maxCouponDiscount = availableCoupons.length > 0 
      ? Math.max(...availableCoupons.map(c => c.discount_amount))
      : 0;
    
    total = Math.max(0, total - maxVoucherDiscount - maxCouponDiscount - Math.min(availablePoints, total));
    
    return total;
  };

  const calculateBaseTotal = () => {
    if (!event) return 0;
    return quantity * event.price;
  };

  const handlePurchase = async () => {
    if (!event || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/transactions', {
        eventId: event.id,
        userId: user.id,
        ticketQuantity: quantity,
        price: event.price,
        totalPrice: calculateBaseTotal(),
        voucherCode: voucherCode || undefined,
        couponCode: couponCode || undefined,
        pointsToUse: pointsToUse || undefined,
      });

      setTransaction(response.data.transaction);
      
      // Initialize payment
      const paymentResponse = await axios.post('/api/payment', {
        transactionId: response.data.transaction.id,
        amount: response.data.transaction.total_price,
        paymentMethod: 'VIRTUAL_ACCOUNT',
      });

      setPaymentInstructions(paymentResponse.data.instructions);
      startCountdown(new Date(paymentResponse.data.expiry_time));
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create transaction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your existing functions (startCountdown, renderPaymentSection) ...

  const renderDiscountOptions = () => {
    if (transaction) return null;

    return (
      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Apply Discounts</h4>
          
          {/* Voucher Selection */}
          {availableVouchers.length > 0 && (
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Event Voucher</label>
              <select
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a voucher</option>
                {availableVouchers.map(voucher => (
                  <option key={voucher.code} value={voucher.code}>
                    {voucher.code} (-Rp {voucher.discount_amount.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Coupon Selection */}
          {availableCoupons.length > 0 && (
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Your Coupon</label>
              <select
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a coupon</option>
                {availableCoupons.map(coupon => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.code} (-Rp {coupon.discount_amount.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Points Selection */}
          {availablePoints > 0 && (
            <div>
              <label className="block text-gray-700 mb-1">
                Use Points (Available: {availablePoints})
              </label>
              <input
                type="number"
                min="0"
                max={Math.min(availablePoints, calculateBaseTotal())}
                value={pointsToUse}
                onChange={(e) => setPointsToUse(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-gray-700">Base Price: Rp {calculateBaseTotal().toLocaleString('id-ID')}</p>
          <p className="text-gray-700">After Discounts: Rp {calculateTotal().toLocaleString('id-ID')}</p>
        </div>
      </div>
    );
  };

  // Update your renderPaymentSection function to include renderDiscountOptions()
  const renderPaymentSection = () => {
    if (!transaction) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Purchase Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <select 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Array.from({ length: Math.min(10, event?.remaining_seats || 5) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {event?.remaining_seats} seats remaining
            </p>
          </div>
          
          {renderDiscountOptions()}
          
          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`w-full mt-4 bg-yellow-600 text-white py-3 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      );
    }

    switch (transaction.status) {
      case TransactionStatus.WAITING_FOR_PAYMENT:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Payment Instructions</h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Pending Payment
              </span>
            </div>
            
            {countdown && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-gray-700">Complete payment before:</p>
                <p className="font-bold text-lg">{countdown}</p>
              </div>
            )}
            
            {paymentInstructions && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Virtual Account Details:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{paymentInstructions.bank}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">VA Number:</span>
                    <span className="font-medium">{paymentInstructions.va_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">Rp {paymentInstructions.amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">How to Pay:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Open your mobile banking app</li>
                <li>Select Virtual Account payment</li>
                <li>Enter the VA number above</li>
                <li>Confirm the amount and complete payment</li>
                <li>Payment confirmation may take a few minutes</li>
              </ol>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={() => router.push('/my-tickets')}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                View My Tickets
              </button>
            </div>
          </div>
        );
      
      case TransactionStatus.DONE:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Payment Successful</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Paid
              </span>
            </div>
            
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium">Your payment has been confirmed!</p>
              <p className="text-green-700 mt-1">Transaction ID: {transaction.id}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Ticket Details:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-medium">{event?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{transaction.ticket_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-medium">Rp {transaction.total_price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/my-tickets')}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-500"
            >
              View My Tickets
            </button>
          </div>
        );
      
      case TransactionStatus.EXPIRED:
      case TransactionStatus.REJECTED:
      case TransactionStatus.CANCELED:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Payment Status</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                {transaction.status === TransactionStatus.EXPIRED ? 'Expired' : 
                 transaction.status === TransactionStatus.REJECTED ? 'Rejected' : 'Canceled'}
              </span>
            </div>
            
            <div className="mb-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 font-medium">
                {transaction.status === TransactionStatus.EXPIRED ? 
                  'The payment period has expired.' : 
                  transaction.status === TransactionStatus.REJECTED ? 
                  'Your payment was rejected.' : 
                  'The transaction was canceled.'}
              </p>
            </div>
            
            <button
              onClick={() => setTransaction(null)}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-500"
            >
              Try Again
            </button>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">Processing your transaction...</p>
          </div>
        );
    }
  };

  if (!event) {
    return (
      <section className="py-10 px-6 md:px-16 bg-white">
        <div className="text-center py-20">
          <p className="text-gray-600">Event not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Event
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                  {event.image && typeof event.image === 'string' && (
                    <Image 
                      src={event.image}
                      alt={event.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">{event.location}</p>
                  <p className="text-gray-600">
                    {new Date(event.start_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {renderPaymentSection()}
          </div>
        </div>
      </div>
    </section>
  );
}
