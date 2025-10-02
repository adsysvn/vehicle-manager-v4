import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';

const VehicleInsurance = () => {
  const [insurances, setInsurances] = useState([
    {
      id: 1,
      vehicleNumber: '29A-12345',
      policyNumber: 'BH-2024-001',
      insuranceType: 'Bảo hiểm vật chất',
      provider: 'Bảo Việt',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premium: 5000000,
      coverage: 500000000,
      status: 'active',
      daysUntilExpiry: 90
    },
    {
      id: 2,
      vehicleNumber: '29B-67890',
      policyType: 'BH-2024-002',
      insuranceType: 'Bảo hiểm TNDS bắt buộc',
      provider: 'PTI',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      premium: 456000,
      coverage: 150000000,
      status: 'active',
      daysUntilExpiry: 120
    },
    {
      id: 3,
      vehicleNumber: '29C-11111',
      policyNumber: 'BH-2023-999',
      insuranceType: 'Bảo hiểm vật chất',
      provider: 'Bảo Minh',
      startDate: '2023-06-01',
      endDate: '2024-06-01',
      premium: 4800000,
      coverage: 450000000,
      status: 'expiring',
      daysUntilExpiry: 10
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Đang hiệu lực</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Sắp hết hạn</Badge>;
      case 'expired':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Hết hạn</Badge>;
      default:
        return null;
    }
  };

  const handleAddInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý bảo hiểm</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bảo hiểm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm hợp đồng bảo hiểm</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddInsurance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Biển số xe</Label>
                  <Input id="vehicleNumber" placeholder="29A-12345" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Số hợp đồng</Label>
                  <Input id="policyNumber" placeholder="BH-2024-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceType">Loại bảo hiểm</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại bảo hiểm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tnds">Bảo hiểm TNDS bắt buộc</SelectItem>
                      <SelectItem value="vatchat">Bảo hiểm vật chất</SelectItem>
                      <SelectItem value="hanghoavan">Bảo hiểm hàng hóa vận chuyển</SelectItem>
                      <SelectItem value="hanh khach">Bảo hiểm hành khách</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Công ty bảo hiểm</Label>
                  <Input id="provider" placeholder="Bảo Việt" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input id="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input id="endDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premium">Phí bảo hiểm (VNĐ)</Label>
                  <Input id="premium" type="number" placeholder="5000000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverage">Số tiền bảo hiểm (VNĐ)</Label>
                  <Input id="coverage" type="number" placeholder="500000000" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu thông tin</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đang hiệu lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {insurances.filter(i => i.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sắp hết hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {insurances.filter(i => i.status === 'expiring').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng phí/năm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(insurances.reduce((sum, i) => sum + i.premium, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hợp đồng bảo hiểm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Số HĐ</TableHead>
                <TableHead>Loại BH</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Phí BH</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insurances.map((insurance) => (
                <TableRow key={insurance.id}>
                  <TableCell className="font-medium">{insurance.vehicleNumber}</TableCell>
                  <TableCell>{insurance.policyNumber}</TableCell>
                  <TableCell>{insurance.insuranceType}</TableCell>
                  <TableCell>{insurance.provider}</TableCell>
                  <TableCell>{insurance.startDate}</TableCell>
                  <TableCell>{insurance.endDate}</TableCell>
                  <TableCell>{formatCurrency(insurance.premium)}</TableCell>
                  <TableCell>{getStatusBadge(insurance.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Chi tiết</Button>
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

export default VehicleInsurance;
