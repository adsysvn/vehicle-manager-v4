import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Car,
  Wrench,
  Gauge,
  Fuel
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
  AreaChart,
  Area
} from 'recharts';

const kmExploitationData = [
  { month: 'T1', km: 45000, vehicles: 68, avgPerVehicle: 662 },
  { month: 'T2', km: 48500, vehicles: 68, avgPerVehicle: 713 },
  { month: 'T3', km: 52000, vehicles: 68, avgPerVehicle: 765 },
  { month: 'T4', km: 55200, vehicles: 68, avgPerVehicle: 812 },
  { month: 'T5', km: 58800, vehicles: 68, avgPerVehicle: 865 },
  { month: 'T6', km: 62000, vehicles: 68, avgPerVehicle: 912 }
];

const maintenanceCostData = [
  { month: 'T1', planned: 28000000, unplanned: 15000000, total: 43000000 },
  { month: 'T2', planned: 32000000, unplanned: 12000000, total: 44000000 },
  { month: 'T3', planned: 30000000, unplanned: 18000000, total: 48000000 },
  { month: 'T4', planned: 35000000, unplanned: 10000000, total: 45000000 },
  { month: 'T5', planned: 38000000, unplanned: 14000000, total: 52000000 },
  { month: 'T6', planned: 40000000, unplanned: 10000000, total: 50000000 }
];

const vehicleKmData = [
  { vehicle: '30A-123', totalKm: 125000, monthKm: 5200, maintenance: 3, status: 'good' },
  { vehicle: '51B-678', totalKm: 98000, monthKm: 4800, maintenance: 2, status: 'good' },
  { vehicle: '92C-111', totalKm: 142000, monthKm: 5800, maintenance: 4, status: 'warning' },
  { vehicle: '29D-456', totalKm: 87000, monthKm: 4200, maintenance: 2, status: 'good' },
  { vehicle: '43E-789', totalKm: 156000, monthKm: 6100, maintenance: 5, status: 'critical' },
  { vehicle: '88F-234', totalKm: 105000, monthKm: 4900, maintenance: 3, status: 'good' }
];

const fuelConsumptionData = [
  { month: 'T1', consumption: 8500, cost: 170000000, avgPrice: 20000 },
  { month: 'T2', consumption: 9200, cost: 184000000, avgPrice: 20000 },
  { month: 'T3', consumption: 9800, cost: 206000000, avgPrice: 21000 },
  { month: 'T4', consumption: 10200, cost: 214200000, avgPrice: 21000 },
  { month: 'T5', consumption: 10800, cost: 237600000, avgPrice: 22000 },
  { month: 'T6', consumption: 11200, cost: 246400000, avgPrice: 22000 }
];

export default function TransportReports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Báo cáo Vận tải
          </h1>
          <p className="text-muted-foreground mt-2">
            Phân tích km khai thác, bảo trì và chi phí nhiên liệu
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
                <p className="text-sm text-muted-foreground">Tổng km tháng</p>
                <p className="text-2xl font-bold text-foreground">62,000</p>
              </div>
              <Gauge className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+5.4% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chi phí bảo trì</p>
                <p className="text-2xl font-bold text-foreground">50 triệu</p>
              </div>
              <Wrench className="w-8 h-8 text-warning" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
              <TrendingUp className="w-4 h-4" />
              <span>+3.8% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiêu hao nhiên liệu</p>
                <p className="text-2xl font-bold text-foreground">11,200 lít</p>
              </div>
              <Fuel className="w-8 h-8 text-destructive" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
              <TrendingUp className="w-4 h-4" />
              <span>+3.7% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">TB km/xe</p>
                <p className="text-2xl font-bold text-foreground">912</p>
              </div>
              <Car className="w-8 h-8 text-success" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>+5.4% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KM Exploitation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-primary" />
              <span>Km khai thác theo tháng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={kmExploitationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [`${value.toLocaleString()} km`]}
                />
                <Area 
                  type="monotone" 
                  dataKey="km" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Tổng km"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Cost */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-primary" />
              <span>Chi phí bảo trì</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [`${(value / 1000000).toFixed(1)} triệu`]}
                />
                <Legend />
                <Bar dataKey="planned" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} name="Kế hoạch" />
                <Bar dataKey="unplanned" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Đột xuất" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Consumption */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-primary" />
            <span>Tiêu hao nhiên liệu & Chi phí</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={fuelConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="consumption" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Tiêu hao (lít)"
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="cost" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={3}
                name="Chi phí (VNĐ)"
                dot={{ fill: 'hsl(var(--destructive))', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vehicle KM Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-primary" />
            <span>Chi tiết km theo xe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vehicleKmData.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <Car className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{vehicle.vehicle}</p>
                    <p className="text-sm text-muted-foreground">
                      Tổng: {vehicle.totalKm.toLocaleString()} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Km tháng này</p>
                    <p className="font-bold text-foreground">{vehicle.monthKm.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Bảo trì</p>
                    <p className="font-bold text-warning">{vehicle.maintenance} lần</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tình trạng</p>
                    <p className={`font-bold ${
                      vehicle.status === 'good' ? 'text-success' :
                      vehicle.status === 'warning' ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {vehicle.status === 'good' ? 'Tốt' :
                       vehicle.status === 'warning' ? 'Cảnh báo' : 'Cần kiểm tra'}
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
