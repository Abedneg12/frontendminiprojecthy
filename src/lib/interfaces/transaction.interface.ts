
export type TransactionStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_FOR_ADMIN_CONFIRMATION'
  | 'DONE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELED';

export interface TicketDetail {
  type: string;
  quantity: number;
}

export interface Transaction {
  id: number;
  customerName: string;
  eventName: string;
  tickets: TicketDetail[];
  totalPrice: number;
  status: TransactionStatus;
  paymentProof?: string;
  createdAt: Date;
}
