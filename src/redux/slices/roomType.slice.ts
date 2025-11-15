import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RoomType } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { RootState } from '@/redux/store';

interface RoomTypesState {
  roomTypes: RoomType[];
  selectedRoomType: RoomType | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomTypesState = {
  roomTypes: [],
  selectedRoomType: null,
  loading: false,
  error: null,
};

export const fetchRoomTypes = createAsyncThunk(
  'roomTypes/fetchRoomTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ROOM_TYPES.LIST);
      return response.data as RoomType[];
    } catch (error) {
      return rejectWithValue('Failed to fetch room types');
    }
  }
);

export const createRoomType = createAsyncThunk(
  'roomTypes/createRoomType',
  async (roomType: Omit<RoomType, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ROOM_TYPES.CREATE, roomType);
      return response.data as RoomType;
    } catch (error) {
      return rejectWithValue('Failed to create room type');
    }
  }
);

export const updateRoomType = createAsyncThunk(
  'roomTypes/updateRoomType',
  async (roomType: RoomType, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.ROOM_TYPES.UPDATE(roomType.id),
        roomType
      );
      return response.data as RoomType;
    } catch (error) {
      return rejectWithValue('Failed to update room type');
    }
  }
);

export const deleteRoomType = createAsyncThunk(
  'roomTypes/deleteRoomType',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.ROOM_TYPES.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete room type');
    }
  }
);

const roomTypesSlice = createSlice({
  name: 'roomTypes',
  initialState,
  reducers: {
    selectRoomType: (state, action) => {
      state.selectedRoomType = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchRoomTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.roomTypes = action.payload;
      })
      .addCase(fetchRoomTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.roomTypes.push(action.payload);
      })
      .addCase(createRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update
    builder
      .addCase(updateRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roomTypes.findIndex(rt => rt.id === action.payload.id);
        if (index !== -1) {
          state.roomTypes[index] = action.payload;
        }
      })
      .addCase(updateRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete
    builder
      .addCase(deleteRoomType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoomType.fulfilled, (state, action) => {
        state.loading = false;
        state.roomTypes = state.roomTypes.filter(rt => rt.id !== action.payload);
      })
      .addCase(deleteRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAllRoomTypes = (state: RootState) => state.roomTypes.roomTypes;
export const selectRoomTypeById = (state: RootState, id: number) =>
  state.roomTypes.roomTypes.find(rt => rt.id === id);

export const { selectRoomType, clearError } = roomTypesSlice.actions;
export default roomTypesSlice.reducer;
