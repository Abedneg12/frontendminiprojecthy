export interface Voucher {
  id: number;
  code: string;
  discount_amount: number;
  discount_type: string;
  event: {
    name: string;
    start_date: string;
  };
}