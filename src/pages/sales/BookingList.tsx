import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Eye, Edit, Trash2, Printer, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  created_at: string;
  customers: { id: string; name: string; phone: string; customer_type: string } | null;
  vehicle_assignments: Array<{
    vehicles: { license_plate: string; brand: string; model: string } | null;
    drivers: { 
      profile_id: string;
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

export default function BookingList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
          customers!bookings_customer_id_fkey (id, name, phone, customer_type),
          vehicle_assignments (
            vehicles!vehicle_assignments_vehicle_id_fkey (license_plate, brand, model),
            drivers!vehicle_assignments_driver_id_fkey (
              profile_id,
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropoff_location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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

  const handlePrintSelected = () => {
    if (selectedBookings.length === 0) return;
    const ids = selectedBookings.join(',');
    navigate(`/sales/bookings/print?ids=${ids}`);
  };

  const handleExport = () => {
    const dataToExport = selectedBookings.length > 0
      ? filteredBookings.filter(b => selectedBookings.includes(b.id))
      : filteredBookings;

    const exportData = dataToExport.map(b => ({
      'Mã Booking': b.booking_number,
      'Khách hàng': b.customers?.name || '',
      'SĐT': b.customers?.phone || '',
      'Loại KH': b.customers?.customer_type === 'corporate' ? 'Doanh nghiệp' : 'Cá nhân',
      'Điểm đón': b.pickup_location,
      'Điểm đến': b.dropoff_location,
      'Thời gian': new Date(b.pickup_datetime).toLocaleString('vi-VN'),
      'Số khách': b.passenger_count || 0,
      'Xe': b.vehicle_assignments?.[0]?.vehicles?.license_plate || 'Chưa phân',
      'Lái xe': b.vehicle_assignments?.[0]?.drivers?.profiles?.full_name || 'Chưa phân',
      'Trạng thái': statusConfig[b.status]?.label || b.status,
      'Giá trị': b.total_price || 0
    }));

    exportToExcel(exportData, 'Bookings');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa booking này?')) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({ title: 'Thành công', description: 'Đã xóa booking' });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh sách Booking</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý đặt chỗ và lịch trình vận chuyển
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
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
        </CardContent>
      </Card>

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
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(bookings.reduce((sum, b) => sum + (b.total_price || 0), 0))}
              </div>
              <div className="text-sm text-muted-foreground">Tổng giá trị</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách booking ({filteredBookings.length})</CardTitle>
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
                <TableHead>Mã booking</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Hành trình</TableHead>
                <TableHead>Xe & Lái xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Thao tác</TableHead>
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
                  <TableRow key={booking.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedBookings.includes(booking.id)}
                        onCheckedChange={() => handleSelectBooking(booking.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{booking.booking_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{booking.customers?.name}</span>
                          <Badge variant="outline" className={booking.customers?.customer_type === 'corporate' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                            {booking.customers?.customer_type === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customers?.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{booking.pickup_location}</div>
                        <div className="text-sm text-muted-foreground">→ {booking.dropoff_location}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(booking.pickup_datetime).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {booking.vehicle_assignments?.[0] ? (
                          <>
                            <div className="text-sm font-medium">
                              {booking.vehicle_assignments[0].vehicles?.license_plate}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {booking.vehicle_assignments[0].drivers?.profiles?.full_name || 'Chưa phân lái xe'}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Chưa phân xe</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[booking.status]?.color || ''}>
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatCurrency(booking.total_price || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/sales/bookings/${booking.id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => navigate(`/sales/bookings/${booking.id}/print`)}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => navigate(`/sales/bookings/${booking.id}/edit`)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(booking.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
