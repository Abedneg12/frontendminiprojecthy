import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['CUSTOMER', 'ORGANIZER']),
  referral_code: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
