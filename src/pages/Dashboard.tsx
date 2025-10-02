import React from 'react';
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data
const revenueData = [
  { month: 'T1', revenue: 2400, cost: 1800 },
  { month: 'T2', revenue: 1398, cost: 1200 },
  { month: 'T3', revenue: 9800, cost: 7200 },
  { month: 'T4', revenue: 3908, cost: 2800 },
  { month: 'T5', revenue: 4800, cost: 3600 },
  { month: 'T6', revenue: 3800, cost: 2900 },
];

const vehicleStatusData = [
  { name: 'Đang hoạt động', value: 45, color: '#059669' },
  { name: 'Bảo dưỡng', value: 8, color: '#ea580c' },
  { name: 'Sự cố', value: 3, color: '#dc2626' },
  { name: 'Rảnh', value: 12, color: '#6b7280' },
];

const recentBookings = [
  {
    id: 'BK001',
    customer: 'Công ty TNHH ABC',
    route: 'HCM → Hà Nội',
    status: 'confirmed',
    value: '15,000,000 VNĐ',
    time: '2 giờ trước'
  },
  {
    id: 'BK002',
    customer: 'Công ty XYZ',
    route: 'Đà Nẵng → HCM',
    status: 'pending',
    value: '8,500,000 VNĐ',
    time: '3 giờ trước'
  },
  {
    id: 'BK003',
    customer: 'Công ty DEF',
    route: 'Hà Nội → Hải Phòng',
    status: 'in_progress',
    value: '5,200,000 VNĐ',
    time: '5 giờ trước'
  }
];

const activeTrips = [
  {
    id: 'TR001',
    vehicle: '30A-123.45',
    driver: 'Nguyễn Văn A',
    route: 'HCM → Đà Nẵng',
    progress: 65,
    eta: '14:30'
  },
  {
    id: 'TR002',
    vehicle: '51B-678.90',
    driver: 'Trần Văn B',
    route: 'Hà Nội → HCM',
    progress: 32,
    eta: '18:45'
  },
  {
    id: 'TR003',
    vehicle: '92C-111.22',
    driver: 'Lê Văn C',
    route: 'Đà Nẵng → Hà Nội',
    progress: 88,
    eta: '10:15'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Tổng quan hệ thống
        </h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi hoạt động kinh doanh và vận hành xe
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số xe"
          value="68"
          change={{ value: "5.2%", type: "increase" }}
          icon={Car}
          color="primary"
        />
        <StatCard
          title="Doanh thu tháng"
          value="2.4 tỷ VNĐ"
          change={{ value: "12.1%", type: "increase" }}
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Chuyến đi hôm nay"
          value="156"
          change={{ value: "8.3%", type: "increase" }}
          icon={MapPin}
          color="warning"
        />
        <StatCard
          title="Sự cố đã xử lý"
          value="3"
          change={{ value: "2.1%", type: "decrease" }}
          icon={AlertTriangle}
          color="destructive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Doanh thu vs Chi phí (6 tháng gần nhất)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} tr VNĐ`]} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Doanh thu"
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  name="Chi phí"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-primary" />
              <span>Tình trạng xe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {vehicleStatusData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Booking gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{booking.id}</span>
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'pending' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {booking.status === 'confirmed' ? 'Đã xác nhận' :
                         booking.status === 'pending' ? 'Chờ xử lý' : 'Đang thực hiện'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.customer}</p>
                    <p className="text-sm font-medium">{booking.route}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-success">{booking.value}</p>
                    <p className="text-xs text-muted-foreground">{booking.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Chuyến đi đang thực hiện</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <div key={trip.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{trip.vehicle}</span>
                    <span className="text-sm text-muted-foreground">ETA: {trip.eta}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{trip.driver}</p>
                  <p className="text-sm font-medium mb-2">{trip.route}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Tiến độ</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <Progress value={trip.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}