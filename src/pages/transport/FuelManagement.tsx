import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fuel, Search, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface FuelRecord {
  id: string;
  vehiclePlate: string;
  driver: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  mileage: number;
  fuelStation: string;
}

const mockFuelRecords: FuelRecord[] = [
  { id: 'FUEL001', vehiclePlate: '30A-12345', driver: 'Nguyễn Văn A', date: '2024-01-15', liters: 45, pricePerLiter: 23000, totalCost: 1035000, mileage: 25000, fuelStation: 'Petrolimex Láng' },
  { id: 'FUEL002', vehiclePlate: '30B-67890', driver: 'Trần Văn B', date: '2024-01-14', liters: 60, pricePerLiter: 23000, totalCost: 1380000, mileage: 45200, fuelStation: 'Shell Giải Phóng' },
  { id: 'FUEL003', vehiclePlate: '30C-11111', driver: 'Lê Thị C', date: '2024-01-14', liters: 80, pricePerLiter: 23500, totalCost: 1880000, mileage: 18500, fuelStation: 'Petrolimex Cầu Giấy' },
  { id: 'FUEL004', vehiclePlate: '30A-22222', driver: 'Phạm Văn D', date: '2024-01-13', liters: 50, pricePerLiter: 23000, totalCost: 1150000, mileage: 65300, fuelStation: 'Shell Láng Hạ' },
];

export default function FuelManagement() {
  const [fuelRecords] = useState<FuelRecord[]>(mockFuelRecords);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = fuelRecords.filter(record =>
    record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLiters = fuelRecords.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = fuelRecords.reduce((sum, r) => sum + r.totalCost, 0);
  const avgPricePerLiter = totalCost / totalLiters;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nhiên liệu</h1>
          <p className="text-muted-foreground mt-1">Theo dõi chi phí nhiên liệu và hiệu suất</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm phiếu nhiên liệu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm phiếu nhiên liệu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Biển số xe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">30A-12345 - Toyota Vios</SelectItem>
                    <SelectItem value="2">30B-67890 - Toyota Innova</SelectItem>
                    <SelectItem value="3">30C-11111 - Hyundai Solati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lái xe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lái xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nguyễn Văn A</SelectItem>
                    <SelectItem value="2">Trần Văn B</SelectItem>
                    <SelectItem value="3">Lê Thị C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày</Label>
                <Input type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số lít</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Giá/lít (VNĐ)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Số km hiện tại</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Cửa hàng xăng</Label>
                <Input placeholder="Tên cửa hàng" />
              </div>
              <Button className="w-full">Thêm phiếu</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng chi phí tháng</p>
              <p className="text-2xl font-bold text-foreground">{totalCost.toLocaleString('vi-VN')} đ</p>
            </div>
            <Fuel className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingDown className="w-4 h-4" />
            <span>-5% so với tháng trước</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng số lít</p>
              <p className="text-2xl font-bold text-foreground">{totalLiters.toLocaleString('vi-VN')} L</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Giá TB/lít</p>
              <p className="text-2xl font-bold text-foreground">{avgPricePerLiter.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
            <TrendingUp className="w-4 h-4" />
            <span>+2% so với tháng trước</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Số lần đổ xăng</p>
              <p className="text-2xl font-bold text-foreground">{fuelRecords.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo biển số, lái xe, mã phiếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Lái xe</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Số lít</TableHead>
                  <TableHead>Giá/lít</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Số km</TableHead>
                  <TableHead>Cửa hàng</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.vehiclePlate}</TableCell>
                    <TableCell>{record.driver}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.liters} L</TableCell>
                    <TableCell>{record.pricePerLiter.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="font-medium">{record.totalCost.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>{record.mileage.toLocaleString('vi-VN')} km</TableCell>
                    <TableCell>{record.fuelStation}</TableCell>
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
