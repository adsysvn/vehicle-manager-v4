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
import { Settings, Search, Plus, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Maintenance {
  id: string;
  vehiclePlate: string;
  type: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  cost: number;
  description: string;
  garage: string;
}

const mockMaintenance: Maintenance[] = [
  { id: 'MNT001', vehiclePlate: '30A-12345', type: 'Bảo dưỡng định kỳ', scheduledDate: '2024-01-20', status: 'scheduled', cost: 1500000, description: 'Thay dầu máy, lọc gió', garage: 'Garage ABC' },
  { id: 'MNT002', vehiclePlate: '30B-67890', type: 'Sửa chữa', scheduledDate: '2024-01-15', status: 'in-progress', cost: 3500000, description: 'Thay phanh', garage: 'Garage XYZ' },
  { id: 'MNT003', vehiclePlate: '30C-11111', type: 'Kiểm tra định kỳ', scheduledDate: '2024-01-10', completedDate: '2024-01-10', status: 'completed', cost: 500000, description: 'Kiểm tra tổng thể', garage: 'Garage 123' },
  { id: 'MNT004', vehiclePlate: '30A-22222', type: 'Bảo dưỡng định kỳ', scheduledDate: '2024-01-05', status: 'overdue', cost: 1800000, description: 'Thay dầu, lọc', garage: 'Garage ABC' },
];

export default function MaintenanceSchedule() {
  const [maintenances] = useState<Maintenance[]>(mockMaintenance);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaintenances = maintenances.filter(m =>
    m.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-500';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'overdue': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'in-progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'overdue': return 'Quá hạn';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lịch bảo dưỡng</h1>
          <p className="text-muted-foreground mt-1">Quản lý lịch bảo dưỡng và sửa chữa xe</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm lịch bảo dưỡng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm lịch bảo dưỡng</DialogTitle>
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
                <Label>Loại bảo dưỡng</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Bảo dưỡng định kỳ</SelectItem>
                    <SelectItem value="repair">Sửa chữa</SelectItem>
                    <SelectItem value="inspection">Kiểm tra định kỳ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày hẹn</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Garage</Label>
                <Input placeholder="Tên garage" />
              </div>
              <div className="space-y-2">
                <Label>Chi phí dự kiến (VNĐ)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Mô tả công việc</Label>
                <Textarea placeholder="Nhập mô tả..." />
              </div>
              <Button className="w-full">Thêm lịch</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng lịch</p>
              <p className="text-2xl font-bold text-foreground">{maintenances.length}</p>
            </div>
            <Settings className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã lên lịch</p>
              <p className="text-2xl font-bold text-blue-500">{maintenances.filter(m => m.status === 'scheduled').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang thực hiện</p>
              <p className="text-2xl font-bold text-yellow-500">{maintenances.filter(m => m.status === 'in-progress').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quá hạn</p>
              <p className="text-2xl font-bold text-red-500">{maintenances.filter(m => m.status === 'overdue').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo biển số, loại bảo dưỡng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày hẹn</TableHead>
                  <TableHead>Ngày hoàn thành</TableHead>
                  <TableHead>Garage</TableHead>
                  <TableHead>Chi phí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaintenances.map((maintenance) => (
                  <TableRow key={maintenance.id}>
                    <TableCell className="font-medium">{maintenance.id}</TableCell>
                    <TableCell>{maintenance.vehiclePlate}</TableCell>
                    <TableCell>{maintenance.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {maintenance.scheduledDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      {maintenance.completedDate ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {maintenance.completedDate}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{maintenance.garage}</TableCell>
                    <TableCell className="font-medium">{maintenance.cost.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(maintenance.status)}>
                        {getStatusText(maintenance.status)}
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
