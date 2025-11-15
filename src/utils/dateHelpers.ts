import { format, parseISO, differenceInDays, addDays } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const calculateNights = (checkInDate: string, checkOutDate: string): number => {
  try {
    const checkIn = parseISO(checkInDate);
    const checkOut = parseISO(checkOutDate);
    return Math.max(0, differenceInDays(checkOut, checkIn));
  } catch {
    return 0;
  }
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const addDaysToDate = (date: string, days: number): string => {
  try {
    const dateObj = parseISO(date);
    return format(addDays(dateObj, days), 'yyyy-MM-dd');
  } catch {
    return date;
  }
};

export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  try {
    const target = parseISO(date);
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return target >= start && target <= end;
  } catch {
    return false;
  }
};

