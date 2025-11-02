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
import { Plus, Plane, MapPin, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BusinessTripManagement = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    destination: '',
    purpose: '',
    start_date: '',
    end_date: '',
    transportation: '',
    accommodation: '',
    estimated_cost: 0,
    notes: ''
  });

  useEffect(() => {
    fetchTrips();
    fetchDepartments();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('business_trips')
        .select(`
          *,
          profile:profiles!business_trips_profile_id_fkey(full_name, email),
          department:departments(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
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

      const { error } = await supabase.from('business_trips').insert([{
        profile_id: user.id,
        department_id: profile?.department_id || null,
        destination: formData.destination,
        purpose: formData.purpose,
        start_date: formData.start_date,
        end_date: formData.end_date,
        transportation: formData.transportation as any,
        accommodation: formData.accommodation as any,
        estimated_cost: formData.estimated_cost,
        notes: formData.notes
      }]);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã tạo yêu cầu công tác'
      });
      
      setOpen(false);
      fetchTrips();
      setFormData({
        destination: '',
        purpose: '',
        start_date: '',
        end_date: '',
        transportation: '',
        accommodation: '',
        estimated_cost: 0,
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
        .from('business_trips')
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
      fetchTrips();
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
        .from('business_trips')
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
      fetchTrips();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý công tác</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý yêu cầu đi công tác của nhân viên
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
              <DialogTitle>Yêu cầu đi công tác</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Điểm đến</Label>
                  <Input 
                    placeholder="Thành phố/Tỉnh" 
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phương tiện di chuyển</Label>
                  <Select value={formData.transportation} onValueChange={(v) => setFormData({...formData, transportation: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương tiện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plane">Máy bay</SelectItem>
                      <SelectItem value="train">Tàu hỏa</SelectItem>
                      <SelectItem value="car">Xe công ty</SelectItem>
                      <SelectItem value="personal">Xe cá nhân</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input 
                    type="date" 
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input 
                    type="date" 
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mục đích công tác</Label>
                <Textarea 
                  placeholder="Mô tả chi tiết mục đích công tác" 
                  rows={3} 
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nơi lưu trú</Label>
                  <Select value={formData.accommodation} onValueChange={(v) => setFormData({...formData, accommodation: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại lưu trú" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel-5">Khách sạn 5 sao</SelectItem>
                      <SelectItem value="hotel-4">Khách sạn 4 sao</SelectItem>
                      <SelectItem value="hotel-3">Khách sạn 3 sao</SelectItem>
                      <SelectItem value="guesthouse">Nhà khách</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chi phí dự kiến (VND)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({...formData, estimated_cost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú thêm</Label>
                <Textarea 
                  placeholder="Các thông tin bổ sung khác" 
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
            <Plane className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {trips.filter(t => t.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Yêu cầu được chấp nhận</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {trips.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chi phí dự kiến</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(trips.reduce((sum, t) => sum + t.estimatedCost, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Tổng ước tính</p>
          </CardContent>
        </Card>
      </div>

      {/* Trips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu công tác</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Điểm đến</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Chi phí dự kiến</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : trips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Chưa có yêu cầu công tác nào</TableCell>
                </TableRow>
              ) : (
                trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.profile?.full_name}</TableCell>
                    <TableCell>{trip.department?.name || 'N/A'}</TableCell>
                    <TableCell>{trip.destination}</TableCell>
                    <TableCell>
                      {trip.start_date} đến {trip.end_date}
                    </TableCell>
                    <TableCell>{formatCurrency(trip.estimated_cost || 0)}</TableCell>
                    <TableCell>{getStatusBadge(trip.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Chi tiết</Button>
                        {trip.status === 'pending' && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleApprove(trip.id)}>Duyệt</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(trip.id)}>Từ chối</Button>
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

export default BusinessTripManagement;
