import { Coupon } from "./coupon.interface";
import { Point } from "./point.interface";
import { Voucher } from "./voucher.interface";


export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referral_code?: string;
  is_verified?: boolean;
  profile_picture?: string | null;
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
    profile_picture?: string | null;
    point: number;
    coupons: Coupon[];
    vouchers: Voucher[];
  } | null;
  error: string | null;
}