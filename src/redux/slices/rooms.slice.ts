import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Room, RoomWithType, RoomFilters, CreateRoomInput, UpdateRoomInput, RoomType } from '@/types';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { RootState } from '@/redux/store';

interface RoomsState {
  rooms: Room[];
  filters: RoomFilters;
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  filters: {},
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ROOMS.LIST);
      return response.data as Room[];
    } catch (error) {
      return rejectWithValue('Failed to fetch rooms');
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (room: CreateRoomInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ROOMS.CREATE, room);
      return response.data as Room;
    } catch (error) {
      return rejectWithValue('Failed to create room');
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async (room: UpdateRoomInput, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.ROOMS.UPDATE(room.id),
        room
      );
      return response.data as Room;
    } catch (error) {
      return rejectWithValue('Failed to update room');
    }
  }
);

export const updateRoomStatus = createAsyncThunk(
  'rooms/updateRoomStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.ROOMS.UPDATE(id),
        { status }
      );
      return response.data as Room;
    } catch (error) {
      return rejectWithValue('Failed to update room status');
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.ROOMS.DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete room');
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create
    builder
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update
    builder
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rooms.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update Status
    builder
      .addCase(updateRoomStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rooms.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(updateRoomStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete
    builder
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAllRooms = (state: RootState) => state.rooms.rooms;
export const selectRoomsByStatus = (state: RootState, status: string) =>
  state.rooms.rooms.filter(room => room.status === status);
export const selectAvailableRooms = (state: RootState) =>
  state.rooms.rooms.filter(room => room.status === 'available');

export const { setFilters, clearError } = roomsSlice.actions;
export default roomsSlice.reducer;
