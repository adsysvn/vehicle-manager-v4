import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  Users,
  Car,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const revenueByVehicleData = [
  { vehicle: '30A-123', revenue: 45000000, trips: 24 },
  { vehicle: '51B-678', revenue: 38000000, trips: 19 },
  { vehicle: '92C-111', revenue: 42000000, trips: 22 },
  { vehicle: '29D-456', revenue: 35000000, trips: 18 },
  { vehicle: '43E-789', revenue: 31000000, trips: 16 },
  { vehicle: '88F-234', revenue: 29000000, trips: 15 }
];

const revenueByMonthData = [
  { month: 'T1', revenue: 280000000, bookings: 156 },
  { month: 'T2', revenue: 320000000, bookings: 178 },
  { month: 'T3', revenue: 350000000, bookings: 195 },
  { month: 'T4', revenue: 380000000, bookings: 210 },
  { month: 'T5', revenue: 420000000, bookings: 232 },
  { month: 'T6', revenue: 450000000, bookings: 248 }
];

const customerTypeData = [
  { name: 'Doanh nghiệp', value: 65, color: 'hsl(var(--primary))' },
  { name: 'Cá nhân', value: 35, color: 'hsl(var(--success))' }
];

const topCustomers = [
  { name: 'Công ty TNHH ABC', revenue: 85000000, trips: 48, growth: 12.5 },
  { name: 'Công ty XYZ', revenue: 72000000, trips: 42, growth: 8.3 },
  { name: 'Công ty DEF Technology', revenue: 68000000, trips: 38, growth: 15.2 },
  { name: 'Công ty GHI Logistics', revenue: 55000000, trips: 32, growth: -3.4 },
  { name: 'Công ty JKL Trading', revenue: 48000000, trips: 28, growth: 6.7 }
];

export default function SalesReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Báo cáo Kinh doanh
          </h1>
          <p className="text-muted-foreground mt-2">
            Phân tích doanh thu theo xe, khách hàng và xu hướng
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kỳ báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-foreground">450 triệu</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Số booking</p>
                <p className="text-2xl font-bold text-foreground">248</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+6.9% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Khách hàng</p>
                <p className="text-2xl font-bold text-foreground">128</p>
              </div>
              <Users className="w-8 h-8 text-warning" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+8.5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doanh thu/xe</p>
                <p className="text-2xl font-bold text-foreground">6.6 triệu</p>
              </div>
              <Car className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
              <TrendingDown className="w-4 h-4" />
              <span>-2.3% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Doanh thu theo tháng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [`${(value / 1000000).toFixed(0)} triệu`]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Doanh thu"
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Phân loại khách hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.value}%`}
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Vehicle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-primary" />
            <span>Doanh thu theo xe (Top 6)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueByVehicleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="vehicle" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`${(value / 1000000).toFixed(1)} triệu`]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Top khách hàng (theo doanh thu)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.trips} chuyến</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{(customer.revenue / 1000000).toFixed(1)} triệu</p>
                  <div className={`flex items-center gap-1 text-sm ${customer.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {customer.growth >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(customer.growth)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
