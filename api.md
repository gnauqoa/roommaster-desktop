# Room Master HMS - API Documentation

## Overview

This document outlines the API endpoints needed for the Room Master Hotel Management System. The frontend is currently configured to use a mock API (json-server) running on `http://localhost:3001`. To switch to the production backend, update the `VITE_API_BASE_URL` environment variable.

## Backend Integration Guide

### Environment Configuration

1. Create a `.env` file in the project root
2. Set `VITE_API_BASE_URL` to your backend API URL
3. Example: `VITE_API_BASE_URL=https://api.roommaster.com`

### Authentication

All authenticated requests should include an `Authorization` header:
```
Authorization: Bearer <token>
```

The frontend stores the auth token in `localStorage` under the key `authToken`.

## API Endpoints

### Authentication

#### POST /users
Login endpoint (currently using GET with query params for mock)
- **Body**: `{ email: string, password: string }`
- **Response**: `{ id, email, name, role }`

For production, implement:
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Room Types

- `GET /roomTypes` - Get all room types
- `GET /roomTypes/:id` - Get room type by ID
- `POST /roomTypes` - Create room type
  - Body: `{ name, basePrice, capacity, amenities[], description }`
- `PUT /roomTypes/:id` - Update room type
- `DELETE /roomTypes/:id` - Delete room type

### Rooms

- `GET /rooms` - Get all rooms
- `GET /rooms/:id` - Get room by ID
- `GET /rooms?status=available` - Filter rooms by status
- `POST /rooms` - Create room
  - Body: `{ roomNumber, roomTypeId, status, floor }`
- `PUT /rooms/:id` - Update room
- `PATCH /rooms/:id` - Partial update (e.g., status only)
- `DELETE /rooms/:id` - Delete room

### Reservations

- `GET /reservations` - Get all reservations
- `GET /reservations/:id` - Get reservation by ID
- `POST /reservations` - Create reservation
  - Body: `{ guestName, guestId, phone, email, roomId, checkInDate, checkOutDate, notes }`
- `PUT /reservations/:id` - Update reservation
- `PATCH /reservations/:id` - Update reservation status
  - Body: `{ status: 'cancelled' }`
- `DELETE /reservations/:id` - Delete reservation

**Availability Search:**
For production, implement a dedicated endpoint:
- `POST /reservations/search-availability`
  - Body: `{ checkInDate, checkOutDate, roomTypeId? }`
  - Response: Array of available rooms

### Rental Slips (Check-in)

- `GET /rentalSlips` - Get all rental slips
- `GET /rentalSlips/:id` - Get rental slip by ID
- `POST /rentalSlips` - Create rental slip (check-in)
  - Body: `{ reservationId, guestName, roomId, deposit, checkInDate }`
  - Side effects: Update room status to "occupied", update reservation status to "confirmed"

### Services

- `GET /services` - Get all services
- `GET /services/:id` - Get service by ID
- `POST /services` - Create service
  - Body: `{ name, price, category, description }`
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Service Usage

- `GET /serviceUsage` - Get all service usage
- `GET /serviceUsage?rentalSlipId=:id` - Get services for a rental slip
- `POST /serviceUsage` - Add service to rental slip
  - Body: `{ rentalSlipId, serviceId, quantity, date }`

### Employees

- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create employee
  - Body: `{ name, role, email, phone, status }`
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Invoices

- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get invoice by ID
- `POST /invoices` - Create invoice
  - Body: `{ rentalSlipId, totalAmount, paidAmount, paymentMethod, items[], createdAt }`

### Dashboard

For production, implement dedicated dashboard endpoints:
- `GET /dashboard/kpis` - Get KPIs (total rooms, occupancy rate, today's revenue, etc.)
- `GET /dashboard/revenue?days=7` - Get revenue data for charts
- `GET /dashboard/room-status` - Get room status distribution

## Data Models

### User
```typescript
{
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'receptionist' | 'manager';
}
```

### Room Type
```typescript
{
  id: number;
  name: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  description: string;
}
```

### Room
```typescript
{
  id: number;
  roomNumber: string;
  roomTypeId: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  floor: number;
}
```

### Reservation
```typescript
{
  id: number;
  guestName: string;
  guestId: string;
  phone: string;
  email: string;
  roomId: number;
  checkInDate: string; // ISO date
  checkOutDate: string; // ISO date
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
}
```

### Rental Slip
```typescript
{
  id: number;
  reservationId: number;
  checkInDate: string; // ISO datetime
  guestName: string;
  roomId: number;
  deposit: number;
}
```

### Service
```typescript
{
  id: number;
  name: string;
  price: number;
  category: 'Food & Beverage' | 'Laundry' | 'Spa' | 'Transport' | 'Other';
  description: string;
}
```

### Service Usage
```typescript
{
  id: number;
  rentalSlipId: number;
  serviceId: number;
  quantity: number;
  date: string; // ISO date
}
```

### Employee
```typescript
{
  id: number;
  name: string;
  role: 'admin' | 'receptionist' | 'manager' | 'housekeeper' | 'maintenance';
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}
```

### Invoice
```typescript
{
  id: number;
  rentalSlipId: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer';
  createdAt: string; // ISO datetime
  items: Array<{
    description: string;
    amount: number;
  }>;
}
```

## Business Logic

### Check-in Process
1. Create rental slip
2. Update room status to "occupied"
3. Update reservation status to "confirmed"

### Check-out Process
1. Calculate total bill (room charges + services + tax - deposit)
2. Create invoice
3. Update room status to "cleaning"

### Reservation Conflict Detection (FR-009)
Before creating/updating a reservation, check for overlapping dates on the same room. The frontend implements this logic, but the backend should also validate.

## Error Handling

The frontend expects error responses in the format:
```typescript
{
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

- 401: Unauthorized - triggers automatic logout
- 400: Validation errors
- 404: Resource not found
- 500: Server error

## Running the Mock API

To start the mock API for development:
```bash
yarn mock:api
```

This will start json-server on `http://localhost:3001`.

## Migration Checklist

When switching from mock to production backend:

- [ ] Update `VITE_API_BASE_URL` in `.env`
- [ ] Implement authentication endpoints
- [ ] Implement all CRUD endpoints as documented
- [ ] Add proper validation and error handling
- [ ] Implement business logic (check-in/out, conflict detection)
- [ ] Test all API endpoints
- [ ] Update axios interceptors if needed (token format, error structure)

