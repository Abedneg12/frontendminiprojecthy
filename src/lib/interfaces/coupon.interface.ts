export interface Coupon {
  id: number;
  code: string;
  discount_amount: number;
  expired_at: string;
  is_used: boolean;
}