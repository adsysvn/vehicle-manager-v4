import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, Star, Phone, Car } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  assignmentType: 'dedicated' | 'flexible';
  assignedVehicle?: string;
  status: 'available' | 'driving' | 'rest';
  rating: number;
  experience: string;
}

const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    license: 'B2, C, E',
    assignmentType: 'dedicated',
    assignedVehicle: '30A-123.45 (7 chỗ)',
    status: 'available',
    rating: 4.8,
    experience: '5 năm'
  },
  {
    id: 'D002',
    name: 'Trần Văn B',
    phone: '0987654321',
    license: 'B2, C',
    assignmentType: 'flexible',
    status: 'driving',
    rating: 4.5,
    experience: '3 năm'
  },
  {
    id: 'D003',
    name: 'Lê Văn C',
    phone: '0912345678',
    license: 'B2, C, D, E',
    assignmentType: 'dedicated',
    assignedVehicle: '51B-678.90 (16 chỗ)',
    status: 'rest',
    rating: 4.9,
    experience: '8 năm'
  }
];

export default function DriverManagement() {
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [filterType, setFilterType] = useState<'all' | 'dedicated' | 'flexible'>('all');

  const filteredDrivers = drivers.filter(d => 
    filterType === 'all' ? true : d.assignmentType === filterType
  );

  const statusConfig = {
    available: { label: 'Sẵn sàng', color: 'default' },
    driving: { label: 'Đang lái', color: 'secondary' },
    rest: { label: 'Nghỉ ngơi', color: 'outline' }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Lái xe</h1>
          <p className="text-muted-foreground mt-1">Quản lý lái xe cố định và linh hoạt</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm lái xe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng lái xe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{drivers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lái xe cố định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {drivers.filter(d => d.assignmentType === 'dedicated').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lái xe linh hoạt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {drivers.filter(d => d.assignmentType === 'flexible').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {drivers.filter(d => d.status === 'driving').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách lái xe</CardTitle>
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="dedicated">Cố định</TabsTrigger>
                <TabsTrigger value="flexible">Linh hoạt</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã LX</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Bằng lái</TableHead>
                <TableHead>Loại phân công</TableHead>
                <TableHead>Xe được gán</TableHead>
                <TableHead>Kinh nghiệm</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{driver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{driver.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{driver.license}</TableCell>
                  <TableCell>
                    <Badge variant={driver.assignmentType === 'dedicated' ? 'default' : 'secondary'}>
                      {driver.assignmentType === 'dedicated' ? 'Cố định' : 'Linh hoạt'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {driver.assignedVehicle ? (
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-primary" />
                        <span className="text-sm">{driver.assignedVehicle}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Chưa gán</span>
                    )}
                  </TableCell>
                  <TableCell>{driver.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{driver.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[driver.status].color as any}>
                      {statusConfig[driver.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}