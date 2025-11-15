import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Service, ServiceUsage, CreateServiceInput, UpdateServiceInput, AddServiceToRentalInput } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

interface ServicesState {
  services: Service[];
  serviceUsage: ServiceUsage[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  serviceUsage: [],
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.LIST);
      return response.data as Service[];
    } catch (error) {
      return rejectWithValue('Failed to fetch services');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (service: CreateServiceInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SERVICES.CREATE, service);
      return response.data as Service;
    } catch (error) {
      return rejectWithValue('Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async (service: UpdateServiceInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.SERVICES.UPDATE(service.id),
        service
      );
      return response.data as Service;
    } catch (error) {
      return rejectWithValue('Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.SERVICES.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete service');
    }
  }
);

export const addServiceToRentalSlip = createAsyncThunk(
  'services/addServiceToRentalSlip',
  async (data: AddServiceToRentalInput, { rejectWithValue }) => {
    try {
      const usageData = {
        ...data,
        date: new Date().toISOString().split('T')[0],
      };
      const response = await axiosInstance.post(
        API_ENDPOINTS.SERVICE_USAGE.CREATE,
        usageData
      );
      return response.data as ServiceUsage;
    } catch (error) {
      return rejectWithValue('Failed to add service');
    }
  }
);

export const fetchServiceUsage = createAsyncThunk(
  'services/fetchServiceUsage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SERVICE_USAGE.LIST);
      return response.data as ServiceUsage[];
    } catch (error) {
      return rejectWithValue('Failed to fetch service usage');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update
    builder
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete
    builder
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(s => s.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Add Service to Rental
    builder
      .addCase(addServiceToRentalSlip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServiceToRentalSlip.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceUsage.push(action.payload);
      })
      .addCase(addServiceToRentalSlip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Service Usage
    builder
      .addCase(fetchServiceUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceUsage = action.payload;
      })
      .addCase(fetchServiceUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
