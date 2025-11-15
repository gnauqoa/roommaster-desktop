import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.EMPLOYEES.LIST);
      return response.data as Employee[];
    } catch (error) {
      return rejectWithValue('Failed to fetch employees');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employee: CreateEmployeeInput, { rejectWithValue }) => {
    try {
      const employeeData = {
        ...employee,
        status: 'active',
      };
      const response = await axiosInstance.post(API_ENDPOINTS.EMPLOYEES.CREATE, employeeData);
      return response.data as Employee;
    } catch (error) {
      return rejectWithValue('Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (employee: UpdateEmployeeInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.EMPLOYEES.UPDATE(employee.id),
        employee
      );
      return response.data as Employee;
    } catch (error) {
      return rejectWithValue('Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.EMPLOYEES.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete employee');
    }
  }
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = employeesSlice.actions;
export default employeesSlice.reducer;
