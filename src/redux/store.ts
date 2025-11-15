import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import all reducers
import authReducer from '@/redux/slices/auth.slice';
import roomTypesReducer from '@/redux/slices/roomType.slice';
import roomsReducer from '@/redux/slices/rooms.slice';
import reservationsReducer from '@/redux/slices/reservations.slice';
import checkInReducer from '@/redux/slices/check.slice';
import checkOutReducer from '@/redux/slices/checkOut.slice';
import servicesReducer from '@/redux/slices/services.slice';
import employeesReducer from '@/redux/slices/employees.slice';
import invoicesReducer from '@/redux/slices/invoices.slice';
import dashboardReducer from '@/redux/slices/dashboard.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roomTypes: roomTypesReducer,
    rooms: roomsReducer,
    reservations: reservationsReducer,
    checkIn: checkInReducer,
    checkOut: checkOutReducer,
    services: servicesReducer,
    employees: employeesReducer,
    invoices: invoicesReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
