import { ServiceUsageWithDetails } from './service.types';
import { RentalSlipWithDetails } from './checkIn.types';

export interface CheckoutData {
  rentalSlip: RentalSlipWithDetails;
  services: ServiceUsageWithDetails[];
  roomCharges: number;
  serviceCharges: number;
  tax: number;
  totalAmount: number;
  depositRefund: number;
  finalAmount: number;
}

export interface ProcessCheckoutInput {
  rentalSlipId: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer';
}

