export interface RentalSlip {
  id: number;
  reservationId: number;
  checkInDate: string;
  guestName: string;
  roomId: number;
  deposit: number;
}

export interface RentalSlipWithDetails extends RentalSlip {
  reservation?: {
    guestId: string;
    phone: string;
    email: string;
    checkOutDate: string;
  };
  room?: {
    roomNumber: string;
    roomType?: {
      name: string;
      basePrice: number;
    };
  };
}

export interface CreateRentalSlipInput {
  reservationId: number;
  guestName: string;
  roomId: number;
  deposit: number;
}

