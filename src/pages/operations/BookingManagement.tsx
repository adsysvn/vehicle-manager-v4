import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Search, FileSpreadsheet, Filter, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { Checkbox } from '@/components/ui/checkbox';

// Mock bookings data
const mockBookings = [
  {
    id: 'BK001',
    customer: 'VN - Công ty TNHH ABC',
    groupCode: 'GRP2024001',
    route: 'HCM → Bình Dương → Hà Nội',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    vehicles: [
      { plate: '30A-123.45', driver: 'Trần Văn B', type: '7 chỗ' },
      { plate: '30A-123.46', driver: 'Lê Văn C', type: '7 chỗ' }
    ],
    status: 'confirmed',
    value: 15000000,
    numAdults: 25,
    numChildren: 5,
    tourGuideName: 'Nguyễn Hướng Dẫn',
    tourGuidePhone: '0909123456'
  },
  {
    id: 'BK002',
    customer: 'Lê Thị C',
    route: 'Đà Nẵng → HCM',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    vehicles: [
      { plate: 'Chưa phân', driver: 'Chưa phân', type: '4 chỗ' }
    ],
    status: 'pending',
    value: 8500000,
    numAdults: 1,
    numChildren: 0
  },
  {
    id: 'BK003',
    customer: 'QH - Công ty DEF',
    groupCode: 'GRP2024002',
    route: 'Hà Nội → Hải Phòng',
    startDate: '2024-01-17',
    endDate: '2024-01-19',
    vehicles: [
      { plate: '51B-678.90', driver: 'Hoàng Văn E', type: '16 chỗ' }
    ],
    status: 'in_progress',
    value: 5200000,
    numAdults: 15,
    numChildren: 0,
    tourGuideName: 'Trần Minh',
    tourGuidePhone: '0908765432'
  },
  {
    id: 'BK004',
    customer: 'VJ - Công ty GHI',
    groupCode: 'GRP2024003',
    route: 'Cần Thơ → HCM',
    startDate: '2024-01-14',
    endDate: '2024-01-14',
    vehicles: [
      { plate: '92C-111.22', driver: 'Nguyễn Văn G', type: '7 chỗ' }
    ],
    status: 'completed',
    value: 3200000,
    numAdults: 10,
    numChildren: 2,
    tourGuideName: 'Lê Thanh',
    tourGuidePhone: '0907654321'
  }
];

const statusConfig = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'Đang thực hiện', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
};

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  // Get unique values for filters
  const uniqueCustomers = Array.from(new Set(mockBookings.map(b => b.customer)));
  const uniqueDrivers = Array.from(
    new Set(mockBookings.flatMap(b => b.vehicles.map(v => v.driver).filter(d => d !== 'Chưa phân')))
  );
  const uniqueVehicles = Array.from(
    new Set(mockBookings.flatMap(b => b.vehicles.map(v => v.plate).filter(p => p !== 'Chưa phân')))
  );
  const uniqueRoutes = Array.from(new Set(mockBookings.map(b => b.route)));

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.groupCode && booking.groupCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCustomer = !customerFilter || booking.customer === customerFilter;
    const matchesRoute = !routeFilter || booking.route === routeFilter;
    const matchesDriver = !driverFilter || 
      booking.vehicles.some(v => v.driver === driverFilter);
    const matchesVehicle = !vehicleFilter || 
      booking.vehicles.some(v => v.plate === vehicleFilter);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesStartDateFrom = !startDateFrom || 
      new Date(booking.startDate) >= new Date(startDateFrom);
    const matchesStartDateTo = !startDateTo || 
      new Date(booking.startDate) <= new Date(startDateTo);
    
    return matchesSearch && matchesCustomer && matchesRoute && matchesDriver && 
           matchesVehicle && matchesStatus && matchesStartDateFrom && matchesStartDateTo;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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

  const handleExportExcel = () => {
    const bookingsToExport = selectedBookings.length > 0
      ? mockBookings.filter(b => selectedBookings.includes(b.id))
      : filteredBookings;

    const exportData = bookingsToExport.map(booking => ({
      'Mã Booking': booking.id,
      'Khách hàng': booking.customer,
      'Mã đoàn': booking.groupCode || '-',
      'Hành trình': booking.route,
      'Ngày bắt đầu': booking.startDate,
      'Ngày kết thúc': booking.endDate,
      'Số khách': booking.numAdults,
      'Em bé': booking.numChildren,
      'Hướng dẫn viên': booking.tourGuideName || '-',
      'SĐT HDV': booking.tourGuidePhone || '-',
      'Xe': booking.vehicles.map(v => v.plate).join(', '),
      'Lái xe': booking.vehicles.map(v => v.driver).join(', '),
      'Dòng xe': booking.vehicles.map(v => v.type).join(', '),
      'Trạng thái': statusConfig[booking.status as keyof typeof statusConfig].label,
      'Giá trị': booking.value
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');

    // Auto-size columns
    const maxWidth = exportData.reduce((w, r) => Math.max(w, ...Object.values(r).map(v => String(v).length)), 10);
    worksheet['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));

    const fileName = `Bookings_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCustomerFilter('');
    setRouteFilter('');
    setDriverFilter('');
    setVehicleFilter('');
    setStatusFilter('all');
    setStartDateFrom('');
    setStartDateTo('');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Booking</h1>
          <p className="text-muted-foreground mt-2">
            Điều hành xe - Danh sách và lọc booking
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
          <Button 
            onClick={handleExportExcel}
            disabled={filteredBookings.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Xuất Excel ({selectedBookings.length > 0 ? selectedBookings.length : filteredBookings.length})
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mockBookings.length}</div>
              <div className="text-sm text-muted-foreground">Tổng booking</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {mockBookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockBookings.filter(b => b.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang thực hiện</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredBookings.length}
              </div>
              <div className="text-sm text-muted-foreground">Kết quả lọc</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã booking, khách hàng, mã đoàn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
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
          </div>

          {showFilters && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Bộ lọc nâng cao</Label>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Khách hàng</Label>
                  <Select value={customerFilter} onValueChange={setCustomerFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {uniqueCustomers.map(customer => (
                        <SelectItem key={customer} value={customer}>
                          {customer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Hành trình</Label>
                  <Select value={routeFilter} onValueChange={setRouteFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hành trình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {uniqueRoutes.map(route => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Lái xe</Label>
                  <Select value={driverFilter} onValueChange={setDriverFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lái xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {uniqueDrivers.map(driver => (
                        <SelectItem key={driver} value={driver}>
                          {driver}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Xe</Label>
                  <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả</SelectItem>
                      {uniqueVehicles.map(vehicle => (
                        <SelectItem key={vehicle} value={vehicle}>
                          {vehicle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Từ ngày</Label>
                  <Input
                    type="date"
                    value={startDateFrom}
                    onChange={(e) => setStartDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Đến ngày</Label>
                  <Input
                    type="date"
                    value={startDateTo}
                    onChange={(e) => setStartDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách booking ({filteredBookings.length})</CardTitle>
            {selectedBookings.length > 0 && (
              <Badge variant="secondary">
                Đã chọn: {selectedBookings.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Mã Booking</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Hành trình</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Xe & Lái xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá trị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBookings.includes(booking.id)}
                      onCheckedChange={() => handleSelectBooking(booking.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      {booking.groupCode && (
                        <p className="text-xs text-muted-foreground">{booking.groupCode}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{booking.route}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{booking.startDate}</p>
                      <p className="text-muted-foreground">→ {booking.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.vehicles.map((vehicle, idx) => (
                        <div key={idx} className="text-sm">
                          <Badge variant="secondary" className="mr-1">{vehicle.type}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {vehicle.plate} - {vehicle.driver}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[booking.status as keyof typeof statusConfig].color}>
                      {statusConfig[booking.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(booking.value)}
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