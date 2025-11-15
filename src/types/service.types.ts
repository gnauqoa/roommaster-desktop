export type ServiceCategory = 'Food & Beverage' | 'Laundry' | 'Spa' | 'Transport' | 'Other';

export interface Service {
  id: number;
  name: string;
  price: number;
  category: ServiceCategory;
  description: string;
}

export interface ServiceUsage {
  id: number;
  rentalSlipId: number;
  serviceId: number;
  quantity: number;
  date: string;
}

export interface ServiceUsageWithDetails extends ServiceUsage {
  service?: Service;
}

export interface CreateServiceInput {
  name: string;
  price: number;
  category: ServiceCategory;
  description: string;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: number;
}

export interface AddServiceToRentalInput {
  rentalSlipId: number;
  serviceId: number;
  quantity: number;
}

