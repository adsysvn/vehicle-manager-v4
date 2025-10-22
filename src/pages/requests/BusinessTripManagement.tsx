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
import { Plus, Plane, MapPin, Calendar, DollarSign } from 'lucide-react';

const BusinessTripManagement = () => {
  const [trips, setTrips] = useState([
    {
      id: 1,
      employee: 'Nguyễn Văn A',
      department: 'Kinh doanh',
      destination: 'Hà Nội',
      purpose: 'Gặp khách hàng mới',
      startDate: '2025-10-28',
      endDate: '2025-10-30',
      estimatedCost: 5000000,
      status: 'approved',
      transportation: 'Máy bay',
      accommodation: 'Khách sạn 4 sao'
    },
    {
      id: 2,
      employee: 'Trần Thị B',
      department: 'Điều hành',
      destination: 'Đà Nẵng',
      purpose: 'Khảo sát địa điểm',
      startDate: '2025-11-01',
      endDate: '2025-11-03',
      estimatedCost: 3500000,
      status: 'pending',
      transportation: 'Xe công ty',
      accommodation: 'Khách sạn 3 sao'
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
                  <Label>Nhân viên</Label>
                  <Input placeholder="Tên nhân viên" />
                </div>
                <div className="space-y-2">
                  <Label>Phòng ban</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Kinh doanh</SelectItem>
                      <SelectItem value="operations">Điều hành</SelectItem>
                      <SelectItem value="hrm">Nhân sự</SelectItem>
                      <SelectItem value="accounting">Kế toán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Điểm đến</Label>
                  <Input placeholder="Thành phố/Tỉnh" />
                </div>
                <div className="space-y-2">
                  <Label>Phương tiện di chuyển</Label>
                  <Select>
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
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mục đích công tác</Label>
                <Textarea placeholder="Mô tả chi tiết mục đích công tác" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nơi lưu trú</Label>
                  <Select>
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
                  <Input type="number" placeholder="0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú thêm</Label>
                <Textarea placeholder="Các thông tin bổ sung khác" rows={2} />
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
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.employee}</TableCell>
                  <TableCell>{trip.department}</TableCell>
                  <TableCell>{trip.destination}</TableCell>
                  <TableCell>
                    {trip.startDate} đến {trip.endDate}
                  </TableCell>
                  <TableCell>{formatCurrency(trip.estimatedCost)}</TableCell>
                  <TableCell>{getStatusBadge(trip.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Chi tiết</Button>
                      {trip.status === 'pending' && (
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

export default BusinessTripManagement;
