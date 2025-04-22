import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  iat: number;
  exp: number;
}

// Sudah ada
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

// ✅ BARU: cek apakah user sudah login dan token valid
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
