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
