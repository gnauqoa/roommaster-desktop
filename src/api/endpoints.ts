export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/users',
    LOGOUT: '/auth/logout',
  },
  
  // Room Types
  ROOM_TYPES: {
    LIST: '/roomTypes',
    CREATE: '/roomTypes',
    UPDATE: (id: number) => `/roomTypes/${id}`,
    DELETE: (id: number) => `/roomTypes/${id}`,
    GET: (id: number) => `/roomTypes/${id}`,
  },
  
  // Rooms
  ROOMS: {
    LIST: '/rooms',
    CREATE: '/rooms',
    UPDATE: (id: number) => `/rooms/${id}`,
    DELETE: (id: number) => `/rooms/${id}`,
    GET: (id: number) => `/rooms/${id}`,
    AVAILABLE: '/rooms?status=available',
  },
  
  // Reservations
  RESERVATIONS: {
    LIST: '/reservations',
    CREATE: '/reservations',
    UPDATE: (id: number) => `/reservations/${id}`,
    DELETE: (id: number) => `/reservations/${id}`,
    GET: (id: number) => `/reservations/${id}`,
    TODAY: '/reservations',
  },
  
  // Rental Slips (Check-in)
  RENTAL_SLIPS: {
    LIST: '/rentalSlips',
    CREATE: '/rentalSlips',
    GET: (id: number) => `/rentalSlips/${id}`,
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    UPDATE: (id: number) => `/services/${id}`,
    DELETE: (id: number) => `/services/${id}`,
    GET: (id: number) => `/services/${id}`,
  },
  
  // Service Usage
  SERVICE_USAGE: {
    LIST: '/serviceUsage',
    CREATE: '/serviceUsage',
    BY_RENTAL_SLIP: (rentalSlipId: number) => `/serviceUsage?rentalSlipId=${rentalSlipId}`,
  },
  
  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    UPDATE: (id: number) => `/employees/${id}`,
    DELETE: (id: number) => `/employees/${id}`,
    GET: (id: number) => `/employees/${id}`,
  },
  
  // Invoices
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    GET: (id: number) => `/invoices/${id}`,
  },
};

