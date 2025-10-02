import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, Search, Plus, Phone, Mail, MapPin } from 'lucide-react';

interface CTV {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  location: string;
  status: 'active' | 'inactive' | 'busy';
  rating: number;
  completedTrips: number;
}

const mockCTVs: CTV[] = [
  { id: 'CTV001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'vana@email.com', vehicleType: '4 chỗ', location: 'Hà Nội', status: 'active', rating: 4.8, completedTrips: 234 },
  { id: 'CTV002', name: 'Trần Văn B', phone: '0902345678', email: 'vanb@email.com', vehicleType: '7 chỗ', location: 'Hà Nội', status: 'busy', rating: 4.5, completedTrips: 187 },
  { id: 'CTV003', name: 'Lê Thị C', phone: '0903456789', email: 'thic@email.com', vehicleType: '16 chỗ', location: 'Hải Phòng', status: 'active', rating: 4.9, completedTrips: 312 },
  { id: 'CTV004', name: 'Phạm Văn D', phone: '0904567890', email: 'vand@email.com', vehicleType: '4 chỗ', location: 'Hà Nội', status: 'inactive', rating: 4.2, completedTrips: 89 },
];

export default function CTVManager() {
  const [ctvs] = useState<CTV[]>(mockCTVs);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCTVs = ctvs.filter(ctv =>
    ctv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ctv.phone.includes(searchTerm) ||
    ctv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'busy': return 'bg-yellow-500/10 text-yellow-500';
      case 'inactive': return 'bg-gray-500/10 text-gray-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Sẵn sàng';
      case 'busy': return 'Đang bận';
      case 'inactive': return 'Không hoạt động';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý CTV</h1>
          <p className="text-muted-foreground mt-1">Quản lý cộng tác viên và đối tác vận chuyển</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm CTV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm CTV mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Họ tên</Label>
                <Input placeholder="Nhập họ tên" />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input placeholder="Nhập số điện thoại" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Nhập email" />
              </div>
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
                <Label>Khu vực</Label>
                <Input placeholder="Nhập khu vực" />
              </div>
              <Button className="w-full">Thêm CTV</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng CTV</p>
              <p className="text-2xl font-bold text-foreground">{ctvs.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang sẵn sàng</p>
              <p className="text-2xl font-bold text-green-500">{ctvs.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang bận</p>
              <p className="text-2xl font-bold text-yellow-500">{ctvs.filter(c => c.status === 'busy').length}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Không hoạt động</p>
              <p className="text-2xl font-bold text-muted-foreground">{ctvs.filter(c => c.status === 'inactive').length}</p>
            </div>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-muted-foreground rounded-full" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, số điện thoại, mã CTV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã CTV</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Loại xe</TableHead>
                  <TableHead>Khu vực</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Chuyến hoàn thành</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCTVs.map((ctv) => (
                  <TableRow key={ctv.id}>
                    <TableCell className="font-medium">{ctv.id}</TableCell>
                    <TableCell>{ctv.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {ctv.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {ctv.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{ctv.vehicleType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ctv.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ctv.status)}>
                        {getStatusText(ctv.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{ctv.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ctv.completedTrips}</TableCell>
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
