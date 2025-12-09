import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Car, Search, Plus, Calendar, Clock, MapPin, FileSpreadsheet } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

interface CTVVehicle {
  id: string;
  owner_name: string;
  owner_phone: string;
  license_plate: string;
  brand: string;
  model: string;
  vehicle_type: string;
  seats: number;
  status: string;
  rating: number;
}

interface Booking {
  id: string;
  booking_number: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  total_price: number;
  status: string;
  customers: { name: string } | null;
}

interface BookingConfirmation {
  id: string;
  booking_id: string;
  ctv_vehicle_id: string;
  confirmation_status: string;
  price_offer: number;
  notes: string;
  created_at: string;
  bookings: Booking | null;
  ctv_vehicles: CTVVehicle | null;
}

export default function CTVBooking() {
  const { toast } = useToast();
  const [confirmations, setConfirmations] = useState<BookingConfirmation[]>([]);
  const [ctvVehicles, setCtvVehicles] = useState<CTVVehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    booking_id: '',
    ctv_vehicle_id: '',
    price_offer: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [confirmationsRes, ctvRes, bookingsRes] = await Promise.all([
        supabase
          .from('booking_confirmations')
          .select(`
            *,
            bookings!booking_confirmations_booking_id_fkey (
              id, booking_number, pickup_location, dropoff_location, pickup_datetime, total_price, status,
              customers!bookings_customer_id_fkey (name)
            ),
            ctv_vehicles!booking_confirmations_ctv_vehicle_id_fkey (
              id, owner_name, owner_phone, license_plate, brand, model, vehicle_type, seats, status, rating
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('ctv_vehicles')
          .select('*')
          .eq('is_active', true)
          .order('owner_name'),
        supabase
          .from('bookings')
          .select('id, booking_number, pickup_location, dropoff_location, pickup_datetime, total_price, status, customers!bookings_customer_id_fkey (name)')
          .in('status', ['pending', 'confirmed'])
          .order('pickup_datetime')
      ]);

      if (confirmationsRes.error) throw confirmationsRes.error;
      if (ctvRes.error) throw ctvRes.error;
      if (bookingsRes.error) throw bookingsRes.error;

      setConfirmations(confirmationsRes.data || []);
      setCtvVehicles(ctvRes.data || []);
      setBookings(bookingsRes.data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('booking_confirmations')
        .insert({
          booking_id: formData.booking_id,
          ctv_vehicle_id: formData.ctv_vehicle_id,
          price_offer: formData.price_offer ? parseFloat(formData.price_offer) : null,
          notes: formData.notes || null,
          confirmation_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã tạo yêu cầu CTV mới'
      });

      setIsDialogOpen(false);
      setFormData({ booking_id: '', ctv_vehicle_id: '', price_offer: '', notes: '' });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredConfirmations = confirmations.filter(c =>
    c.bookings?.booking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ctv_vehicles?.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.bookings?.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500';
      case 'accepted': return 'bg-green-500/10 text-green-500';
      case 'rejected': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'accepted': return 'CTV chấp nhận';
      case 'rejected': return 'CTV từ chối';
      default: return status;
    }
  };

  const handleExport = () => {
    const exportData = filteredConfirmations.map(c => ({
      'Mã Booking': c.bookings?.booking_number || '',
      'Khách hàng': c.bookings?.customers?.name || '',
      'CTV': c.ctv_vehicles?.owner_name || '',
      'SĐT CTV': c.ctv_vehicles?.owner_phone || '',
      'Biển số': c.ctv_vehicles?.license_plate || '',
      'Loại xe': c.ctv_vehicles?.vehicle_type || '',
      'Hành trình': `${c.bookings?.pickup_location} - ${c.bookings?.dropoff_location}`,
      'Giá đề xuất': c.price_offer || 0,
      'Trạng thái': getStatusText(c.confirmation_status || '')
    }));
    exportToExcel(exportData, 'CTV_Bookings');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Đặt xe CTV</h1>
          <p className="text-muted-foreground mt-1">Quản lý booking với cộng tác viên</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo booking mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo booking CTV mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Booking *</Label>
                    <Select value={formData.booking_id} onValueChange={(v) => setFormData({...formData, booking_id: v})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn booking" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookings.map(b => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.booking_number} - {b.customers?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chọn CTV *</Label>
                    <Select value={formData.ctv_vehicle_id} onValueChange={(v) => setFormData({...formData, ctv_vehicle_id: v})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn CTV" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctvVehicles.map(ctv => (
                          <SelectItem key={ctv.id} value={ctv.id}>
                            {ctv.owner_name} - {ctv.license_plate} ({ctv.vehicle_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Giá đề xuất (VNĐ)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.price_offer}
                    onChange={(e) => setFormData({...formData, price_offer: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea 
                    placeholder="Nhập ghi chú..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang xử lý...' : 'Tạo booking'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng yêu cầu</p>
              <p className="text-2xl font-bold text-foreground">{confirmations.length}</p>
            </div>
            <Car className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-500">{confirmations.filter(c => c.confirmation_status === 'pending').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã xác nhận</p>
              <p className="text-2xl font-bold text-blue-500">{confirmations.filter(c => c.confirmation_status === 'confirmed').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CTV chấp nhận</p>
              <p className="text-2xl font-bold text-green-500">{confirmations.filter(c => c.confirmation_status === 'accepted').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CTV khả dụng</p>
              <p className="text-2xl font-bold text-primary">{ctvVehicles.filter(c => c.status === 'available').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã booking, CTV, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã booking</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>CTV</TableHead>
                  <TableHead>Hành trình</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại xe</TableHead>
                  <TableHead>Giá đề xuất</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : filteredConfirmations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">Chưa có yêu cầu CTV nào</TableCell>
                  </TableRow>
                ) : (
                  filteredConfirmations.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.bookings?.booking_number}</TableCell>
                      <TableCell>{c.bookings?.customers?.name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{c.ctv_vehicles?.owner_name}</p>
                          <p className="text-xs text-muted-foreground">{c.ctv_vehicles?.owner_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {c.bookings?.pickup_location} - {c.bookings?.dropoff_location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {c.bookings?.pickup_datetime && (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-3 h-3" />
                              {new Date(c.bookings.pickup_datetime).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(c.bookings.pickup_datetime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{c.ctv_vehicles?.vehicle_type}</TableCell>
                      <TableCell className="font-medium">
                        {c.price_offer?.toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(c.confirmation_status || '')}>
                          {getStatusText(c.confirmation_status || '')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Chi tiết</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
