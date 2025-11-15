import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchDashboardData } from '@/redux/slices/dashboard.slice';
import { fetchRooms } from '@/redux/slices/rooms.slice';
import { fetchInvoices } from '@/redux/slices/invoices.slice';
import { fetchReservations } from '@/redux/slices/reservations.slice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { DollarSign, Bed, TrendingUp, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/i18n';

const DashboardPage = () => {
  const { t } = useTranslation('dashboard');
  const dispatch = useAppDispatch();
  const { kpis, revenueData, roomStatusDistribution, loading } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchRooms());
      await dispatch(fetchInvoices());
      await dispatch(fetchReservations());
      await dispatch(fetchDashboardData());
    };
    fetchData();
  }, [dispatch]);

  if (loading || !kpis) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: t('kpis.totalRooms'),
      value: kpis.totalRooms,
      icon: Bed,
      color: 'text-blue-500',
    },
    {
      title: t('kpis.occupancyRate'),
      value: formatPercentage(kpis.occupancyRate),
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: t('kpis.todayRevenue'),
      value: formatCurrency(kpis.todayRevenue),
      icon: DollarSign,
      color: 'text-purple-500',
    },
    {
      title: t('kpis.checkInsToday'),
      value: kpis.checkInsToday,
      icon: Users,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.revenueTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name={t('charts.revenue')}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t('charts.roomStatusDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomStatusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name={t('units.rooms', { ns: 'common' })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>{t('stats.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('kpis.availableRooms')}</p>
              <p className="text-2xl font-bold text-green-600">{kpis.availableRooms}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('kpis.occupiedRooms')}</p>
              <p className="text-2xl font-bold text-blue-600">{kpis.occupiedRooms}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('kpis.checkOutsToday')}</p>
              <p className="text-2xl font-bold text-orange-600">{kpis.checkOutsToday}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

