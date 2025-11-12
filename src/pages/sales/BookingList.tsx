import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Eye, Edit, Trash2, Calendar, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoutePoint {
  location: string;
  datetime: string;
}

interface Vehicle {
  type: string;
  licensePlate?: string;
  driver?: string;
}

const bookings = [
  {
    id: 'BK001',
    customer: 'Công ty TNHH ABC',
    customerType: 'corporate' as const,
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    routePoints: [
      { location: 'HCM', datetime: '2024-01-15 08:00' },
      { location: 'Bình Dương', datetime: '2024-01-15 10:00' },
      { location: 'Hà Nội', datetime: '2024-01-15 18:00' }
    ],
    vehicles: [
      { type: '7 chỗ', licensePlate: '30A-123.45', driver: 'Trần Văn B' },
      { type: '7 chỗ', licensePlate: '30A-123.46', driver: 'Lê Văn C' }
    ],
    status: 'confirmed',
    value: 15000000,
    created: '2024-01-10'
  },
  {
    id: 'BK002',
    customer: 'Lê Thị C',
    customerType: 'individual' as const,
    contact: 'Lê Thị C',
    phone: '0987654321',
    routePoints: [
      { location: 'Đà Nẵng', datetime: '2024-01-16 14:30' },
      { location: 'HCM', datetime: '2024-01-16 20:00' }
    ],
    vehicles: [
      { type: '4 chỗ', licensePlate: 'Chưa phân', driver: 'Chưa phân' }
    ],
    status: 'pending',
    value: 8500000,
    created: '2024-01-11'
  },
  {
    id: 'BK003',
    customer: 'Công ty DEF',
    customerType: 'corporate' as const,
    contact: 'Phạm Văn D',
    phone: '0912345678',
    routePoints: [
      { location: 'Hà Nội', datetime: '2024-01-17 10:00' },
      { location: 'Hải Phòng', datetime: '2024-01-17 12:30' }
    ],
    vehicles: [
      { type: '16 chỗ', licensePlate: '51B-678.90', driver: 'Hoàng Văn E' }
    ],
    status: 'in_progress',
    value: 5200000,
    created: '2024-01-12'
  },
  {
    id: 'BK004',
    customer: 'Công ty GHI',
    customerType: 'corporate' as const,
    contact: 'Võ Thị F',
    phone: '0923456789',
    routePoints: [
      { location: 'Cần Thơ', datetime: '2024-01-14 16:00' },
      { location: 'HCM', datetime: '2024-01-14 19:00' }
    ],
    vehicles: [
      { type: '7 chỗ', licensePlate: '92C-111.22', driver: 'Nguyễn Văn G' }
    ],
    status: 'completed',
    value: 3200000,
    created: '2024-01-09'
  }
];

const statusConfig = {
  pending: { label: 'Chờ xử lý', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'Đang thực hiện', variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
  completed: { label: 'Hoàn thành', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Đã hủy', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
};

export default function BookingList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  const filteredBookings = bookings.filter(booking => {
    const routeString = booking.routePoints.map(p => p.location).join(' → ');
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routeString.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(b => b.id));
    }
  };

  const handlePrintSelected = () => {
    if (selectedBookings.length === 0) return;
    const ids = selectedBookings.join(',');
    navigate(`/sales/bookings/print?ids=${ids}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh sách Booking</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý đặt chỗ và lịch trình vận chuyển
          </p>
        </div>
        <div className="flex gap-2">
          {selectedBookings.length > 0 && (
            <Button variant="secondary" onClick={handlePrintSelected}>
              <Printer className="w-4 h-4 mr-2" />
              In {selectedBookings.length} booking
            </Button>
          )}
          <Button onClick={() => navigate('/sales/bookings/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo booking mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã booking, khách hàng, tuyến đường..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Tổng booking</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang thực hiện</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {formatCurrency(bookings.reduce((sum, b) => sum + b.value, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Tổng giá trị</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách booking ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </TableHead>
                <TableHead>Mã booking</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Hành trình đa điểm</TableHead>
                <TableHead>Xe & Lái xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                      className="cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{booking.customer}</span>
                        <Badge variant="outline" className={booking.customerType === 'corporate' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {booking.customerType === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.contact} - {booking.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.routePoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="flex items-center gap-1 min-w-0">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(point.datetime).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{point.location}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.vehicles.map((vehicle, idx) => (
                        <div key={idx} className="text-sm">
                          <Badge variant="secondary" className="mr-1">{vehicle.type}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {vehicle.licensePlate} - {vehicle.driver}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusConfig[booking.status as keyof typeof statusConfig].variant}
                      className={statusConfig[booking.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[booking.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-success">
                    {formatCurrency(booking.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1.5"
                        onClick={() => navigate(`/sales/bookings/${booking.id}`)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="gap-1.5"
                        onClick={() => navigate(`/sales/bookings/${booking.id}/print`)}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        In
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="gap-1.5"
                        onClick={() => navigate(`/sales/bookings/${booking.id}/edit`)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Sửa
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
