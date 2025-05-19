import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(6, 'Nama lengkap minimal 6 karakter'),
  description: z.string().min(6, 'Deskripsi minimal 6 karakter'),
  location: z.string().min(6, 'Lokasi minimal 6 karakter'),
  paid: z.boolean(),
  price: z.number().min(0, 'Harga minimal 0'),
  total_seats: z.number().min(1, 'Total kursi minimal 1'),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Tanggal mulai tidak valid',
  }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Tanggal selesai tidak valid',
  }),
  image: z.instanceof(File).optional(),
  category: z.enum(['FESTIVAL', 'MUSIC', 'ART', 'EDUCATION']),
  subtitle: z.string().min(6, 'Subjudul minimal 6 karakter'),
  voucher_code: z.string().optional(),
  voucher_discount: z.number().optional(),
  voucher_start: z.string().optional().refine((date) => {
    if (date === undefined) return true;
    return !isNaN(Date.parse(date));
  }, {
    message: 'Tanggal mulai tidak valid',
  }),
  voucher_end: z.string().optional().refine((date) => {
    if (date === undefined) return true;
    return !isNaN(Date.parse(date));
  }, {
    message: 'Tanggal selesai tidak valid',
  }),
});

export type createEventInput = z.infer<typeof createEventSchema>;
