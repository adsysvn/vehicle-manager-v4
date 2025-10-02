import React, { useState } from 'react';
import { Car, User, MapPin, Clock, Search, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const vehicles = [
  {
    id: 'V001',
    license: '30A-123.45',
    type: 'Xe tải 5 tấn',
    status: 'available',
    location: 'Bãi xe HCM',
    fuel: 85,
    lastMaintenance: '2024-01-01'
  },
  {
    id: 'V002',
    license: '51B-678.90',
    type: 'Xe tải 10 tấn',
    status: 'in_use',
    location: 'Đang vận chuyển',
    fuel: 45,
    currentTrip: 'HCM → Hà Nội'
  },
  {
    id: 'V003',
    license: '92C-111.22',
    type: 'Xe container',
    status: 'maintenance',
    location: 'Garage Bình Dương',
    fuel: 0,
    maintenanceNote: 'Thay lốp, bảo dưỡng định kỳ'
  }
];

const drivers = [
  {
    id: 'D001',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    license: 'B2, C, E',
    status: 'available',
    experience: '5 năm',
    rating: 4.8,
    location: 'HCM'
  },
  {
    id: 'D002',
    name: 'Trần Văn B',
    phone: '0987654321',
    license: 'B2, C',
    status: 'driving',
    experience: '3 năm',
    rating: 4.5,
    currentTrip: 'HCM → Hà Nội'
  },
  {
    id: 'D003',
    name: 'Lê Văn C',
    phone: '0912345678',
    license: 'B2, C, D, E',
    status: 'rest',
    experience: '8 năm',
    rating: 4.9,
    restUntil: '14:00'
  }
];

const pendingTrips = [
  {
    id: 'T001',
    booking: 'BK001',
    customer: 'Công ty ABC',
    route: 'HCM → Hà Nội',
    startTime: '08:00',
    date: '2024-01-15',
    vehicleType: 'Xe tải 5 tấn',
    priority: 'high'
  },
  {
    id: 'T002',
    booking: 'BK002',
    customer: 'Công ty XYZ',
    route: 'Đà Nẵng → HCM',
    startTime: '14:30',
    date: '2024-01-15',
    vehicleType: 'Xe tải 10 tấn',
    priority: 'medium'
  }
];

const statusConfig = {
  available: { label: 'Sẵn sàng', color: 'bg-green-100 text-green-800' },
  in_use: { label: 'Đang sử dụng', color: 'bg-blue-100 text-blue-800' },
  maintenance: { label: 'Bảo dưỡng', color: 'bg-yellow-100 text-yellow-800' },
  driving: { label: 'Đang lái', color: 'bg-blue-100 text-blue-800' },
  rest: { label: 'Nghỉ ngơi', color: 'bg-gray-100 text-gray-800' }
};

export default function VehicleAssignment() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phân xe & Phân lái xe</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý phân công xe và lái xe cho các chuyến đi
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Phân công mới
          </Button>
        </div>
      </div>

      {/* Assignment Form */}
      {selectedTrip && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">Đang phân công chuyến đi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chuyến đi</label>
                <div className="p-3 bg-muted rounded-lg">
                  {pendingTrips.find(t => t.id === selectedTrip)?.route}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Xe được chọn</label>
                <div className="p-3 bg-muted rounded-lg">
                  {selectedVehicle ? vehicles.find(v => v.id === selectedVehicle)?.license : 'Chưa chọn'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lái xe được chọn</label>
                <div className="p-3 bg-muted rounded-lg">
                  {selectedDriver ? drivers.find(d => d.id === selectedDriver)?.name : 'Chưa chọn'}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => {
                setSelectedTrip(null);
                setSelectedVehicle(null);
                setSelectedDriver(null);
              }}>
                Hủy
              </Button>
              <Button 
                className="bg-success"
                disabled={!selectedVehicle || !selectedDriver}
              >
                Xác nhận phân công
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pending Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-warning" />
              <span>Chuyến đi chờ phân công</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTrips.map((trip) => (
                <div 
                  key={trip.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTrip === trip.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTrip(trip.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{trip.booking}</span>
                    <Badge 
                      variant={trip.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {trip.priority === 'high' ? 'Ưu tiên cao' : 'Bình thường'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{trip.customer}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{trip.route}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{trip.date} - {trip.startTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{trip.vehicleType}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-primary" />
              <span>Xe khả dụng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.filter(v => v.status === 'available').map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle === vehicle.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{vehicle.license}</span>
                    <Badge className={statusConfig[vehicle.status as keyof typeof statusConfig].color}>
                      {statusConfig[vehicle.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{vehicle.type}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Nhiên liệu:</span>
                    <span className={vehicle.fuel > 50 ? 'text-success' : vehicle.fuel > 20 ? 'text-warning' : 'text-destructive'}>
                      {vehicle.fuel}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Drivers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-success" />
              <span>Lái xe khả dụng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {drivers.filter(d => d.status === 'available').map((driver) => (
                <div 
                  key={driver.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDriver === driver.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedDriver(driver.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{driver.name}</span>
                        <Badge className={statusConfig[driver.status as keyof typeof statusConfig].color}>
                          {statusConfig[driver.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{driver.phone}</p>
                      <p className="text-sm text-muted-foreground">Bằng lái: {driver.license}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Kinh nghiệm:</span>
                        <span>{driver.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đánh giá:</span>
                        <span className="text-warning">⭐ {driver.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Vehicles and Drivers Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng tất cả xe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{vehicle.license}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusConfig[vehicle.status as keyof typeof statusConfig].color}>
                      {statusConfig[vehicle.status as keyof typeof statusConfig].label}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{vehicle.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng tất cả lái xe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {drivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusConfig[driver.status as keyof typeof statusConfig].color}>
                      {statusConfig[driver.status as keyof typeof statusConfig].label}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {driver.status === 'driving' && driver.currentTrip ? driver.currentTrip : 
                       driver.status === 'rest' && driver.restUntil ? `Nghỉ đến ${driver.restUntil}` : 
                       driver.location}
                    </p>
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