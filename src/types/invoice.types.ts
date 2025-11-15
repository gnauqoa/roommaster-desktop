export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer';

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: number;
  rentalSlipId: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: InvoiceItem[];
}

export interface InvoiceWithDetails extends Invoice {
  rentalSlip?: {
    guestName: string;
    roomId: number;
    checkInDate: string;
  };
}

export interface CreateInvoiceInput {
  rentalSlipId: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  items: InvoiceItem[];
}

