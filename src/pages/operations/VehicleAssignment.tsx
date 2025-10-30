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
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
    customer: 'VN - Công ty ABC',
    customerType: 'corporate',
    contactPerson: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'contact@abc.com',
    groupCode: 'SICD251122',
    numAdults: 40,
    numChildren: 5,
    tourType: 'Tour 1',
    tourGuideName: 'Trần Thị C',
    tourGuidePhone: '0909999888',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    route: 'HCM → Hà Nội',
    routePoints: [
      { pickup: 'HCM', dropoff: 'Hà Nội', time: '08:00', date: '2024-01-15' }
    ],
    startTime: '08:00',
    date: '2024-01-15',
    requiredVehicles: [
      { id: 1, type: '45 chỗ', notes: 'Xe đời mới, có wifi' },
      { id: 2, type: '16 chỗ', notes: 'Xe cho hành lý' }
    ],
    passengers: 40,
    priority: 'high',
    notes: 'Khách VIP, cần xe đời mới',
    services: [
      { name: 'Nước uống', quantity: 50 },
      { name: 'Khăn lạnh', quantity: 40 }
    ],
    assignedVehicles: {} as Record<number, string>,
    assignedDrivers: {} as Record<number, string>,
    assignedBy: null
  },
  {
    id: 'T002',
    booking: 'BK002',
    customer: 'QH - Công ty XYZ',
    customerType: 'corporate',
    contactPerson: 'Trần Thị B',
    phone: '0987654321',
    email: 'contact@xyz.com',
    groupCode: 'SICD251123',
    numAdults: 25,
    numChildren: 0,
    tourType: 'Tour 2',
    tourGuideName: 'Lê Văn D',
    tourGuidePhone: '0908888777',
    startDate: '2024-01-15',
    endDate: '2024-01-16',
    route: 'Đà Nẵng → Quảng Nam → HCM',
    routePoints: [
      { pickup: 'Đà Nẵng', dropoff: 'Quảng Nam', time: '14:30', date: '2024-01-15' },
      { pickup: 'Quảng Nam', dropoff: 'HCM', time: '16:00', date: '2024-01-15' }
    ],
    startTime: '14:30',
    date: '2024-01-15',
    requiredVehicles: [
      { id: 1, type: '29 chỗ', notes: '' }
    ],
    passengers: 25,
    priority: 'medium',
    notes: 'Chuyến đi theo lịch trình cố định hàng tuần',
    services: [],
    assignedVehicles: {} as Record<number, string>,
    assignedDrivers: {} as Record<number, string>,
    assignedBy: null
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [pointVehicles, setPointVehicles] = useState<Record<number, string>>({});
  const [pointDrivers, setPointDrivers] = useState<Record<number, string>>({});
  const [vehicleAssignments, setVehicleAssignments] = useState<Record<number, string>>({});
  const [driverAssignments, setDriverAssignments] = useState<Record<number, string>>({});

  const currentTrip = pendingTrips.find(t => t.id === selectedTrip);
  const isMultiPoint = currentTrip && currentTrip.routePoints.length > 2;

  // Helper function to check if two date ranges overlap
  const isDateRangeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();
    return s1 <= e2 && s2 <= e1;
  };

  // Get occupied vehicles for the current trip's date range
  const getOccupiedVehicles = () => {
    if (!currentTrip) return [];
    const occupied: string[] = [];
    
    pendingTrips.forEach(trip => {
      if (trip.id === currentTrip.id) return; // Skip current trip
      
      // Check if date ranges overlap
      if (isDateRangeOverlap(currentTrip.startDate, currentTrip.endDate, trip.startDate, trip.endDate)) {
        // Add all assigned vehicles from this trip
        Object.values(trip.assignedVehicles).forEach(vehicleId => {
          if (vehicleId && !occupied.includes(vehicleId)) {
            occupied.push(vehicleId);
          }
        });
      }
    });
    
    return occupied;
  };

  // Get occupied drivers for the current trip's date range
  const getOccupiedDrivers = () => {
    if (!currentTrip) return [];
    const occupied: string[] = [];
    
    pendingTrips.forEach(trip => {
      if (trip.id === currentTrip.id) return; // Skip current trip
      
      // Check if date ranges overlap
      if (isDateRangeOverlap(currentTrip.startDate, currentTrip.endDate, trip.startDate, trip.endDate)) {
        // Add all assigned drivers from this trip
        Object.values(trip.assignedDrivers).forEach(driverId => {
          if (driverId && !occupied.includes(driverId)) {
            occupied.push(driverId);
          }
        });
      }
    });
    
    return occupied;
  };

  const occupiedVehicles = getOccupiedVehicles();
  const occupiedDrivers = getOccupiedDrivers();

  const filteredVehicles = vehicles.filter(v => {
    // Must be available status
    if (v.status !== 'available') return false;
    
    // Must not be occupied by another booking in the same date range
    if (occupiedVehicles.includes(v.id)) return false;
    
    // Apply vehicle type filter
    if (vehicleFilter === 'all') return true;
    return v.type === vehicleFilter;
  });

  const availableDrivers = drivers.filter(d => {
    // Must be available status
    if (d.status !== 'available') return false;
    
    // Must not be occupied by another booking in the same date range
    if (occupiedDrivers.includes(d.id)) return false;
    
    return true;
  });

  const handlePointVehicleChange = (pointIndex: number, vehicleId: string) => {
    setPointVehicles(prev => ({
      ...prev,
      [pointIndex]: vehicleId
    }));
  };

  const handlePointDriverChange = (pointIndex: number, driverId: string) => {
    setPointDrivers(prev => ({
      ...prev,
      [pointIndex]: driverId
    }));
  };

  const handleVehicleAssignment = (vehicleIndex: number, vehicleId: string) => {
    setVehicleAssignments(prev => ({
      ...prev,
      [vehicleIndex]: vehicleId
    }));
  };

  const handleDriverAssignment = (vehicleIndex: number, driverId: string) => {
    setDriverAssignments(prev => ({
      ...prev,
      [vehicleIndex]: driverId
    }));
  };

  const handleAutoAssign = () => {
    if (!currentTrip) return;

    const newVehicleAssignments: Record<number, string> = {};
    const newDriverAssignments: Record<number, string> = {};
    const usedVehicles: string[] = [];
    const usedDrivers: string[] = [];

    // Auto-assign vehicles and drivers for each required vehicle
    currentTrip.requiredVehicles.forEach((reqVehicle, index) => {
      // Find best matching vehicle
      const matchingVehicle = filteredVehicles.find(v => {
        // Check if vehicle matches type requirement
        const matchesType = v.type.includes(reqVehicle.type.split(' ')[0]);
        // Check if not already used
        const notUsed = !usedVehicles.includes(v.id);
        return matchesType && notUsed;
      });

      // If exact match not found, use any available vehicle
      const selectedVehicle = matchingVehicle || filteredVehicles.find(v => !usedVehicles.includes(v.id));

      if (selectedVehicle) {
        newVehicleAssignments[index] = selectedVehicle.id;
        usedVehicles.push(selectedVehicle.id);
      }

      // Find best driver (highest rating, most experience)
      const bestDriver = availableDrivers
        .filter(d => !usedDrivers.includes(d.id))
        .sort((a, b) => {
          // Sort by rating first
          if (b.rating !== a.rating) return b.rating - a.rating;
          // Then by experience (assuming format "X năm")
          const expA = parseInt(a.experience);
          const expB = parseInt(b.experience);
          return expB - expA;
        })[0];

      if (bestDriver) {
        newDriverAssignments[index] = bestDriver.id;
        usedDrivers.push(bestDriver.id);
      }
    });

    setVehicleAssignments(newVehicleAssignments);
    setDriverAssignments(newDriverAssignments);

    toast({
      title: 'Tự động phân công thành công',
      description: `Đã tự động chọn ${Object.keys(newVehicleAssignments).length} xe và ${Object.keys(newDriverAssignments).length} lái xe phù hợp.`,
    });
  };

  const handleConfirmAssignment = () => {
    if (!currentTrip) return;

    // Show success toast
    toast({
      title: 'Phân công thành công',
      description: `Đã phân xe và lái xe cho booking ${currentTrip.booking}. Giấy đi đường đã được tạo tự động.`,
    });

    // Navigate to travel documents after 1.5 seconds
    setTimeout(() => {
      navigate('/operations/travel-documents');
    }, 1500);

    // Reset state
    setSelectedTrip(null);
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setPointVehicles({});
    setPointDrivers({});
    setVehicleAssignments({});
    setDriverAssignments({});
    setVehicleFilter('all');
  };

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
            <div className="space-y-4">
              {/* Booking Information */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">Thông tin booking đầy đủ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Mã booking</label>
                    <p className="font-medium">{currentTrip?.booking}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Khách hàng</label>
                    <p className="font-medium">{currentTrip?.customer}</p>
                    <Badge variant="outline" className="mt-1">
                      {currentTrip?.customerType === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Mã đoàn</label>
                    <p className="font-medium">{currentTrip?.groupCode}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Người liên hệ</label>
                    <p className="font-medium">{currentTrip?.contactPerson}</p>
                    <p className="text-sm text-muted-foreground">{currentTrip?.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Email</label>
                    <p className="font-medium">{currentTrip?.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Loại tour</label>
                    <p className="font-medium">{currentTrip?.tourType}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Số khách</label>
                    <p className="font-medium">{currentTrip?.numAdults} người</p>
                  </div>
                   {currentTrip?.numChildren > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground">Em bé</label>
                      <p className="font-medium">{currentTrip?.numChildren}</p>
                    </div>
                  )}
                  {currentTrip?.tourGuideName && (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground">Hướng dẫn viên</label>
                        <p className="font-medium">{currentTrip?.tourGuideName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">SĐT HDV</label>
                        <p className="font-medium">{currentTrip?.tourGuidePhone}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-xs text-muted-foreground">Ngày bắt đầu</label>
                    <p className="font-medium">{currentTrip?.startDate}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Ngày kết thúc</label>
                    <p className="font-medium">{currentTrip?.endDate}</p>
                  </div>
                  {currentTrip?.assignedBy && (
                    <div>
                      <label className="text-xs text-muted-foreground">Điều hành sắp xếp</label>
                      <p className="font-medium text-primary">{currentTrip.assignedBy}</p>
                    </div>
                  )}
                  {currentTrip?.notes && (
                    <div className="col-span-3">
                      <label className="text-xs text-muted-foreground">Ghi chú</label>
                      <p className="text-sm">{currentTrip.notes}</p>
                    </div>
                  )}
                  {currentTrip?.services && currentTrip.services.length > 0 && (
                    <div className="col-span-3">
                      <label className="text-xs text-muted-foreground">Dịch vụ đi kèm</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentTrip.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary">
                            {service.name} x{service.quantity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle assignments from booking */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Phân xe & lái xe (Kế thừa từ booking: {currentTrip?.requiredVehicles.length} xe)
                  </label>
                  <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Lọc theo dòng xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả xe</SelectItem>
                      <SelectItem value="4 chỗ">4 chỗ</SelectItem>
                      <SelectItem value="7 chỗ">7 chỗ</SelectItem>
                      <SelectItem value="16 chỗ">16 chỗ</SelectItem>
                      <SelectItem value="29 chỗ">29 chỗ</SelectItem>
                      <SelectItem value="35 chỗ">35 chỗ</SelectItem>
                      <SelectItem value="45 chỗ">45 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  {currentTrip?.requiredVehicles.map((reqVehicle, index) => (
                    <div key={reqVehicle.id} className="p-4 bg-muted/50 rounded-lg space-y-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-sm">Xe {index + 1}</Badge>
                          <Badge variant="secondary">{reqVehicle.type}</Badge>
                        </div>
                        {reqVehicle.notes && (
                          <span className="text-xs text-muted-foreground">{reqVehicle.notes}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            Chọn xe {reqVehicle.type}
                          </label>
                          <Select 
                            value={vehicleAssignments[index] || ''} 
                            onValueChange={(value) => handleVehicleAssignment(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Chọn xe ${reqVehicle.type}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredVehicles
                                .filter(v => vehicleFilter === 'all' || v.type.includes(reqVehicle.type.split(' ')[0]))
                                .map((vehicle) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.license} - {vehicle.type}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Chọn lái xe
                          </label>
                          <Select 
                            value={driverAssignments[index] || ''} 
                            onValueChange={(value) => handleDriverAssignment(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn lái xe" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDrivers.map((driver) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                  {driver.name} - {driver.license}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  💡 Số lượng và loại xe được kế thừa từ booking. Vui lòng chọn xe và lái xe cho từng xe.
                </p>
              </div>

              {isMultiPoint && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Hành trình đa điểm - Phân xe & lái xe cho từng chặng</label>
                    <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Lọc theo dòng xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả xe</SelectItem>
                        <SelectItem value="7 chỗ">7 chỗ</SelectItem>
                        <SelectItem value="16 chỗ">16 chỗ</SelectItem>
                        <SelectItem value="29 chỗ">29 chỗ</SelectItem>
                        <SelectItem value="45 chỗ">45 chỗ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    {currentTrip?.routePoints.map((point, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-3 border border-border">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-sm">Chặng {index + 1}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <div>
                                <span className="font-medium">Điểm đón: </span>
                                <span>{point.pickup}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-red-600" />
                              <div>
                                <span className="font-medium">Điểm trả: </span>
                                <span>{point.dropoff}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-primary" />
                              <div>
                                <span className="font-medium">Ngày: </span>
                                <span>{point.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-primary" />
                              <div>
                                <span className="font-medium">Giờ: </span>
                                <span>{point.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Chọn xe
                            </label>
                            <Select 
                              value={pointVehicles[index] || ''} 
                              onValueChange={(value) => handlePointVehicleChange(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn xe cho chặng này" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredVehicles.map((vehicle) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.license} - {vehicle.type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Chọn lái xe
                            </label>
                            <Select 
                              value={pointDrivers[index] || ''} 
                              onValueChange={(value) => handlePointDriverChange(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn lái xe cho chặng này" />
                              </SelectTrigger>
                              <SelectContent>
                                {drivers.filter(d => d.status === 'available').map((driver) => (
                                  <SelectItem key={driver.id} value={driver.id}>
                                    {driver.name} - {driver.license}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    💡 Có thể chọn xe và lái xe khác nhau cho mỗi chặng hoặc giữ nguyên cho cả hành trình
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="secondary" 
                onClick={handleAutoAssign}
                disabled={isMultiPoint || !currentTrip || filteredVehicles.length === 0 || availableDrivers.length === 0}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tự động phân xe
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => {
                  setSelectedTrip(null);
                  setSelectedVehicle(null);
                  setSelectedDriver(null);
                  setPointVehicles({});
                  setPointDrivers({});
                  setVehicleAssignments({});
                  setDriverAssignments({});
                  setVehicleFilter('all');
                }}>
                  Hủy
                </Button>
                <Button 
                  className="bg-success"
                  onClick={handleConfirmAssignment}
                  disabled={
                    isMultiPoint 
                      ? Object.keys(pointVehicles).length === 0 || Object.keys(pointDrivers).length === 0
                      : Object.keys(vehicleAssignments).length !== currentTrip?.requiredVehicles.length ||
                        Object.keys(driverAssignments).length !== currentTrip?.requiredVehicles.length
                  }
                >
                  Xác nhận phân công
                </Button>
              </div>
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
                  {trip.routePoints.length > 1 && (
                    <div className="mt-2 space-y-1">
                      <Badge variant="outline" className="text-xs">
                        Hành trình {trip.routePoints.length} chặng
                      </Badge>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {trip.routePoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{point.pickup} → {point.dropoff} ({point.time})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{trip.date} - {trip.startTime}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Xe yêu cầu:</p>
                    {trip.requiredVehicles.map((vehicle, idx) => (
                      <Badge key={idx} variant="secondary" className="mr-1">
                        {vehicle.type}
                      </Badge>
                    ))}
                  </div>
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
