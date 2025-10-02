import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';

const VehicleRegistration = () => {
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      vehicleNumber: '29A-12345',
      registrationNumber: 'DK-2024-001',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      inspectionCenter: 'Trung tâm đăng kiểm 29-01V',
      status: 'valid',
      daysUntilExpiry: 45
    },
    {
      id: 2,
      vehicleNumber: '29B-67890',
      registrationNumber: 'DK-2023-456',
      issueDate: '2023-12-20',
      expiryDate: '2024-12-20',
      inspectionCenter: 'Trung tâm đăng kiểm 29-02V',
      status: 'expiring',
      daysUntilExpiry: 15
    },
    {
      id: 3,
      vehicleNumber: '29C-11111',
      registrationNumber: 'DK-2023-789',
      issueDate: '2023-11-10',
      expiryDate: '2024-11-10',
      inspectionCenter: 'Trung tâm đăng kiểm 29-01V',
      status: 'expired',
      daysUntilExpiry: -20
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Còn hiệu lực</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Sắp hết hạn</Badge>;
      case 'expired':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Hết hạn</Badge>;
      default:
        return null;
    }
  };

  const handleAddRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý đăng kiểm</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm đăng kiểm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm thông tin đăng kiểm</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRegistration} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Biển số xe</Label>
                  <Input id="vehicleNumber" placeholder="29A-12345" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Số đăng kiểm</Label>
                  <Input id="registrationNumber" placeholder="DK-2024-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Ngày cấp</Label>
                  <Input id="issueDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                  <Input id="expiryDate" type="date" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="inspectionCenter">Trung tâm đăng kiểm</Label>
                  <Input id="inspectionCenter" placeholder="Trung tâm đăng kiểm 29-01V" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Chi phí (VNĐ)</Label>
                  <Input id="fee" type="number" placeholder="340000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextInspection">Lần kiểm tra tiếp theo</Label>
                  <Input id="nextInspection" type="date" />
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
            <CardTitle className="text-sm">Còn hiệu lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {registrations.filter(r => r.status === 'valid').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sắp hết hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {registrations.filter(r => r.status === 'expiring').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hết hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {registrations.filter(r => r.status === 'expired').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đăng kiểm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Số đăng kiểm</TableHead>
                <TableHead>Ngày cấp</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Trung tâm ĐK</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.vehicleNumber}</TableCell>
                  <TableCell>{reg.registrationNumber}</TableCell>
                  <TableCell>{reg.issueDate}</TableCell>
                  <TableCell>{reg.expiryDate}</TableCell>
                  <TableCell>{reg.inspectionCenter}</TableCell>
                  <TableCell>{getStatusBadge(reg.status)}</TableCell>
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

export default VehicleRegistration;
