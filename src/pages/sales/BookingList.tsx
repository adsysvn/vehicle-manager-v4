import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Eye, Edit, Trash2, Calendar, X, User, Phone, Users, Plane, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
    companyCode: 'VN - Công ty TNHH ABC',
    groupCode: 'GRP2024001',
    numAdults: 25,
    numChildren: 5,
    reference: 'REF2024-ABC-001',
    visaType: 'Tourist',
    guestType: 'inbound',
    tourGuideName: 'Nguyễn Hướng Dẫn',
    tourGuidePhone: '0909123456',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
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
    startDate: '2024-01-16',
    endDate: '2024-01-16',
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
    companyCode: 'VJ - Công ty DEF',
    groupCode: 'GRP2024002',
    numAdults: 15,
    numChildren: 0,
    reference: 'REF2024-DEF-002',
    visaType: 'Business',
    guestType: 'outbound',
    tourGuideName: 'Trần Minh',
    tourGuidePhone: '0908765432',
    startDate: '2024-01-17',
    endDate: '2024-01-19',
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
    companyCode: 'QH - Công ty GHI',
    groupCode: 'GRP2024003',
    numAdults: 10,
    numChildren: 2,
    reference: 'REF2024-GHI-003',
    visaType: 'Transit',
    guestType: 'inbound',
    tourGuideName: 'Lê Thanh',
    tourGuidePhone: '0907654321',
    startDate: '2024-01-14',
    endDate: '2024-01-14',
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupCodeFilter, setGroupCodeFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch customers and routes for edit form
  useEffect(() => {
    const fetchData = async () => {
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      const { data: routesData } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (customersData) setCustomers(customersData);
      if (routesData) setRoutes(routesData);
    };
    
    fetchData();
  }, []);

  // Get unique values for filters
  const uniqueDrivers = Array.from(
    new Set(bookings.flatMap(b => b.vehicles.map(v => v.driver).filter(Boolean)))
  );
  const uniqueVehicles = Array.from(
    new Set(bookings.flatMap(b => b.vehicles.map(v => v.licensePlate)))
  );
  const uniqueCustomers = Array.from(
    new Set(bookings.map(b => b.companyCode || b.customer))
  );

  const filteredBookings = bookings.filter(booking => {
    const routeString = booking.routePoints.map(p => p.location).join(' → ');
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.companyCode && booking.companyCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.groupCode && booking.groupCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      routeString.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesGroupCode = !groupCodeFilter || 
      (booking.groupCode && booking.groupCode.toLowerCase().includes(groupCodeFilter.toLowerCase()));
    
    const matchesDriver = !driverFilter ||
      booking.vehicles.some(v => v.driver?.toLowerCase().includes(driverFilter.toLowerCase()));
    
    const matchesVehicle = !vehicleFilter ||
      booking.vehicles.some(v => v.licensePlate?.toLowerCase().includes(vehicleFilter.toLowerCase()));
    
    const matchesCustomer = !customerFilter || 
      (booking.companyCode || booking.customer).toLowerCase().includes(customerFilter.toLowerCase());
    
    const matchesStartDate = !startDateFilter ||
      (booking.startDate && new Date(booking.startDate) >= new Date(startDateFilter));
    
    const matchesEndDate = !endDateFilter ||
      (booking.endDate && new Date(booking.endDate) <= new Date(endDateFilter));
    
    return matchesSearch && matchesStatus && matchesGroupCode && matchesDriver && 
           matchesVehicle && matchesCustomer && matchesStartDate && matchesEndDate;
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

  const handleView = (booking: any) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const handleEdit = (booking: any) => {
    setSelectedBooking(booking);
    setEditForm({
      customer_id: booking.customer_id || '',
      route_id: booking.route_id || '',
      pickup_location: booking.pickup_location || '',
      dropoff_location: booking.dropoff_location || '',
      pickup_datetime: booking.pickup_datetime ? new Date(booking.pickup_datetime).toISOString().slice(0, 16) : '',
      estimated_duration: booking.estimated_duration || '',
      passenger_count: booking.passenger_count || '',
      distance_km: booking.distance_km || '',
      base_price: booking.base_price || '',
      total_price: booking.total_price || '',
      status: booking.status || 'pending',
      notes: booking.notes || '',
      special_requests: booking.special_requests || ''
    });
    setEditDialogOpen(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          customer_id: editForm.customer_id,
          route_id: editForm.route_id || null,
          pickup_location: editForm.pickup_location,
          dropoff_location: editForm.dropoff_location,
          pickup_datetime: editForm.pickup_datetime,
          estimated_duration: editForm.estimated_duration ? parseInt(editForm.estimated_duration) : null,
          passenger_count: editForm.passenger_count ? parseInt(editForm.passenger_count) : 1,
          distance_km: editForm.distance_km ? parseFloat(editForm.distance_km) : null,
          base_price: editForm.base_price ? parseFloat(editForm.base_price) : null,
          total_price: editForm.total_price ? parseFloat(editForm.total_price) : null,
          status: editForm.status,
          notes: editForm.notes || null,
          special_requests: editForm.special_requests || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Cập nhật booking thành công',
      });

      setEditDialogOpen(false);
      // Reload the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật booking',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Danh sách Booking - ${format(new Date(), 'dd/MM/yyyy')}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .status-badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; }
            .status-pending { background-color: #fef3c7; }
            .status-confirmed { background-color: #dbeafe; }
            .status-in_progress { background-color: #d1fae5; }
            .status-completed { background-color: #e0e7ff; }
            .status-cancelled { background-color: #fee2e2; }
            @media print {
              body { margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            In danh sách
          </Button>
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
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Ẩn bộ lọc' : 'Lọc nâng cao'}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t">
              <div>
                <Label className="text-xs mb-1">Mã đoàn</Label>
                <Input
                  placeholder="Lọc theo mã đoàn"
                  value={groupCodeFilter}
                  onChange={(e) => setGroupCodeFilter(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-1">Khách hàng</Label>
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {uniqueCustomers.map((customer) => (
                      <SelectItem key={customer} value={customer}>
                        {customer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1">Lái xe</Label>
                <Select value={driverFilter} onValueChange={setDriverFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lái xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {uniqueDrivers.map((driver) => (
                      <SelectItem key={driver} value={driver || ''}>
                        {driver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1">Xe</Label>
                <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả</SelectItem>
                    {uniqueVehicles.map((vehicle) => (
                      <SelectItem key={vehicle} value={vehicle}>
                        {vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1">Ngày bắt đầu (từ)</Label>
                <Input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-1">Ngày kết thúc (đến)</Label>
                <Input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                />
              </div>
            </div>
          )}
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
                <TableHead>Thông tin đoàn</TableHead>
                <TableHead>Hành trình</TableHead>
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
                      <div className="flex items-center gap-2">
                        {booking.companyCode && (
                          <span className="font-semibold text-primary">{booking.companyCode}</span>
                        )}
                        {!booking.companyCode && (
                          <span className="font-medium">{booking.customer}</span>
                        )}
                        <Badge variant="outline" className={booking.customerType === 'corporate' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {booking.customerType === 'corporate' ? 'DN' : 'Lẻ'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.contact} - {booking.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.customerType === 'corporate' ? (
                      <div className="space-y-1">
                        {booking.groupCode && (
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">{booking.groupCode}</Badge>
                          </div>
                        )}
                        {(booking.numAdults || booking.numChildren) && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-3 h-3" />
                            <span>{booking.numAdults || 0} NL</span>
                            {booking.numChildren > 0 && <span>+ {booking.numChildren} TE</span>}
                          </div>
                        )}
                        {booking.guestType && (
                          <Badge variant="outline" className="text-xs">
                            {booking.guestType === 'inbound' ? 'Inbound' : 'Outbound'}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
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
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(booking)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(booking)}>
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Chi tiết Booking - {selectedBooking?.id}</span>
              <Button variant="ghost" size="sm" onClick={() => setViewDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Tên khách hàng</Label>
                    <p className="font-medium">{selectedBooking.companyCode || selectedBooking.customer}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Loại khách</Label>
                    <Badge variant={selectedBooking.customerType === 'corporate' ? 'default' : 'secondary'}>
                      {selectedBooking.customerType === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Người liên hệ</Label>
                    <p>{selectedBooking.contact}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số điện thoại</Label>
                    <p>{selectedBooking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Corporate Info */}
              {selectedBooking.customerType === 'corporate' && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      Thông tin đoàn
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedBooking.groupCode && (
                        <div>
                          <Label className="text-muted-foreground">Mã đoàn</Label>
                          <p className="font-medium">{selectedBooking.groupCode}</p>
                        </div>
                      )}
                      {selectedBooking.reference && (
                        <div>
                          <Label className="text-muted-foreground">Reference</Label>
                          <p>{selectedBooking.reference}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-muted-foreground">Số lượng khách</Label>
                        <p>{selectedBooking.numAdults || 0} người lớn {selectedBooking.numChildren > 0 && `+ ${selectedBooking.numChildren} trẻ em`}</p>
                      </div>
                      {selectedBooking.visaType && (
                        <div>
                          <Label className="text-muted-foreground">Loại Visa</Label>
                          <p>{selectedBooking.visaType}</p>
                        </div>
                      )}
                      {selectedBooking.guestType && (
                        <div>
                          <Label className="text-muted-foreground">Loại khách</Label>
                          <Badge variant="outline">
                            {selectedBooking.guestType === 'inbound' ? 'Inbound' : 'Outbound'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Tour Guide */}
              {selectedBooking.tourGuideName && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Hướng dẫn viên
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Tên HDV</Label>
                        <p>{selectedBooking.tourGuideName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Số điện thoại</Label>
                        <p>{selectedBooking.tourGuidePhone}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Trip Dates */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thời gian
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedBooking.startDate && (
                    <div>
                      <Label className="text-muted-foreground">Ngày bắt đầu</Label>
                      <p>{formatDate(selectedBooking.startDate)}</p>
                    </div>
                  )}
                  {selectedBooking.endDate && (
                    <div>
                      <Label className="text-muted-foreground">Ngày kết thúc</Label>
                      <p>{formatDate(selectedBooking.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Points */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Hành trình đa điểm</h3>
                <div className="space-y-2">
                  {selectedBooking.routePoints.map((point: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Badge variant="secondary">{idx + 1}</Badge>
                      <div className="flex-1">
                        <p className="font-medium">{point.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(point.datetime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Xe & Lái xe</h3>
                <div className="space-y-2">
                  {selectedBooking.vehicles.map((vehicle: any, idx: number) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{vehicle.type}</Badge>
                        <div className="text-sm">
                          <span className="font-medium">{vehicle.licensePlate}</span>
                          <span className="text-muted-foreground"> - {vehicle.driver}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Value */}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge className={statusConfig[selectedBooking.status as keyof typeof statusConfig].color}>
                      {statusConfig[selectedBooking.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Giá trị</Label>
                  <p className="font-semibold text-lg text-success">{formatCurrency(selectedBooking.value)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Booking - {selectedBooking?.booking_number}</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <form onSubmit={handleUpdateBooking} className="space-y-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customer_id">Khách hàng *</Label>
                <Select 
                  value={editForm.customer_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, customer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Route Selection */}
              <div className="space-y-2">
                <Label htmlFor="route_id">Tuyến đường (tùy chọn)</Label>
                <Select 
                  value={editForm.route_id} 
                  onValueChange={(value) => setEditForm({ ...editForm, route_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tuyến đường" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn</SelectItem>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup_location">Điểm đón *</Label>
                  <Input
                    id="pickup_location"
                    value={editForm.pickup_location}
                    onChange={(e) => setEditForm({ ...editForm, pickup_location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff_location">Điểm trả *</Label>
                  <Input
                    id="dropoff_location"
                    value={editForm.dropoff_location}
                    onChange={(e) => setEditForm({ ...editForm, dropoff_location: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Datetime and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup_datetime">Thời gian đón *</Label>
                  <Input
                    id="pickup_datetime"
                    type="datetime-local"
                    value={editForm.pickup_datetime}
                    onChange={(e) => setEditForm({ ...editForm, pickup_datetime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_duration">Thời gian ước tính (phút)</Label>
                  <Input
                    id="estimated_duration"
                    type="number"
                    value={editForm.estimated_duration}
                    onChange={(e) => setEditForm({ ...editForm, estimated_duration: e.target.value })}
                  />
                </div>
              </div>

              {/* Passenger Count and Distance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passenger_count">Số lượng khách *</Label>
                  <Input
                    id="passenger_count"
                    type="number"
                    min="1"
                    value={editForm.passenger_count}
                    onChange={(e) => setEditForm({ ...editForm, passenger_count: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance_km">Khoảng cách (km)</Label>
                  <Input
                    id="distance_km"
                    type="number"
                    step="0.1"
                    value={editForm.distance_km}
                    onChange={(e) => setEditForm({ ...editForm, distance_km: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Giá cơ bản (VNĐ)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="1000"
                    value={editForm.base_price}
                    onChange={(e) => setEditForm({ ...editForm, base_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_price">Tổng giá (VNĐ)</Label>
                  <Input
                    id="total_price"
                    type="number"
                    step="1000"
                    value={editForm.total_price}
                    onChange={(e) => setEditForm({ ...editForm, total_price: e.target.value })}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái *</Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="assigned">Đã phân xe</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="special_requests">Yêu cầu đặc biệt</Label>
                <Textarea
                  id="special_requests"
                  value={editForm.special_requests}
                  onChange={(e) => setEditForm({ ...editForm, special_requests: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden print content */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Danh sách Booking</h1>
        <div className="info">
          <p><strong>Ngày in:</strong> {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          <p><strong>Tổng số booking:</strong> {filteredBookings.length}</p>
          <p><strong>Điều kiện lọc:</strong></p>
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            {searchTerm && <li><strong>Từ khóa:</strong> {searchTerm}</li>}
            {statusFilter !== 'all' && <li><strong>Trạng thái:</strong> {statusConfig[statusFilter as keyof typeof statusConfig]?.label || statusFilter}</li>}
            {groupCodeFilter && <li><strong>Mã đoàn:</strong> {groupCodeFilter}</li>}
            {customerFilter && <li><strong>Khách hàng:</strong> {customerFilter}</li>}
            {driverFilter && <li><strong>Lái xe:</strong> {driverFilter}</li>}
            {vehicleFilter && <li><strong>Xe:</strong> {vehicleFilter}</li>}
            {startDateFilter && <li><strong>Từ ngày:</strong> {format(new Date(startDateFilter), 'dd/MM/yyyy')}</li>}
            {endDateFilter && <li><strong>Đến ngày:</strong> {format(new Date(endDateFilter), 'dd/MM/yyyy')}</li>}
            {!searchTerm && statusFilter === 'all' && !groupCodeFilter && !customerFilter && !driverFilter && !vehicleFilter && !startDateFilter && !endDateFilter && (
              <li><em>Không có điều kiện lọc (hiển thị tất cả)</em></li>
            )}
          </ul>
        </div>
        <table>
          <thead>
            <tr>
              <th>Mã Booking</th>
              <th>Khách hàng</th>
              <th>Mã đoàn</th>
              <th>Lộ trình</th>
              <th>Xe & Lái xe</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>
                  {booking.companyCode || booking.customer}
                </td>
                <td>{booking.groupCode || '-'}</td>
                <td>
                  {booking.routePoints.map((point, idx) => (
                    <div key={idx}>
                      {point.location}
                      {idx < booking.routePoints.length - 1 && ' → '}
                    </div>
                  ))}
                </td>
                <td>
                  {booking.vehicles.map((vehicle, idx) => (
                    <div key={idx}>
                      {vehicle.licensePlate} - {vehicle.driver || 'Chưa có lái xe'}
                    </div>
                  ))}
                </td>
                <td>
                  {booking.startDate && format(new Date(booking.startDate), 'dd/MM/yyyy')}
                  {booking.endDate && ` - ${format(new Date(booking.endDate), 'dd/MM/yyyy')}`}
                </td>
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {statusConfig[booking.status as keyof typeof statusConfig].label}
                  </span>
                </td>
                <td>{formatCurrency(booking.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
