import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Car, Search, Plus, Calendar, Clock, MapPin } from 'lucide-react';

interface CTVBooking {
  id: string;
  ctvName: string;
  customerName: string;
  route: string;
  date: string;
  time: string;
  vehicleType: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
}

const mockBookings: CTVBooking[] = [
  { id: 'CTVB001', ctvName: 'Nguyễn Văn A', customerName: 'Công ty ABC', route: 'Hà Nội - Hải Phòng', date: '2024-01-15', time: '08:00', vehicleType: '7 chỗ', status: 'confirmed', price: 1500000 },
  { id: 'CTVB002', ctvName: 'Trần Văn B', customerName: 'Công ty XYZ', route: 'Hà Nội - Quảng Ninh', date: '2024-01-15', time: '09:30', vehicleType: '16 chỗ', status: 'in-progress', price: 2500000 },
  { id: 'CTVB003', ctvName: 'Lê Thị C', customerName: 'Công ty 123', route: 'Hà Nội - Ninh Bình', date: '2024-01-16', time: '07:00', vehicleType: '4 chỗ', status: 'pending', price: 1200000 },
  { id: 'CTVB004', ctvName: 'Phạm Văn D', customerName: 'Công ty DEF', route: 'Hà Nội - Nam Định', date: '2024-01-14', time: '14:00', vehicleType: '7 chỗ', status: 'completed', price: 1800000 },
];

export default function CTVBooking() {
  const [bookings] = useState<CTVBooking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking =>
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.ctvName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500';
      case 'in-progress': return 'bg-purple-500/10 text-purple-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'in-progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Đặt xe CTV</h1>
          <p className="text-muted-foreground mt-1">Quản lý booking với cộng tác viên</p>
        </div>
        <Dialog>
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
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chọn CTV</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn CTV" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ctv1">Nguyễn Văn A - 4 chỗ</SelectItem>
                      <SelectItem value="ctv2">Trần Văn B - 7 chỗ</SelectItem>
                      <SelectItem value="ctv3">Lê Thị C - 16 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Khách hàng</Label>
                  <Input placeholder="Tên khách hàng" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tuyến đường</Label>
                <Input placeholder="VD: Hà Nội - Hải Phòng" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Giờ</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại xe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 chỗ</SelectItem>
                      <SelectItem value="7">7 chỗ</SelectItem>
                      <SelectItem value="16">16 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giá (VNĐ)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea placeholder="Nhập ghi chú..." />
              </div>
              <Button className="w-full">Tạo booking</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng booking</p>
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
            </div>
            <Car className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-500">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã xác nhận</p>
              <p className="text-2xl font-bold text-blue-500">{bookings.filter(b => b.status === 'confirmed').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang thực hiện</p>
              <p className="text-2xl font-bold text-purple-500">{bookings.filter(b => b.status === 'in-progress').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-500">{bookings.filter(b => b.status === 'completed').length}</p>
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
                  <TableHead>CTV</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tuyến đường</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại xe</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.ctvName}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.route}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.vehicleType}</TableCell>
                    <TableCell className="font-medium">{booking.price.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Chi tiết</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
