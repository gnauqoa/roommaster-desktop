export interface DashboardKPIs {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  todayRevenue: number;
  checkInsToday: number;
  checkOutsToday: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface RoomStatusDistribution {
  status: string;
  count: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  revenueData: RevenueData[];
  roomStatusDistribution: RoomStatusDistribution[];
}

