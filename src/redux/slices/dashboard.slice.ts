import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardData, DashboardKPIs, RevenueData, RoomStatusDistribution } from '@/types';
import { RootState } from '@/redux/store';

interface DashboardState {
  kpis: DashboardKPIs | null;
  revenueData: RevenueData[];
  roomStatusDistribution: RoomStatusDistribution[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  kpis: null,
  revenueData: [],
  roomStatusDistribution: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const rooms = state.rooms.rooms;
      const invoices = state.invoices.invoices;
      const reservations = state.reservations.reservations;
      
      // Calculate KPIs
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
      const availableRooms = rooms.filter(r => r.status === 'available').length;
      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
      
      // Today's revenue
      const today = new Date().toISOString().split('T')[0];
      const todayInvoices = invoices.filter(inv => 
        inv.createdAt.split('T')[0] === today
      );
      const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
      
      // Today's check-ins and check-outs
      const todayReservations = reservations.filter(res => 
        res.checkInDate === today && res.status !== 'cancelled'
      );
      const checkInsToday = todayReservations.length;
      const checkOutsToday = invoices.filter(inv => 
        inv.createdAt.split('T')[0] === today
      ).length;
      
      const kpis: DashboardKPIs = {
        totalRooms,
        occupiedRooms,
        availableRooms,
        occupancyRate,
        todayRevenue,
        checkInsToday,
        checkOutsToday,
      };
      
      // Revenue data for last 7 days
      const revenueData: RevenueData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayInvoices = invoices.filter(inv => 
          inv.createdAt.split('T')[0] === dateStr
        );
        const revenue = dayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        
        revenueData.push({
          date: dateStr,
          revenue,
        });
      }
      
      // Room status distribution
      const statusCounts: Record<string, number> = {
        available: 0,
        occupied: 0,
        cleaning: 0,
        maintenance: 0,
      };
      
      rooms.forEach(room => {
        statusCounts[room.status] = (statusCounts[room.status] || 0) + 1;
      });
      
      const roomStatusDistribution: RoomStatusDistribution[] = Object.entries(statusCounts).map(
        ([status, count]) => ({ status, count })
      );
      
      const dashboardData: DashboardData = {
        kpis,
        revenueData,
        roomStatusDistribution,
      };
      
      return dashboardData;
    } catch (error) {
      return rejectWithValue('Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.kpis = action.payload.kpis;
        state.revenueData = action.payload.revenueData;
        state.roomStatusDistribution = action.payload.roomStatusDistribution;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
