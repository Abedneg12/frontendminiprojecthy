// import { z } from 'zod';

// export const createEventSchema = z.object({
//   name: z.string().min(6, 'Nama lengkap minimal 6 karakter'),
//   description: z.string().min(6, 'Deskripsi minimal 6 karakter'),
//   location: z.string().min(6, 'Lokasi minimal 6 karakter'),
//   paid: z.boolean(),
//   price: z.number().min(0, 'Harga minimal 0'),
//   total_seats: z.number().min(1, 'Total kursi minimal 1'),
//   start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
//     message: 'Tanggal mulai tidak valid',
//   }),
//   end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
//     message: 'Tanggal selesai tidak valid',
//   }),
//   image: z.instanceof(File).optional(),
//   category: z.enum(['FESTIVAL', 'MUSIC', 'ART', 'EDUCATION']),
//   subtitle: z.string().min(6, 'Subjudul minimal 6 karakter'),
//   voucher_code: z.string().optional(),
//   voucher_discount: z.number().optional(),
//   voucher_start: z.string().optional().refine((date) => {
//     if (date === undefined) return true;
//     return !isNaN(Date.parse(date));
//   }, {
//     message: 'Tanggal mulai tidak valid',
//   }),
//   voucher_end: z.string().optional().refine((date) => {
//     if (date === undefined) return true;
//     return !isNaN(Date.parse(date));
//   }, {
//     message: 'Tanggal selesai tidak valid',
//   }),
// });

// export type createEventInput = z.infer<typeof createEventSchema>;



import { z } from "zod";

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran maksimal 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Hanya format .jpg, .png, atau .webp"
  );

export const createEventSchema = z.object({
  name: z.string()
    .min(6, "Nama Event minimal 6 karakter")
    .min(1, "Nama event wajib diisi"),
  subtitle: z.string()
    .max(61, "Subtitle maksimal 61 karakter")
    .min(1, "Subtitle harus diisi"),
  description: z.string()
    .min(10, "Deskripsi Event minimal 10 karakter")
    .min(1, "Deskripsi Event wajib diisi"),
  image: fileSchema,
  category: z.string()
    .min(1, "Pilih salah satu kategori"),
  location: z.string().min(1, "Lokasi tidak boleh kosong"),
  start_date: z.string().min(1, "Tanggal harus diisi"),
  end_date: z.string().min(1, "Tanggal harus diisi"),
  paid: z.boolean().optional().default(false),
  price: z.number()
    .int("Harga harus dalam bentuk angka")
    .min(1000, "Harga minimal seharga Rp 1000")
    .optional()
}).superRefine((data, ctx) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  if (endDate <= startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Tanggal selesai harus setelah tanggal awal",
      path: ["end_date"]
    });
  }


  if (data.paid && data.price === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Harga harus ada untuk event berbayar",
      path: ["price"]
    });
  }
});

export type CreateEvent = z.infer<typeof createEventSchema>;
