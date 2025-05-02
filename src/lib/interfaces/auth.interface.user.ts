export interface Point {
  id: number;
  amount: number;
  source: string;
  expired_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_amount: number;
  expired_at: string;
  is_used: boolean;
}

export interface Voucher {
  id: number;
  code: string;
  discount_amount: number;
  discount_type: string;
  event: {
    name: string;
    start_date: string;
  };
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referral_code?: string;
  is_verified?: boolean;
  points?: Point[];
  coupons?: Coupon[];
  vouchers?: Voucher[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}


export interface ProfileState {
  full_name: string;
  email: string;
  referral_code?: string;
  is_verified: boolean;
  profile_picture?: string;
  points: number;
  coupons: Coupon[];
  vouchers: Voucher[];
} 

export interface CustomerProfileState {
  loading: boolean;
  data: {
    id: number;
    full_name: string;
    email: string;
    referral_code: string;
    is_verified: boolean;
    point: number;
    coupons: Coupon[];
    vouchers: Voucher[];
  } | null;
  error: string | null;
}