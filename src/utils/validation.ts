import { Reservation } from '@/types';

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPhoneValid = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const hasReservationConflict = (
  newReservation: { checkInDate: string; checkOutDate: string; roomId: number },
  existingReservations: Reservation[]
): boolean => {
  const newCheckIn = new Date(newReservation.checkInDate);
  const newCheckOut = new Date(newReservation.checkOutDate);
  
  return existingReservations.some(reservation => {
    if (
      reservation.roomId !== newReservation.roomId ||
      reservation.status === 'cancelled'
    ) {
      return false;
    }
    
    const resCheckIn = new Date(reservation.checkInDate);
    const resCheckOut = new Date(reservation.checkOutDate);
    
    // Check if dates overlap
    return (
      (newCheckIn >= resCheckIn && newCheckIn < resCheckOut) ||
      (newCheckOut > resCheckIn && newCheckOut <= resCheckOut) ||
      (newCheckIn <= resCheckIn && newCheckOut >= resCheckOut)
    );
  });
};

export const isDateValid = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

export const isCheckoutDateValid = (checkInDate: string, checkOutDate: string): boolean => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  return checkOut > checkIn;
};

