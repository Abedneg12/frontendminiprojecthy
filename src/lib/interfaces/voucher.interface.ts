export interface Voucher {
  code: string;
  discount_amount: number;
  start_date: string; // gunakan snake_case yang konsisten
  end_date: string;
}