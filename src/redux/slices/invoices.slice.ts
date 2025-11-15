import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Invoice, CreateInvoiceInput } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { RootState } from '@/redux/store';

interface InvoicesState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.INVOICES.LIST);
      return response.data as Invoice[];
    } catch (error) {
      return rejectWithValue('Failed to fetch invoices');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.INVOICES.GET(id));
      return response.data as Invoice;
    } catch (error) {
      return rejectWithValue('Failed to fetch invoice');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoice: CreateInvoiceInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.INVOICES.CREATE, invoice);
      return response.data as Invoice;
    } catch (error) {
      return rejectWithValue('Failed to create invoice');
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Fetch By ID
    builder
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index === -1) {
          state.invoices.push(action.payload);
        } else {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectInvoicesByDateRange = (state: RootState, startDate: string, endDate: string) =>
  state.invoices.invoices.filter(invoice => {
    const createdAt = new Date(invoice.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return createdAt >= start && createdAt <= end;
  });

export const { clearError } = invoicesSlice.actions;
export default invoicesSlice.reducer;
