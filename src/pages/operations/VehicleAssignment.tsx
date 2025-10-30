import React, { useState, useMemo } from 'react';
import { Car, User, MapPin, Clock, Search, Plus, Filter, Calendar } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

// Assigned bookings with vehicles and drivers
const assignedBookings = [
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
    assignedVehicles: {
      0: 'V001',
      1: 'V003'
    },
    assignedDrivers: {
      0: 'D001',
      1: 'D003'
    },
    assignedBy: 'Nguyễn Văn X',
    status: 'assigned'
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
    startDate: '2024-01-16',
    endDate: '2024-01-17',
    route: 'Đà Nẵng → Quảng Nam → HCM',
    routePoints: [
      { pickup: 'Đà Nẵng', dropoff: 'Quảng Nam', time: '14:30', date: '2024-01-16' },
      { pickup: 'Quảng Nam', dropoff: 'HCM', time: '16:00', date: '2024-01-16' }
    ],
    startTime: '14:30',
    date: '2024-01-16',
    requiredVehicles: [
      { id: 1, type: '29 chỗ', notes: '' }
    ],
    passengers: 25,
    priority: 'medium',
    notes: 'Chuyến đi theo lịch trình cố định hàng tuần',
    services: [],
    assignedVehicles: {
      0: 'V002'
    },
    assignedDrivers: {
      0: 'D002'
    },
    assignedBy: 'Trần Văn Y',
    status: 'assigned'
  },
  {
    id: 'T003',
    booking: 'BK003',
    customer: 'Lê Thị C',
    customerType: 'individual',
    contactPerson: 'Lê Thị C',
    phone: '0912345678',
    email: 'lethic@gmail.com',
    groupCode: 'SICD251124',
    numAdults: 8,
    numChildren: 2,
    tourType: 'Tour gia đình',
    tourGuideName: '',
    tourGuidePhone: '',
    startDate: '2024-01-18',
    endDate: '2024-01-20',
    route: 'HCM → Đà Lạt',
    routePoints: [
      { pickup: 'HCM', dropoff: 'Đà Lạt', time: '06:00', date: '2024-01-18' }
    ],
    startTime: '06:00',
    date: '2024-01-18',
    requiredVehicles: [
      { id: 1, type: '16 chỗ', notes: 'Xe VIP có màn hình' }
    ],
    passengers: 10,
    priority: 'low',
    notes: '',
    services: [],
    assignedVehicles: {
      0: 'V001'
    },
    assignedDrivers: {
      0: 'D003'
    },
    assignedBy: 'Nguyễn Văn X',
    status: 'assigned'
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
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get unique dates from bookings
  const availableDates = useMemo(() => {
    const dates = assignedBookings.map(b => b.date);
    return Array.from(new Set(dates)).sort();
  }, []);

  // Filter bookings based on search, date, and status
  const filteredBookings = useMemo(() => {
    return assignedBookings.filter(booking => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        booking.booking.toLowerCase().includes(searchLower) ||
        booking.customer.toLowerCase().includes(searchLower) ||
        booking.groupCode.toLowerCase().includes(searchLower) ||
        booking.route.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;

      // Date filter
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        if (booking.date !== today) return false;
      } else if (dateFilter === 'custom' && selectedDate) {
        if (booking.date !== selectedDate) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by date ascending (earliest first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [searchTerm, dateFilter, selectedDate, statusFilter]);

  const getVehicleInfo = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getDriverInfo = (driverId: string) => {
    return drivers.find(d => d.id === driverId);
  };

  const handleViewDetails = (bookingId: string) => {
    toast({
      title: 'Xem chi tiết',
      description: `Đang mở chi tiết booking ${bookingId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phân xe & Phân lái xe</h1>
          <p className="text-muted-foreground mt-2">
            Danh sách booking đã được phân công xe và lái xe
          </p>
        </div>
        <Button className="bg-primary">
          <Plus className="w-4 h-4 mr-2" />
          Phân công mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm booking, khách hàng, mã đoàn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ngày</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="custom">Chọn ngày cụ thể</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="assigned">Đã phân công</SelectItem>
                <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Picker */}
          {dateFilter === 'custom' && (
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Chọn ngày:</label>
              <div className="flex gap-2">
                {availableDates.map(date => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDate(date)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {date}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách booking đã phân xe</span>
            <Badge variant="secondary">{filteredBookings.length} booking</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã booking</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Mã đoàn</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Tuyến đường</TableHead>
                  <TableHead>Xe phân công</TableHead>
                  <TableHead>Lái xe</TableHead>
                  <TableHead>Điều hành</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Không tìm thấy booking phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => {
                    const assignedVehicleIds = Object.values(booking.assignedVehicles);
                    const assignedDriverIds = Object.values(booking.assignedDrivers);
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.booking}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {booking.customerType === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.customer}</div>
                          <div className="text-xs text-muted-foreground">{booking.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{booking.groupCode}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm">{booking.date}</div>
                              <div className="text-xs text-muted-foreground">{booking.startTime}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm">{booking.route}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {assignedVehicleIds.map((vehicleId, idx) => {
                              const vehicle = getVehicleInfo(vehicleId);
                              return vehicle ? (
                                <div key={idx} className="flex items-center gap-2">
                                  <Car className="w-3 h-3 text-primary" />
                                  <span className="text-xs">{vehicle.license} ({vehicle.type})</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {assignedDriverIds.map((driverId, idx) => {
                              const driver = getDriverInfo(driverId);
                              return driver ? (
                                <div key={idx} className="flex items-center gap-2">
                                  <User className="w-3 h-3 text-success" />
                                  <span className="text-xs">{driver.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{booking.assignedBy}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(booking.booking)}
                          >
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
