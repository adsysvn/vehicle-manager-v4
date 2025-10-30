import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, DollarSign, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehiclePricing {
  id: string;
  vehicleType: string;
  companyId: string;
  companyName: string;
  routeId?: string;
  routeName?: string;
  basePrice: number;
  pricePerKm: number;
  minKm: number;
  distance?: number; // km cho hành trình cụ thể
  pricePerHour: number;
  nightSurcharge: number;
  holidaySurcharge: number;
  effectiveDate: string;
  status: 'active' | 'inactive';
}

const mockPricing: VehiclePricing[] = [
  {
    id: 'PRICE001',
    vehicleType: '4 chỗ',
    companyId: 'COMP001',
    companyName: 'Công ty TNHH ABC',
    routeId: 'RT001',
    routeName: 'HCM - Vũng Tàu',
    basePrice: 300000,
    pricePerKm: 8000,
    minKm: 20,
    distance: 125,
    pricePerHour: 150000,
    nightSurcharge: 20,
    holidaySurcharge: 30,
    effectiveDate: '2024-01-01',
    status: 'active'
  },
  {
    id: 'PRICE002',
    vehicleType: '7 chỗ',
    companyId: 'COMP001',
    companyName: 'Công ty TNHH ABC',
    routeId: 'RT001',
    routeName: 'HCM - Vũng Tàu',
    basePrice: 400000,
    pricePerKm: 10000,
    minKm: 20,
    distance: 125,
    pricePerHour: 180000,
    nightSurcharge: 20,
    holidaySurcharge: 30,
    effectiveDate: '2024-01-01',
    status: 'active'
  },
  {
    id: 'PRICE003',
    vehicleType: '4 chỗ',
    companyId: 'COMP002',
    companyName: 'Công ty CP XYZ',
    routeId: 'RT002',
    routeName: 'HCM - Đà Lạt',
    basePrice: 320000,
    pricePerKm: 8500,
    minKm: 20,
    distance: 308,
    pricePerHour: 160000,
    nightSurcharge: 25,
    holidaySurcharge: 35,
    effectiveDate: '2024-01-01',
    status: 'active'
  },
  {
    id: 'PRICE004',
    vehicleType: '16 chỗ',
    companyId: 'COMP001',
    companyName: 'Công ty TNHH ABC',
    routeId: 'RT001',
    routeName: 'HCM - Vũng Tàu',
    basePrice: 600000,
    pricePerKm: 12000,
    minKm: 30,
    distance: 125,
    pricePerHour: 250000,
    nightSurcharge: 20,
    holidaySurcharge: 30,
    effectiveDate: '2024-01-01',
    status: 'active'
  },
  {
    id: 'PRICE005',
    vehicleType: '7 chỗ',
    companyId: 'COMP001',
    companyName: 'Công ty TNHH ABC',
    routeId: 'RT003',
    routeName: 'HCM - Phan Thiết',
    basePrice: 400000,
    pricePerKm: 10000,
    minKm: 20,
    distance: 200,
    pricePerHour: 180000,
    nightSurcharge: 20,
    holidaySurcharge: 30,
    effectiveDate: '2024-01-01',
    status: 'active'
  }
];

export default function PricingPerKm() {
  const [pricing, setPricing] = useState<VehiclePricing[]>(mockPricing);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCompany, setFilterCompany] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const calculateEstimate = (vehicleType: string, km: number, hours: number) => {
    const price = pricing.find(p => p.vehicleType === vehicleType);
    if (!price) return 0;
    
    const kmCost = Math.max(km, price.minKm) * price.pricePerKm;
    const hourCost = hours * price.pricePerHour;
    return price.basePrice + kmCost + hourCost;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bảng giá theo Km</h1>
          <p className="text-muted-foreground mt-1">Quản lý đơn giá và phụ phí theo loại xe</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bảng giá
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm bảng giá mới</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Công ty</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn công ty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMP001">Công ty TNHH ABC</SelectItem>
                    <SelectItem value="COMP002">Công ty CP XYZ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Loại xe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4seats">4 chỗ</SelectItem>
                    <SelectItem value="7seats">7 chỗ</SelectItem>
                    <SelectItem value="16seats">16 chỗ</SelectItem>
                    <SelectItem value="29seats">29 chỗ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Giá khởi điểm (VNĐ)</Label>
                  <Input id="basePrice" type="number" placeholder="300000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerKm">Giá/Km (VNĐ)</Label>
                  <Input id="pricePerKm" type="number" placeholder="8000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minKm">Km tối thiểu</Label>
                  <Input id="minKm" type="number" placeholder="20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Giá/Giờ (VNĐ)</Label>
                  <Input id="pricePerHour" type="number" placeholder="150000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nightSurcharge">Phụ phí đêm (%)</Label>
                  <Input id="nightSurcharge" type="number" placeholder="20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holidaySurcharge">Phụ phí lễ/tết (%)</Label>
                  <Input id="holidaySurcharge" type="number" placeholder="30" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="effectiveDate">Ngày hiệu lực</Label>
                  <Input id="effectiveDate" type="date" required />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu bảng giá</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Lọc theo công ty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả công ty</SelectItem>
            <SelectItem value="COMP001">Công ty TNHH ABC</SelectItem>
            <SelectItem value="COMP002">Công ty CP XYZ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pricing.filter(p => filterCompany === 'all' || p.companyId === filterCompany).map((price) => (
          <Card key={price.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{price.vehicleType}</span>
                <Badge variant={price.status === 'active' ? 'default' : 'secondary'}>
                  {price.status === 'active' ? 'Đang áp dụng' : 'Không áp dụng'}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{price.companyName}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Giá khởi điểm</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(price.basePrice)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Giá/Km</p>
                  <p className="font-medium">{formatCurrency(price.pricePerKm)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Km tối thiểu</p>
                  <p className="font-medium">{price.minKm} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Giá/Giờ</p>
                  <p className="font-medium">{formatCurrency(price.pricePerHour)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phụ phí đêm</p>
                  <p className="font-medium">+{price.nightSurcharge}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bảng giá chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công ty</TableHead>
                  <TableHead>Hành trình</TableHead>
                  <TableHead>Loại xe</TableHead>
                  <TableHead>Số km</TableHead>
                  <TableHead>Khởi điểm</TableHead>
                  <TableHead>Giá/Km</TableHead>
                  <TableHead>Tổng</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricing.filter(p => filterCompany === 'all' || p.companyId === filterCompany).map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="text-sm">{price.companyName}</TableCell>
                    <TableCell>
                      {price.routeName ? (
                        <Badge variant="secondary">{price.routeName}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Chung</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{price.vehicleType}</TableCell>
                    <TableCell>
                      {price.distance ? (
                        <Badge>{price.distance} km</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(price.basePrice)}</TableCell>
                    <TableCell>{formatCurrency(price.pricePerKm)}</TableCell>
                    <TableCell className="font-medium">
                      {price.distance ? formatCurrency(price.basePrice + (price.distance * price.pricePerKm)) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Công cụ tính giá ước tính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Loại xe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại xe" />
                  </SelectTrigger>
                  <SelectContent>
                    {pricing.map(p => (
                      <SelectItem key={p.id} value={p.vehicleType}>{p.vehicleType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimateKm">Số Km</Label>
                  <Input id="estimateKm" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimateHours">Số giờ</Label>
                  <Input id="estimateHours" type="number" placeholder="4" />
                </div>
              </div>
              <Button className="w-full">Tính giá</Button>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Ước tính chi phí</p>
                <p className="text-3xl font-bold text-primary">1,540,000 ₫</p>
                <p className="text-xs text-muted-foreground mt-2">
                  * Chưa bao gồm phụ phí đêm và lễ/tết
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
