export interface User {
  id: number;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  full_name?: string;
  referral_code?: string;
  is_verified?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}