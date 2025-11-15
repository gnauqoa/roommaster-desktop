import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Reservation, CreateReservationInput, UpdateReservationInput, AvailabilitySearchParams, Room } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { RootState } from '@/redux/store';

interface ReservationsState {
  reservations: Reservation[];
  availableRooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationsState = {
  reservations: [],
  availableRooms: [],
  loading: false,
  error: null,
};

export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.RESERVATIONS.LIST);
      return response.data as Reservation[];
    } catch (error) {
      return rejectWithValue('Failed to fetch reservations');
    }
  }
);

export const searchAvailability = createAsyncThunk(
  'reservations/searchAvailability',
  async (params: AvailabilitySearchParams, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const allRooms = state.rooms.rooms;
      const allReservations = state.reservations.reservations;
      
      // Get rooms that are available (not occupied, maintenance, or cleaning)
      let availableRooms = allRooms.filter(room => room.status === 'available');
      
      // Filter by room type if specified
      if (params.roomTypeId) {
        availableRooms = availableRooms.filter(room => room.roomTypeId === params.roomTypeId);
      }
      
      // Check for conflicts with existing reservations
      const conflictingReservations = allReservations.filter(reservation => {
        if (reservation.status === 'cancelled') return false;
        
        const resCheckIn = new Date(reservation.checkInDate);
        const resCheckOut = new Date(reservation.checkOutDate);
        const searchCheckIn = new Date(params.checkInDate);
        const searchCheckOut = new Date(params.checkOutDate);
        
        // Check if dates overlap
        return (
          (searchCheckIn >= resCheckIn && searchCheckIn < resCheckOut) ||
          (searchCheckOut > resCheckIn && searchCheckOut <= resCheckOut) ||
          (searchCheckIn <= resCheckIn && searchCheckOut >= resCheckOut)
        );
      });
      
      // Remove rooms that are in conflicting reservations
      const conflictingRoomIds = new Set(conflictingReservations.map(r => r.roomId));
      availableRooms = availableRooms.filter(room => !conflictingRoomIds.has(room.id));
      
      return availableRooms;
    } catch (error) {
      return rejectWithValue('Failed to search availability');
    }
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (reservation: CreateReservationInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.RESERVATIONS.CREATE,
        { ...reservation, status: 'pending' }
      );
      return response.data as Reservation;
    } catch (error) {
      return rejectWithValue('Failed to create reservation');
    }
  }
);

export const updateReservation = createAsyncThunk(
  'reservations/updateReservation',
  async (reservation: UpdateReservationInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.RESERVATIONS.UPDATE(reservation.id),
        reservation
      );
      return response.data as Reservation;
    } catch (error) {
      return rejectWithValue('Failed to update reservation');
    }
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancelReservation',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.RESERVATIONS.UPDATE(id),
        { status: 'cancelled' }
      );
      return response.data as Reservation;
    } catch (error) {
      return rejectWithValue('Failed to cancel reservation');
    }
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAvailableRooms: (state) => {
      state.availableRooms = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Search Availability
    builder
      .addCase(searchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRooms = action.payload;
      })
      .addCase(searchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update
    builder
      .addCase(updateReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Cancel
    builder
      .addCase(cancelReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectReservationsByDateRange = (state: RootState, startDate: string, endDate: string) =>
  state.reservations.reservations.filter(reservation => {
    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkIn >= start && checkOut <= end;
  });

export const { clearError, clearAvailableRooms } = reservationsSlice.actions;
export default reservationsSlice.reducer;
