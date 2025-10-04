import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Car,
  User,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const vehiclePerformanceData = [
  { vehicle: '30A-123', trips: 24, onTime: 95, incidents: 1, utilization: 88 },
  { vehicle: '51B-678', trips: 19, onTime: 92, incidents: 2, utilization: 82 },
  { vehicle: '92C-111', trips: 22, onTime: 98, incidents: 0, utilization: 91 },
  { vehicle: '29D-456', trips: 18, onTime: 88, incidents: 3, utilization: 76 },
  { vehicle: '43E-789', trips: 16, onTime: 94, incidents: 1, utilization: 79 }
];

const driverPerformanceData = [
  { name: 'Nguyễn Văn A', trips: 48, onTime: 96, rating: 4.8, incidents: 1 },
  { name: 'Trần Văn B', trips: 42, onTime: 93, rating: 4.6, incidents: 2 },
  { name: 'Lê Văn C', trips: 45, onTime: 97, rating: 4.9, incidents: 0 },
  { name: 'Phạm Văn D', trips: 38, onTime: 89, rating: 4.3, incidents: 4 },
  { name: 'Hoàng Văn E', trips: 35, onTime: 91, rating: 4.5, incidents: 2 }
];

const weeklyPerformanceData = [
  { day: 'T2', trips: 42, onTime: 95, incidents: 2 },
  { day: 'T3', trips: 48, onTime: 93, incidents: 3 },
  { day: 'T4', trips: 45, onTime: 97, incidents: 1 },
  { day: 'T5', trips: 52, onTime: 91, incidents: 4 },
  { day: 'T6', trips: 58, onTime: 94, incidents: 2 },
  { day: 'T7', trips: 38, onTime: 96, incidents: 1 },
  { day: 'CN', trips: 25, onTime: 98, incidents: 0 }
];

const routeEfficiencyData = [
  { route: 'HCM-HN', avgTime: '18.5h', onTime: 95, trips: 24 },
  { route: 'HN-DN', avgTime: '14.2h', onTime: 92, trips: 18 },
  { route: 'DN-HCM', avgTime: '15.8h', onTime: 96, trips: 22 },
  { route: 'HN-HP', avgTime: '2.5h', onTime: 98, trips: 35 },
  { route: 'HCM-VT', avgTime: '1.8h', onTime: 97, trips: 28 }
];

export default function OperationsReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Báo cáo Điều hành
          </h1>
          <p className="text-muted-foreground mt-2">
            Phân tích hiệu suất xe, lái xe và hiệu quả vận hành
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kỳ báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
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
                <p className="text-sm text-muted-foreground">Tổng chuyến</p>
                <p className="text-2xl font-bold text-foreground">248</p>
              </div>
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+8.3% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đúng giờ</p>
                <p className="text-2xl font-bold text-success">94.2%</p>
              </div>
              <Clock className="w-8 h-8 text-success" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+2.1% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sự cố</p>
                <p className="text-2xl font-bold text-destructive">13</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingDown className="w-4 h-4" />
              <span>-15.2% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ sử dụng xe</p>
                <p className="text-2xl font-bold text-foreground">83.5%</p>
              </div>
              <Car className="w-8 h-8 text-warning" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+3.7% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Hiệu suất theo tuần</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Số chuyến"
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="onTime" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Đúng giờ (%)"
                  dot={{ fill: 'hsl(var(--success))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-primary" />
              <span>Hiệu suất xe (Top 5)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehiclePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="vehicle" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="onTime" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} name="Đúng giờ (%)" />
                <Bar dataKey="utilization" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Sử dụng (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <span>Hiệu suất lái xe (Top 5)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {driverPerformanceData.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <p className="text-sm text-muted-foreground">{driver.trips} chuyến</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Đúng giờ</p>
                    <p className="font-bold text-success">{driver.onTime}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Đánh giá</p>
                    <p className="font-bold text-warning">{driver.rating}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Sự cố</p>
                    <p className={`font-bold ${driver.incidents > 2 ? 'text-destructive' : 'text-success'}`}>
                      {driver.incidents}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Hiệu quả tuyến đường</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routeEfficiencyData.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{route.route}</p>
                    <p className="text-sm text-muted-foreground">{route.trips} chuyến trong tháng</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Thời gian TB</p>
                    <p className="font-bold text-foreground">{route.avgTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Đúng giờ</p>
                    <p className={`font-bold ${route.onTime >= 95 ? 'text-success' : 'text-warning'}`}>
                      {route.onTime}%
                    </p>
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
