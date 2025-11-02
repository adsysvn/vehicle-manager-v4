import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MeetingRoomBooking = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    room_id: '',
    booking_date: '',
    time_start: '',
    time_end: '',
    participants: 1,
    purpose: '',
    equipment: [] as string[],
    notes: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchRooms();
    fetchDepartments();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_room_bookings')
        .select(`
          *,
          room:meeting_rooms(name, capacity),
          profile:profiles!meeting_room_bookings_profile_id_fkey(full_name, email),
          department:departments(name)
        `)
        .order('created_at', { ascending: false });

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

  const fetchRooms = async () => {
    const { data } = await supabase
      .from('meeting_rooms')
      .select('*')
      .eq('is_active', true);
    setRooms(data || []);
  };

  const fetchDepartments = async () => {
    const { data } = await supabase.from('departments').select('*');
    setDepartments(data || []);
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Chưa đăng nhập');

      const { data: profile } = await supabase
        .from('profiles')
        .select('department_id')
        .eq('id', user.id)
        .single();

      const { error } = await supabase.from('meeting_room_bookings').insert([{
        room_id: formData.room_id,
        profile_id: user.id,
        department_id: profile?.department_id || null,
        booking_date: formData.booking_date,
        time_start: formData.time_start,
        time_end: formData.time_end,
        participants: formData.participants,
        purpose: formData.purpose,
        equipment: formData.equipment,
        notes: formData.notes
      }]);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã tạo yêu cầu đặt phòng'
      });
      
      setOpen(false);
      fetchBookings();
      setFormData({
        room_id: '',
        booking_date: '',
        time_start: '',
        time_end: '',
        participants: 1,
        purpose: '',
        equipment: [],
        notes: ''
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('meeting_room_bookings')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã duyệt yêu cầu'
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('meeting_room_bookings')
        .update({
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã từ chối yêu cầu'
      });
      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Đặt phòng họp</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý yêu cầu đặt phòng họp của các phòng ban
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo yêu cầu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yêu cầu đặt phòng họp</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phòng họp</Label>
                  <Select value={formData.room_id} onValueChange={(v) => setFormData({...formData, room_id: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng họp" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} ({room.capacity} người)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số lượng người tham dự</Label>
                  <Input 
                    type="number" 
                    placeholder="Nhập số người" 
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày họp</Label>
                  <Input 
                    type="date" 
                    value={formData.booking_date}
                    onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giờ bắt đầu</Label>
                  <Input 
                    type="time" 
                    value={formData.time_start}
                    onChange={(e) => setFormData({...formData, time_start: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giờ kết thúc</Label>
                  <Input 
                    type="time" 
                    value={formData.time_end}
                    onChange={(e) => setFormData({...formData, time_end: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <div></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mục đích sử dụng</Label>
                <Textarea 
                  placeholder="Mô tả mục đích sử dụng phòng họp" 
                  rows={3} 
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea 
                  placeholder="Thông tin bổ sung" 
                  rows={2} 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>
                  Gửi yêu cầu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {bookings.filter(b => b.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Yêu cầu được chấp nhận</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ trùng lịch</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Không có xung đột</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phòng họp</TableHead>
                <TableHead>Người yêu cầu</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Số người</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Chưa có yêu cầu đặt phòng nào</TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.room?.name}</TableCell>
                    <TableCell>{booking.profile?.full_name}</TableCell>
                    <TableCell>{booking.department?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.booking_date}</TableCell>
                    <TableCell>{booking.time_start} - {booking.time_end}</TableCell>
                    <TableCell>{booking.participants} người</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Chi tiết</Button>
                        {booking.status === 'pending' && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleApprove(booking.id)}>Duyệt</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(booking.id)}>Từ chối</Button>
                          </>
                        )}
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
};

export default MeetingRoomBooking;
