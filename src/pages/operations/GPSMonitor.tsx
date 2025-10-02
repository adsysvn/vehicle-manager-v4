import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Car, Fuel, AlertTriangle, Phone, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const activeVehicles = [
  {
    id: 'V001',
    license: '30A-123.45',
    driver: 'Nguyễn Văn A',
    phone: '0901234567',
    currentLocation: { lat: 10.762622, lng: 106.660172, address: 'Quận 1, TP.HCM' },
    destination: { lat: 21.028511, lng: 105.804817, address: 'Hà Nội' },
    route: 'HCM → Hà Nội',
    progress: 45,
    speed: 75,
    fuel: 68,
    status: 'moving',
    eta: '15:30 - 16/01/2024',
    booking: 'BK001',
    lastUpdate: '2024-01-15 14:25'
  },
  {
    id: 'V002',
    license: '51B-678.90',
    driver: 'Trần Văn B',
    phone: '0987654321',
    currentLocation: { lat: 16.047079, lng: 108.206230, address: 'Đà Nẵng' },
    destination: { lat: 10.762622, lng: 106.660172, address: 'TP.HCM' },
    route: 'Đà Nẵng → HCM',
    progress: 23,
    speed: 0,
    fuel: 45,
    status: 'stopped',
    eta: '09:00 - 17/01/2024',
    booking: 'BK002',
    lastUpdate: '2024-01-15 14:20'
  },
  {
    id: 'V003',
    license: '92C-111.22',
    driver: 'Lê Văn C',
    phone: '0912345678',
    currentLocation: { lat: 20.984439, lng: 105.787930, address: 'Hà Nội' },
    destination: { lat: 20.844914, lng: 106.687897, address: 'Hải Phòng' },
    route: 'Hà Nội → Hải Phòng',
    progress: 78,
    speed: 65,
    fuel: 82,
    status: 'moving',
    eta: '16:45 - 15/01/2024',
    booking: 'BK003',
    lastUpdate: '2024-01-15 14:28'
  },
  {
    id: 'V004',
    license: '43A-987.65',
    driver: 'Phạm Văn D',
    phone: '0934567890',
    currentLocation: { lat: 12.238791, lng: 109.196749, address: 'Nha Trang' },
    destination: { lat: 16.047079, lng: 108.206230, address: 'Đà Nẵng' },
    route: 'Nha Trang → Đà Nẵng',
    progress: 55,
    speed: 80,
    fuel: 72,
    status: 'moving',
    eta: '18:20 - 15/01/2024',
    booking: 'BK004',
    lastUpdate: '2024-01-15 14:30'
  }
];

const alerts = [
  {
    id: 'A001',
    vehicleId: 'V002',
    license: '51B-678.90',
    type: 'Dừng lâu',
    message: 'Xe dừng quá 30 phút tại Đà Nẵng',
    severity: 'warning',
    time: '14:20',
    location: 'Đà Nẵng'
  },
  {
    id: 'A002',
    vehicleId: 'V001',
    license: '30A-123.45',
    type: 'Tốc độ cao',
    message: 'Vượt quá tốc độ cho phép (85km/h)',
    severity: 'medium',
    time: '14:15',
    location: 'Cao tốc Trung Lương'
  },
  {
    id: 'A003',
    vehicleId: 'V004',
    license: '43A-987.65',
    type: 'Nhiên liệu thấp',
    message: 'Mức nhiên liệu dưới 30%',
    severity: 'low',
    time: '14:10',
    location: 'Phan Rang'
  }
];

const statusConfig = {
  moving: { label: 'Đang di chuyển', color: 'bg-green-100 text-green-800', icon: '🚛' },
  stopped: { label: 'Đã dừng', color: 'bg-yellow-100 text-yellow-800', icon: '⏸️' },
  offline: { label: 'Mất kết nối', color: 'bg-red-100 text-red-800', icon: '📡' },
  maintenance: { label: 'Bảo dưỡng', color: 'bg-gray-100 text-gray-800', icon: '🔧' }
};

const alertConfig = {
  high: { label: 'Cao', color: 'bg-red-100 text-red-800' },
  warning: { label: 'Cảnh báo', color: 'bg-yellow-100 text-yellow-800' },
  medium: { label: 'Trung bình', color: 'bg-orange-100 text-orange-800' },
  low: { label: 'Thấp', color: 'bg-blue-100 text-blue-800' }
};

export default function GPSMonitor() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const getSpeedColor = (speed: number) => {
    if (speed === 0) return 'text-gray-500';
    if (speed > 80) return 'text-red-500';
    if (speed > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 30) return 'text-red-500';
    if (fuel < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Giám sát GPS</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi vị trí và hành trình xe theo thời gian thực
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button className="bg-primary">
            <MapPin className="w-4 h-4 mr-2" />
            Xem bản đồ
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {activeVehicles.filter(v => v.status === 'moving').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang di chuyển</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {activeVehicles.filter(v => v.status === 'stopped').length}
              </div>
              <div className="text-sm text-muted-foreground">Đã dừng</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.severity === 'warning' || a.severity === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Cảnh báo</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {Math.round(activeVehicles.reduce((sum, v) => sum + v.progress, 0) / activeVehicles.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Tiến độ TB</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Bản đồ theo dõi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative">
              {/* Simulated Map */}
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Bản đồ GPS</p>
                <p className="text-sm">Tích hợp Mapbox/Google Maps</p>
              </div>
              
              {/* Vehicle Markers Simulation */}
              <div className="absolute top-4 left-4 space-y-2">
                {activeVehicles.slice(0, 3).map((vehicle, index) => (
                  <div 
                    key={vehicle.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedVehicle === vehicle.id ? 'bg-primary text-white' : 'bg-card hover:bg-muted'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    style={{
                      position: 'absolute',
                      top: `${20 + index * 60}%`,
                      left: `${30 + index * 20}%`
                    }}
                  >
                    <Car className="w-4 h-4" />
                    <span className="text-xs font-medium">{vehicle.license}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>Cảnh báo ({alerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={alertConfig[alert.severity as keyof typeof alertConfig].color}>
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <div className="mb-2">
                    <p className="font-medium text-sm">{alert.license}</p>
                    <p className="text-xs text-muted-foreground">{alert.location}</p>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <div className="flex justify-end space-x-1 mt-2">
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      <Phone className="w-3 h-3 mr-1" />
                      Gọi
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe đang hoạt động ({activeVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeVehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                  selectedVehicle === vehicle.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10">
                        <Car className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{vehicle.license}</h4>
                      <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                    </div>
                  </div>
                  <Badge className={statusConfig[vehicle.status as keyof typeof statusConfig].color}>
                    {statusConfig[vehicle.status as keyof typeof statusConfig].icon} {statusConfig[vehicle.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{vehicle.route}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span>Tiến độ: {vehicle.progress}% - ETA: {vehicle.eta}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getSpeedColor(vehicle.speed)}`}>
                      {vehicle.speed}
                    </div>
                    <div className="text-xs text-muted-foreground">km/h</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getFuelColor(vehicle.fuel)}`}>
                      {vehicle.fuel}%
                    </div>
                    <div className="text-xs text-muted-foreground">Nhiên liệu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {vehicle.progress}%
                    </div>
                    <div className="text-xs text-muted-foreground">Hoàn thành</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Booking: {vehicle.booking}</span>
                    <span>Cập nhật: {vehicle.lastUpdate}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Gọi
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-1" />
                    Vị trí
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">
              Chi tiết xe {activeVehicles.find(v => v.id === selectedVehicle)?.license}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const vehicle = activeVehicles.find(v => v.id === selectedVehicle);
              if (!vehicle) return null;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium">Thông tin chuyến đi</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tuyến đường:</span>
                        <span className="font-medium">{vehicle.route}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Booking:</span>
                        <span className="font-medium">{vehicle.booking}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vị trí hiện tại:</span>
                        <span className="font-medium">{vehicle.currentLocation.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Điểm đến:</span>
                        <span className="font-medium">{vehicle.destination.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-medium">Thông tin lái xe</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tên lái xe:</span>
                        <span className="font-medium">{vehicle.driver}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Số điện thoại:</span>
                        <span className="font-medium">{vehicle.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cập nhật cuối:</span>
                        <span className="font-medium">{vehicle.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}