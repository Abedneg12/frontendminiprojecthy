export interface Transaction {
    id: number;
    customerName: string;
    eventName: string;
    ticketQty: number;
    totalPrice: number;
    status: 'WAITING_FOR_ADMIN_CONFIRMATION' | 'DONE' | 'REJECTED'|'EXPIRED'|'CANCELED'|'WAITING_FOR_PAYMENT';
    createdAt: Date;
    paymentProof: string;
  }