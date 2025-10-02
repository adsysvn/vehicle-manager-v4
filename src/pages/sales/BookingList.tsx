import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit, Trash2, Calendar } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const bookings = [
  {
    id: 'BK001',
    customer: 'Công ty TNHH ABC',
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    route: 'HCM → Hà Nội',
    date: '2024-01-15',
    time: '08:00',
    vehicle: '30A-123.45',
    driver: 'Trần Văn B',
    status: 'confirmed',
    value: 15000000,
    created: '2024-01-10'
  },
  {
    id: 'BK002',
    customer: 'Công ty XYZ',
    contact: 'Lê Thị C',
    phone: '0987654321',
    route: 'Đà Nẵng → HCM',
    date: '2024-01-16',
    time: '14:30',
    vehicle: 'Chưa phân',
    driver: 'Chưa phân',
    status: 'pending',
    value: 8500000,
    created: '2024-01-11'
  },
  {
    id: 'BK003',
    customer: 'Công ty DEF',
    contact: 'Phạm Văn D',
    phone: '0912345678',
    route: 'Hà Nội → Hải Phòng',
    date: '2024-01-17',
    time: '10:00',
    vehicle: '51B-678.90',
    driver: 'Hoàng Văn E',
    status: 'in_progress',
    value: 5200000,
    created: '2024-01-12'
  },
  {
    id: 'BK004',
    customer: 'Công ty GHI',
    contact: 'Võ Thị F',
    phone: '0923456789',
    route: 'Cần Thơ → HCM',
    date: '2024-01-14',
    time: '16:00',
    vehicle: '92C-111.22',
    driver: 'Nguyễn Văn G',
    status: 'completed',
    value: 3200000,
    created: '2024-01-09'
  }
];

// Available drivers with trip status
const availableDrivers = [
  { id: 'none', name: 'Không chọn', trips: 0, available: true },
  { id: 'D001', name: 'Trần Văn B', trips: 0, available: true },
  { id: 'D002', name: 'Hoàng Văn E', trips: 1, available: true },
  { id: 'D003', name: 'Nguyễn Văn G', trips: 2, available: true },
  { id: 'D004', name: 'Lê Văn H', trips: 5, available: false }
];

// Available services
const availableServices = [
  { id: 'water', name: 'Dịch vụ nước lọc', price: 50000 },
  { id: 'towel', name: 'Dịch vụ khăn nước', price: 30000 },
  { id: 'insurance', name: 'Bảo hiểm hành trình', price: 100000 },
  { id: 'guide', name: 'Hướng dẫn viên', price: 500000 }
];

const statusConfig = {
  pending: { label: 'Chờ xử lý', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'Đang thực hiện', variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
  completed: { label: 'Hoàn thành', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Đã hủy', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
};

export default function BookingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('none');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleCreateBooking = () => {
    // Handle booking creation logic here
    console.log('Driver:', selectedDriver);
    console.log('Services:', selectedServices);
    setIsDialogOpen(false);
    setSelectedDriver('none');
    setSelectedServices([]);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Tạo booking mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo booking mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho booking mới
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Khách hàng</Label>
                  <Input id="customer" placeholder="Tên công ty/khách hàng" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Người liên hệ</Label>
                  <Input id="contact" placeholder="Tên người liên hệ" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="0901234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route">Tuyến đường</Label>
                  <Input id="route" placeholder="VD: HCM → Hà Nội" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày khởi hành</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Giờ khởi hành</Label>
                  <Input id="time" type="time" />
                </div>
              </div>

              {/* Driver Selection */}
              <div className="space-y-2">
                <Label htmlFor="driver">Chọn lái xe</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lái xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem 
                        key={driver.id} 
                        value={driver.id}
                        disabled={!driver.available}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{driver.name}</span>
                          {driver.id !== 'none' && (
                            <Badge 
                              variant={driver.trips === 0 ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                              {driver.trips} chuyến
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Gợi ý: Lái xe có ít chuyến được hiển thị trước
                </p>
              </div>

              {/* Service Selection */}
              <div className="space-y-3">
                <Label>Dịch vụ đi kèm</Label>
                <div className="space-y-2">
                  {availableServices.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <label
                        htmlFor={service.id}
                        className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {service.name}
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Giá trị booking</Label>
                <Input id="value" type="number" placeholder="15000000" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateBooking}>
                Tạo booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <TableHead>Mã booking</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Tuyến đường</TableHead>
                <TableHead>Ngày giờ</TableHead>
                <TableHead>Xe & Lái xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customer}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.contact} - {booking.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.route}</TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">{booking.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.vehicle}</div>
                      <div className="text-sm text-muted-foreground">{booking.driver}</div>
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
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
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