import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  status: 'active' | 'maintenance' | 'inactive';
  registrationExpiry: string;
  insuranceExpiry: string;
  mileage: number;
}

const mockVehicles: Vehicle[] = [
  { id: 'VEH001', plateNumber: '30A-12345', brand: 'Toyota', model: 'Vios', year: 2022, seats: 4, status: 'active', registrationExpiry: '2024-06-15', insuranceExpiry: '2024-08-20', mileage: 25000 },
  { id: 'VEH002', plateNumber: '30B-67890', brand: 'Toyota', model: 'Innova', year: 2021, seats: 7, status: 'active', registrationExpiry: '2024-05-10', insuranceExpiry: '2024-07-15', mileage: 45000 },
  { id: 'VEH003', plateNumber: '30C-11111', brand: 'Hyundai', model: 'Solati', year: 2023, seats: 16, status: 'maintenance', registrationExpiry: '2024-12-30', insuranceExpiry: '2024-11-25', mileage: 18000 },
  { id: 'VEH004', plateNumber: '30A-22222', brand: 'Mazda', model: 'CX-5', year: 2020, seats: 5, status: 'active', registrationExpiry: '2024-03-20', insuranceExpiry: '2024-04-10', mileage: 65000 },
  { id: 'VEH005', plateNumber: '30D-33333', brand: 'Honda', model: 'City', year: 2019, seats: 4, status: 'inactive', registrationExpiry: '2024-02-15', insuranceExpiry: '2024-03-05', mileage: 85000 },
];

export default function VehicleList() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-500';
      case 'inactive': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'maintenance': return 'Bảo dưỡng';
      case 'inactive': return 'Ngừng hoạt động';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hồ sơ xe</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin phương tiện</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm xe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm xe mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Biển số xe</Label>
                <Input placeholder="VD: 30A-12345" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hãng xe</Label>
                  <Input placeholder="VD: Toyota" />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input placeholder="VD: Vios" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Năm sản xuất</Label>
                  <Input type="number" placeholder="2023" />
                </div>
                <div className="space-y-2">
                  <Label>Số chỗ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 chỗ</SelectItem>
                      <SelectItem value="7">7 chỗ</SelectItem>
                      <SelectItem value="16">16 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hạn đăng kiểm</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Hạn bảo hiểm</Label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="w-full">Thêm xe</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng số xe</p>
              <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
            </div>
            <Car className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-500">{vehicles.filter(v => v.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang bảo dưỡng</p>
              <p className="text-2xl font-bold text-yellow-500">{vehicles.filter(v => v.status === 'maintenance').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ngừng hoạt động</p>
              <p className="text-2xl font-bold text-red-500">{vehicles.filter(v => v.status === 'inactive').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo biển số, hãng xe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Hãng xe</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Năm SX</TableHead>
                  <TableHead>Số chỗ</TableHead>
                  <TableHead>Số km</TableHead>
                  <TableHead>Đăng kiểm</TableHead>
                  <TableHead>Bảo hiểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                    <TableCell>{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.seats} chỗ</TableCell>
                    <TableCell>{vehicle.mileage.toLocaleString('vi-VN')} km</TableCell>
                    <TableCell>{vehicle.registrationExpiry}</TableCell>
                    <TableCell>{vehicle.insuranceExpiry}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {getStatusText(vehicle.status)}
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
