'use client';

import { useEffect } from 'react';
import { getUserFromToken } from '@/utils/auth';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setUserFromToken } from '@/lib/redux/slices/authSlice';

export function useAuthLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      dispatch(setUserFromToken(user));
    }
  }, [dispatch]);
}
