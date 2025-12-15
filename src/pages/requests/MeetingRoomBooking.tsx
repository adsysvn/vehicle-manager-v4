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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Users, MapPin, Settings, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MeetingRoomBooking = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
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

  const [roomFormData, setRoomFormData] = useState({
    name: '',
    capacity: 10,
    description: '',
    equipment: [] as string[],
    is_active: true
  });

  const equipmentOptions = ['Máy chiếu', 'Bảng trắng', 'Micro', 'Loa', 'Webcam', 'TV', 'Điều hòa', 'Wifi'];

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
      .order('name');
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

  // Room management functions
  const handleSaveRoom = async () => {
    try {
      if (editingRoom) {
        const { error } = await supabase
          .from('meeting_rooms')
          .update({
            name: roomFormData.name,
            capacity: roomFormData.capacity,
            description: roomFormData.description,
            equipment: roomFormData.equipment,
            is_active: roomFormData.is_active
          })
          .eq('id', editingRoom.id);

        if (error) throw error;
        toast({ title: 'Thành công', description: 'Đã cập nhật phòng họp' });
      } else {
        const { error } = await supabase
          .from('meeting_rooms')
          .insert([{
            name: roomFormData.name,
            capacity: roomFormData.capacity,
            description: roomFormData.description,
            equipment: roomFormData.equipment,
            is_active: roomFormData.is_active
          }]);

        if (error) throw error;
        toast({ title: 'Thành công', description: 'Đã thêm phòng họp mới' });
      }

      setRoomDialogOpen(false);
      setEditingRoom(null);
      resetRoomForm();
      fetchRooms();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room.name,
      capacity: room.capacity,
      description: room.description || '',
      equipment: room.equipment || [],
      is_active: room.is_active
    });
    setRoomDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Bạn có chắc muốn xóa phòng họp này?')) return;
    
    try {
      const { error } = await supabase
        .from('meeting_rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
      toast({ title: 'Thành công', description: 'Đã xóa phòng họp' });
      fetchRooms();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetRoomForm = () => {
    setRoomFormData({
      name: '',
      capacity: 10,
      description: '',
      equipment: [],
      is_active: true
    });
  };

  const toggleEquipment = (item: string) => {
    setRoomFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item]
    }));
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

  const activeRooms = rooms.filter(r => r.is_active);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Đặt phòng họp</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý phòng họp và yêu cầu đặt phòng
          </p>
        </div>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Yêu cầu đặt phòng
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Quản lý phòng họp
          </TabsTrigger>
        </TabsList>

        {/* Tab Yêu cầu đặt phòng */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={activeRooms.length === 0}>
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
                          {activeRooms.map(room => (
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
                <CardTitle className="text-sm font-medium">Phòng họp</CardTitle>
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeRooms.length}</div>
                <p className="text-xs text-muted-foreground">Đang hoạt động</p>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách yêu cầu</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có phòng họp nào được khai báo.</p>
                  <p className="text-sm">Vui lòng chuyển sang tab "Quản lý phòng họp" để thêm phòng mới.</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Quản lý phòng họp */}
        <TabsContent value="rooms" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={roomDialogOpen} onOpenChange={(open) => {
              setRoomDialogOpen(open);
              if (!open) {
                setEditingRoom(null);
                resetRoomForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm phòng họp
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingRoom ? 'Sửa phòng họp' : 'Thêm phòng họp mới'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tên phòng họp <span className="text-destructive">*</span></Label>
                    <Input 
                      placeholder="VD: Phòng họp A, Phòng họp tầng 3..." 
                      value={roomFormData.name}
                      onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sức chứa (người) <span className="text-destructive">*</span></Label>
                    <Input 
                      type="number" 
                      placeholder="10" 
                      value={roomFormData.capacity}
                      onChange={(e) => setRoomFormData({...roomFormData, capacity: Number(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea 
                      placeholder="Mô tả về phòng họp" 
                      rows={2}
                      value={roomFormData.description}
                      onChange={(e) => setRoomFormData({...roomFormData, description: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Thiết bị có sẵn</Label>
                    <div className="flex flex-wrap gap-2">
                      {equipmentOptions.map(item => (
                        <Badge 
                          key={item}
                          variant={roomFormData.equipment.includes(item) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleEquipment(item)}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={roomFormData.is_active}
                      onChange={(e) => setRoomFormData({...roomFormData, is_active: e.target.checked})}
                      className="rounded border-input"
                    />
                    <Label htmlFor="is_active">Đang hoạt động</Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setRoomDialogOpen(false);
                      setEditingRoom(null);
                      resetRoomForm();
                    }}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveRoom} disabled={!roomFormData.name || roomFormData.capacity < 1}>
                      {editingRoom ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Chưa có phòng họp nào được khai báo.</p>
                  <p className="text-sm text-muted-foreground">Bấm "Thêm phòng họp" để bắt đầu.</p>
                </CardContent>
              </Card>
            ) : (
              rooms.map(room => (
                <Card key={room.id} className={!room.is_active ? 'opacity-60' : ''}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sức chứa: {room.capacity} người
                      </p>
                    </div>
                    <Badge variant={room.is_active ? 'default' : 'secondary'}>
                      {room.is_active ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {room.description && (
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                    )}
                    {room.equipment && room.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {room.equipment.map((eq: string) => (
                          <Badge key={eq} variant="outline" className="text-xs">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditRoom(room)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeetingRoomBooking;
