import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RentalSlip, CreateRentalSlipInput } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

interface CheckInState {
  rentalSlips: RentalSlip[];
  loading: boolean;
  error: string | null;
}

const initialState: CheckInState = {
  rentalSlips: [],
  loading: false,
  error: null,
};

export const fetchRentalSlips = createAsyncThunk(
  'checkIn/fetchRentalSlips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.RENTAL_SLIPS.LIST);
      return response.data as RentalSlip[];
    } catch (error) {
      return rejectWithValue('Failed to fetch rental slips');
    }
  }
);

export const createRentalSlip = createAsyncThunk(
  'checkIn/createRentalSlip',
  async (data: CreateRentalSlipInput, { rejectWithValue, dispatch }) => {
    try {
      // Create rental slip
      const rentalSlipData = {
        ...data,
        checkInDate: new Date().toISOString(),
      };
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.RENTAL_SLIPS.CREATE,
        rentalSlipData
      );
      
      // Update room status to occupied
      await axiosInstance.patch(
        API_ENDPOINTS.ROOMS.UPDATE(data.roomId),
        { status: 'occupied' }
      );
      
      // Update reservation status to confirmed
      await axiosInstance.patch(
        API_ENDPOINTS.RESERVATIONS.UPDATE(data.reservationId),
        { status: 'confirmed' }
      );
      
      return response.data as RentalSlip;
    } catch (error) {
      return rejectWithValue('Failed to create rental slip');
    }
  }
);

const checkInSlice = createSlice({
  name: 'checkIn',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchRentalSlips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentalSlips.fulfilled, (state, action) => {
        state.loading = false;
        state.rentalSlips = action.payload;
      })
      .addCase(fetchRentalSlips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createRentalSlip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRentalSlip.fulfilled, (state, action) => {
        state.loading = false;
        state.rentalSlips.push(action.payload);
      })
      .addCase(createRentalSlip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = checkInSlice.actions;
export default checkInSlice.reducer;
