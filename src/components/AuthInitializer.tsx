'use client';
import { useAuthLoader } from '@/lib/hooks/useAuthLoader';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthLoader(); 
  return <>{children}</>;
}
