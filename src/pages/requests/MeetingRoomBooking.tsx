import { useState } from 'react';
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

const MeetingRoomBooking = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      roomName: 'Phòng họp A',
      requester: 'Nguyễn Văn A',
      department: 'Kinh doanh',
      date: '2025-10-25',
      timeStart: '09:00',
      timeEnd: '11:00',
      participants: 15,
      purpose: 'Họp tổng kết quý',
      status: 'approved',
      equipment: ['Projector', 'Wifi', 'Whiteboard']
    },
    {
      id: 2,
      roomName: 'Phòng họp B',
      requester: 'Trần Thị B',
      department: 'Nhân sự',
      date: '2025-10-26',
      timeStart: '14:00',
      timeEnd: '16:00',
      participants: 8,
      purpose: 'Phỏng vấn tuyển dụng',
      status: 'pending',
      equipment: ['Wifi', 'TV']
    }
  ]);

  const [open, setOpen] = useState(false);

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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng họp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room-a">Phòng họp A (20 người)</SelectItem>
                      <SelectItem value="room-b">Phòng họp B (10 người)</SelectItem>
                      <SelectItem value="room-c">Phòng họp C (30 người)</SelectItem>
                      <SelectItem value="room-d">Phòng họp D (50 người)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phòng ban</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Kinh doanh</SelectItem>
                      <SelectItem value="hrm">Nhân sự</SelectItem>
                      <SelectItem value="accounting">Kế toán</SelectItem>
                      <SelectItem value="operations">Điều hành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày họp</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Số lượng người tham dự</Label>
                  <Input type="number" placeholder="Nhập số người" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giờ bắt đầu</Label>
                  <Input type="time" />
                </div>
                <div className="space-y-2">
                  <Label>Giờ kết thúc</Label>
                  <Input type="time" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mục đích sử dụng</Label>
                <Textarea placeholder="Mô tả mục đích sử dụng phòng họp" rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Thiết bị cần thiết</Label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Máy chiếu</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Wifi</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Bảng trắng</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">TV/Monitor</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Micro</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Hệ thống âm thanh</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setOpen(false)}>
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
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.roomName}</TableCell>
                  <TableCell>{booking.requester}</TableCell>
                  <TableCell>{booking.department}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.timeStart} - {booking.timeEnd}</TableCell>
                  <TableCell>{booking.participants} người</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Chi tiết</Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button variant="default" size="sm">Duyệt</Button>
                          <Button variant="destructive" size="sm">Từ chối</Button>
                        </>
                      )}
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
};

export default MeetingRoomBooking;
