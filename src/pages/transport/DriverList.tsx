import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Plus, Phone, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  status: 'active' | 'on-leave' | 'inactive';
  experience: number;
  rating: number;
}

const mockDrivers: Driver[] = [
  { id: 'DRV001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'vana@email.com', licenseNumber: '012345678', licenseType: 'B2', licenseExpiry: '2025-12-31', status: 'active', experience: 10, rating: 4.8 },
  { id: 'DRV002', name: 'Trần Văn B', phone: '0902345678', email: 'vanb@email.com', licenseNumber: '023456789', licenseType: 'D', licenseExpiry: '2024-06-30', status: 'active', experience: 15, rating: 4.6 },
  { id: 'DRV003', name: 'Lê Thị C', phone: '0903456789', email: 'thic@email.com', licenseNumber: '034567890', licenseType: 'B2', licenseExpiry: '2026-03-15', status: 'on-leave', experience: 8, rating: 4.9 },
  { id: 'DRV004', name: 'Phạm Văn D', phone: '0904567890', email: 'vand@email.com', licenseNumber: '045678901', licenseType: 'C', licenseExpiry: '2024-09-20', status: 'active', experience: 12, rating: 4.5 },
  { id: 'DRV005', name: 'Hoàng Văn E', phone: '0905678901', email: 'vane@email.com', licenseNumber: '056789012', licenseType: 'B2', licenseExpiry: '2023-12-31', status: 'inactive', experience: 5, rating: 4.2 },
];

export default function DriverList() {
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    driver.licenseNumber.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'on-leave': return 'bg-yellow-500/10 text-yellow-500';
      case 'inactive': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang làm việc';
      case 'on-leave': return 'Nghỉ phép';
      case 'inactive': return 'Ngừng làm việc';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hồ sơ lái xe</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin lái xe</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm lái xe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm lái xe mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Họ tên</Label>
                <Input placeholder="Nhập họ tên" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Nhập SĐT" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Nhập email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số GPLX</Label>
                  <Input placeholder="Số giấy phép" />
                </div>
                <div className="space-y-2">
                  <Label>Loại GPLX</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2">B2</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hạn GPLX</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Kinh nghiệm (năm)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <Button className="w-full">Thêm lái xe</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng lái xe</p>
              <p className="text-2xl font-bold text-foreground">{drivers.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang làm việc</p>
              <p className="text-2xl font-bold text-green-500">{drivers.filter(d => d.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nghỉ phép</p>
              <p className="text-2xl font-bold text-yellow-500">{drivers.filter(d => d.status === 'on-leave').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ngừng làm việc</p>
              <p className="text-2xl font-bold text-red-500">{drivers.filter(d => d.status === 'inactive').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, SĐT, số GPLX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã LX</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>GPLX</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Hạn GPLX</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.id}</TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {driver.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {driver.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{driver.licenseType}</Badge>
                    </TableCell>
                    <TableCell>{driver.licenseExpiry}</TableCell>
                    <TableCell>{driver.experience} năm</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{driver.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(driver.status)}>
                        {getStatusText(driver.status)}
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
