import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CheckoutData, ProcessCheckoutInput, RentalSlip, ServiceUsage, Invoice } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { RootState } from '@/redux/store';

interface CheckOutState {
  checkoutData: CheckoutData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CheckOutState = {
  checkoutData: null,
  loading: false,
  error: null,
};

export const calculateCheckout = createAsyncThunk(
  'checkOut/calculateCheckout',
  async (rentalSlipId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      
      // Fetch rental slip
      const rentalSlipResponse = await axiosInstance.get(
        API_ENDPOINTS.RENTAL_SLIPS.GET(rentalSlipId)
      );
      const rentalSlip = rentalSlipResponse.data as RentalSlip;
      
      // Fetch reservation to get checkout date
      const reservation = state.reservations.reservations.find(
        r => r.id === rentalSlip.reservationId
      );
      
      if (!reservation) {
        return rejectWithValue('Reservation not found');
      }
      
      // Get room and room type info
      const room = state.rooms.rooms.find(r => r.id === rentalSlip.roomId);
      const roomType = room ? state.roomTypes.roomTypes.find(rt => rt.id === room.roomTypeId) : null;
      
      // Calculate number of nights
      const checkIn = new Date(rentalSlip.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate room charges
      const roomCharges = roomType ? roomType.basePrice * nights : 0;
      
      // Fetch services used
      const servicesResponse = await axiosInstance.get(
        API_ENDPOINTS.SERVICE_USAGE.BY_RENTAL_SLIP(rentalSlipId)
      );
      const services = servicesResponse.data as ServiceUsage[];
      
      // Calculate service charges
      let serviceCharges = 0;
      for (const usage of services) {
        const service = state.services.services.find(s => s.id === usage.serviceId);
        if (service) {
          serviceCharges += service.price * usage.quantity;
        }
      }
      
      // Calculate tax (10%)
      const tax = (roomCharges + serviceCharges) * 0.1;
      
      // Calculate total
      const totalAmount = roomCharges + serviceCharges + tax;
      const depositRefund = -rentalSlip.deposit;
      const finalAmount = totalAmount + depositRefund;
      
      const checkoutData: CheckoutData = {
        rentalSlip: rentalSlip as any,
        services: services as any,
        roomCharges,
        serviceCharges,
        tax,
        totalAmount,
        depositRefund,
        finalAmount,
      };
      
      return checkoutData;
    } catch (error) {
      return rejectWithValue('Failed to calculate checkout');
    }
  }
);

export const processCheckout = createAsyncThunk(
  'checkOut/processCheckout',
  async (data: ProcessCheckoutInput, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const checkoutData = state.checkOut.checkoutData;
      
      if (!checkoutData) {
        return rejectWithValue('No checkout data available');
      }
      
      // Create invoice
      const invoiceItems = [
        {
          description: `Room Charge (${Math.ceil((new Date().getTime() - new Date(checkoutData.rentalSlip.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights)`,
          amount: checkoutData.roomCharges,
        },
      ];
      
      // Add service charges
      for (const usage of checkoutData.services) {
        const service = state.services.services.find(s => s.id === usage.serviceId);
        if (service) {
          invoiceItems.push({
            description: `${service.name} x${usage.quantity}`,
            amount: service.price * usage.quantity,
          });
        }
      }
      
      invoiceItems.push({ description: 'Deposit Refund', amount: checkoutData.depositRefund });
      invoiceItems.push({ description: 'Tax (10%)', amount: checkoutData.tax });
      
      const invoiceData = {
        rentalSlipId: data.rentalSlipId,
        totalAmount: checkoutData.finalAmount,
        paidAmount: checkoutData.finalAmount,
        paymentMethod: data.paymentMethod,
        createdAt: new Date().toISOString(),
        items: invoiceItems,
      };
      
      const invoiceResponse = await axiosInstance.post(
        API_ENDPOINTS.INVOICES.CREATE,
        invoiceData
      );
      
      // Update room status to cleaning
      await axiosInstance.patch(
        API_ENDPOINTS.ROOMS.UPDATE(checkoutData.rentalSlip.roomId),
        { status: 'cleaning' }
      );
      
      return invoiceResponse.data as Invoice;
    } catch (error) {
      return rejectWithValue('Failed to process checkout');
    }
  }
);

const checkOutSlice = createSlice({
  name: 'checkOut',
  initialState,
  reducers: {
    clearCheckoutData: (state) => {
      state.checkoutData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Calculate
    builder
      .addCase(calculateCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(calculateCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Process
    builder
      .addCase(processCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state) => {
        state.loading = false;
        state.checkoutData = null;
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCheckoutData, clearError } = checkOutSlice.actions;
export default checkOutSlice.reducer;
