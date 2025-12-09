import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import { Search, FileSpreadsheet, Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { exportToExcel } from '@/lib/exportToExcel';

interface Booking {
  id: string;
  booking_number: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  passenger_count: number;
  status: string;
  total_price: number;
  notes: string;
  customers: { name: string; phone: string } | null;
  vehicle_assignments: Array<{
    vehicles: { license_plate: string; brand: string; model: string; seats: number } | null;
    drivers: { 
      profiles: { full_name: string } | null;
    } | null;
  }>;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  assigned: { label: 'Đã phân xe', color: 'bg-purple-100 text-purple-800' },
  in_progress: { label: 'Đang thực hiện', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
};

export default function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers!bookings_customer_id_fkey (name, phone),
          vehicle_assignments (
            vehicles!vehicle_assignments_vehicle_id_fkey (license_plate, brand, model, seats),
            drivers!vehicle_assignments_driver_id_fkey (
              profiles!drivers_profile_id_fkey (full_name)
            )
          )
        `)
        .order('pickup_datetime', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const uniqueCustomers = Array.from(new Set(bookings.map(b => b.customers?.name).filter(Boolean)));
  const uniqueDrivers = Array.from(
    new Set(bookings.flatMap(b => 
      b.vehicle_assignments?.map(va => va.drivers?.profiles?.full_name).filter(Boolean) || []
    ))
  );
  const uniqueVehicles = Array.from(
    new Set(bookings.flatMap(b => 
      b.vehicle_assignments?.map(va => va.vehicles?.license_plate).filter(Boolean) || []
    ))
  );

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCustomer = !customerFilter || booking.customers?.name === customerFilter;
    const matchesDriver = !driverFilter || 
      booking.vehicle_assignments?.some(va => va.drivers?.profiles?.full_name === driverFilter);
    const matchesVehicle = !vehicleFilter || 
      booking.vehicle_assignments?.some(va => va.vehicles?.license_plate === vehicleFilter);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesStartDateFrom = !startDateFrom || 
      new Date(booking.pickup_datetime) >= new Date(startDateFrom);
    const matchesStartDateTo = !startDateTo || 
      new Date(booking.pickup_datetime) <= new Date(startDateTo);
    
    return matchesSearch && matchesCustomer && matchesDriver && 
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
      ? bookings.filter(b => selectedBookings.includes(b.id))
      : filteredBookings;

    const exportData = bookingsToExport.map(booking => ({
      'Mã Booking': booking.booking_number,
      'Khách hàng': booking.customers?.name || '',
      'SĐT': booking.customers?.phone || '',
      'Điểm đón': booking.pickup_location,
      'Điểm đến': booking.dropoff_location,
      'Thời gian': new Date(booking.pickup_datetime).toLocaleString('vi-VN'),
      'Số khách': booking.passenger_count || 0,
      'Xe': booking.vehicle_assignments?.[0]?.vehicles?.license_plate || 'Chưa phân',
      'Lái xe': booking.vehicle_assignments?.[0]?.drivers?.profiles?.full_name || 'Chưa phân',
      'Trạng thái': statusConfig[booking.status]?.label || booking.status,
      'Giá trị': booking.total_price || 0
    }));

    exportToExcel(exportData, 'Bookings_Operations');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCustomerFilter('');
    setDriverFilter('');
    setVehicleFilter('');
    setStatusFilter('all');
    setStartDateFrom('');
    setStartDateTo('');
  };

  return (
    <div className="space-y-6 p-6">
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
              <div className="text-2xl font-bold text-blue-600">
                {filteredBookings.length}
              </div>
              <div className="text-sm text-muted-foreground">Kết quả lọc</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã booking, khách hàng..."
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
                <SelectItem value="assigned">Đã phân xe</SelectItem>
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
                        <SelectItem key={customer} value={customer || ''}>
                          {customer}
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
                        <SelectItem key={driver} value={driver || ''}>
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
                        <SelectItem key={vehicle} value={vehicle || ''}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Không có booking nào</TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBookings.includes(booking.id)}
                        onCheckedChange={() => handleSelectBooking(booking.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{booking.booking_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customers?.name}</p>
                        <p className="text-xs text-muted-foreground">{booking.customers?.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{booking.pickup_location}</p>
                        <p className="text-sm text-muted-foreground">→ {booking.dropoff_location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{new Date(booking.pickup_datetime).toLocaleDateString('vi-VN')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.pickup_datetime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.vehicle_assignments?.[0] ? (
                        <div>
                          <p className="text-sm font-medium">{booking.vehicle_assignments[0].vehicles?.license_plate}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.vehicle_assignments[0].drivers?.profiles?.full_name || 'Chưa phân'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Chưa phân</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[booking.status]?.color || ''}>
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(booking.total_price || 0)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
