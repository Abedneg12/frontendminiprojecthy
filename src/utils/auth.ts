import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  id: number;
  full_name: string;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referral_code: string;
  iat: number;
  exp: number;
}
export function getUserFromToken(): DecodedToken | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (error) {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
