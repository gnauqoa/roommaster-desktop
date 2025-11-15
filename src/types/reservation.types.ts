export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: number;
  guestName: string;
  guestId: string;
  phone: string;
  email: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  notes: string;
}

export interface ReservationWithRoom extends Reservation {
  room?: {
    roomNumber: string;
    roomType?: {
      name: string;
    };
  };
}

export interface CreateReservationInput {
  guestName: string;
  guestId: string;
  phone: string;
  email: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  notes?: string;
}

export interface UpdateReservationInput extends Partial<CreateReservationInput> {
  id: number;
  status?: ReservationStatus;
}

export interface AvailabilitySearchParams {
  checkInDate: string;
  checkOutDate: string;
  roomTypeId?: number;
}

export interface AvailableRoom {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  floor: number;
  roomType: {
    name: string;
    basePrice: number;
    capacity: number;
  };
}

