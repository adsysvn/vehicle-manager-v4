import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchLeaveRequests();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(data);
    }
  };

  const fetchLeaveRequests = async () => {
    const { data, error } = await supabase
      .from('leave_requests')
      .select(`
        *,
        profiles:profile_id (
          full_name,
          employee_code
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đơn nghỉ',
        variant: 'destructive'
      });
      return;
    }

    setLeaveRequests(data || []);
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalDays = calculateDays(formData.start_date, formData.end_date);

      const { error } = await supabase
        .from('leave_requests')
        .insert({
          profile_id: currentUser.id,
          leave_type: formData.leave_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          total_days: totalDays,
          reason: formData.reason,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã tạo đơn nghỉ phép'
      });

      setIsDialogOpen(false);
      setFormData({
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: ''
      });
      fetchLeaveRequests();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nghỉ phép</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý đơn xin nghỉ của nhân viên
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo đơn nghỉ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo đơn nghỉ phép</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="leave_type">Loại nghỉ *</Label>
                  <Select value={formData.leave_type} onValueChange={(value) => setFormData({...formData, leave_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại nghỉ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nghỉ phép năm">Nghỉ phép năm</SelectItem>
                      <SelectItem value="Nghỉ ốm">Nghỉ ốm</SelectItem>
                      <SelectItem value="Nghỉ việc riêng">Nghỉ việc riêng</SelectItem>
                      <SelectItem value="Nghỉ thai sản">Nghỉ thai sản</SelectItem>
                      <SelectItem value="Nghỉ không lương">Nghỉ không lương</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Từ ngày *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Đến ngày *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="reason">Lý do</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={3}
                  />
                </div>

                {formData.start_date && formData.end_date && (
                  <div className="col-span-2 p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      Số ngày nghỉ: <strong>{calculateDays(formData.start_date, formData.end_date)} ngày</strong>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang tạo...' : 'Tạo đơn'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Đơn xin nghỉ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Đơn trong tháng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Đơn trong tháng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nghỉ hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn nghỉ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Loại nghỉ</TableHead>
                <TableHead>Từ ngày</TableHead>
                <TableHead>Đến ngày</TableHead>
                <TableHead>Số ngày</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.profiles?.employee_code} - {request.profiles?.full_name}
                  </TableCell>
                  <TableCell>{request.leave_type}</TableCell>
                  <TableCell>{new Date(request.start_date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{new Date(request.end_date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{request.total_days}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {request.status === 'approved' ? 'Đã duyệt' : 
                       request.status === 'pending' ? 'Chờ duyệt' : 
                       'Từ chối'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="default">Duyệt</Button>
                        <Button size="sm" variant="outline">Từ chối</Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {leaveRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Chưa có đơn nghỉ nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;
