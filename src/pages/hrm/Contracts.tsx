import React, { useState } from 'react';
import { Plus, Search, FileText, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Contract {
  id: string;
  employeeName: string;
  employeeCode: string;
  contractType: string;
  contractNumber: string;
  startDate: string;
  endDate?: string;
  salary: string;
  position: string;
  status: 'Hiệu lực' | 'Hết hạn' | 'Đã thanh lý';
  signedDate: string;
}

const Contracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: '',
    contractType: '',
    contractNumber: '',
    startDate: '',
    endDate: '',
    salary: '',
    position: '',
    notes: ''
  });

  const contracts: Contract[] = [
    {
      id: 'CON001',
      employeeName: 'Nguyễn Văn A',
      employeeCode: 'NV001',
      contractType: 'Hợp đồng không xác định thời hạn',
      contractNumber: 'HĐLĐ-2023-001',
      startDate: '2023-01-15',
      salary: '15.000.000',
      position: 'Trưởng phòng Vận hành',
      status: 'Hiệu lực',
      signedDate: '2023-01-10'
    },
    {
      id: 'CON002',
      employeeName: 'Phạm Thị C',
      employeeCode: 'NV002',
      contractType: 'Hợp đồng xác định thời hạn',
      contractNumber: 'HĐLĐ-2023-002',
      startDate: '2023-03-01',
      endDate: '2024-02-29',
      salary: '12.000.000',
      position: 'Kế toán trưởng',
      status: 'Hết hạn',
      signedDate: '2023-02-25'
    },
    {
      id: 'CON003',
      employeeName: 'Lê Văn D',
      employeeCode: 'NV003',
      contractType: 'Hợp đồng thử việc',
      contractNumber: 'HĐTV-2024-001',
      startDate: '2024-01-02',
      endDate: '2024-03-02',
      salary: '8.000.000',
      position: 'Lái xe',
      status: 'Hiệu lực',
      signedDate: '2023-12-28'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hiệu lực':
        return 'bg-green-500';
      case 'Hết hạn':
        return 'bg-red-500';
      case 'Đã thanh lý':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create contract:', formData);
    setIsCreateOpen(false);
    setFormData({
      employeeCode: '',
      contractType: '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      salary: '',
      position: '',
      notes: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hợp đồng lao động</h1>
          <p className="text-muted-foreground">Quản lý hợp đồng lao động của nhân viên</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm hợp đồng
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm hợp đồng mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nhân viên</Label>
                <Select value={formData.employeeCode} onValueChange={(value) => setFormData({ ...formData, employeeCode: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NV001">NV001 - Nguyễn Văn A</SelectItem>
                    <SelectItem value="NV002">NV002 - Phạm Thị C</SelectItem>
                    <SelectItem value="NV003">NV003 - Lê Văn D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại hợp đồng</Label>
                  <Select value={formData.contractType} onValueChange={(value) => setFormData({ ...formData, contractType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hợp đồng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thu-viec">Hợp đồng thử việc</SelectItem>
                      <SelectItem value="xac-dinh">Hợp đồng xác định thời hạn</SelectItem>
                      <SelectItem value="khong-xac-dinh">Hợp đồng không xác định thời hạn</SelectItem>
                      <SelectItem value="mua-vu">Hợp đồng theo mùa vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Số hợp đồng</Label>
                  <Input
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                    placeholder="Nhập số hợp đồng"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chức vụ</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Nhập chức vụ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mức lương (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="Nhập mức lương"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thêm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm hợp đồng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số HĐ</TableHead>
              <TableHead>Mã NV</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Loại hợp đồng</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead>Thời hạn</TableHead>
              <TableHead>Lương</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {contract.contractNumber}
                  </div>
                </TableCell>
                <TableCell>{contract.employeeCode}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {contract.employeeName}
                  </div>
                </TableCell>
                <TableCell>{contract.contractType}</TableCell>
                <TableCell>{contract.position}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {contract.startDate}
                    </div>
                    {contract.endDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {contract.endDate}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{contract.salary.toLocaleString()} đ</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Contracts;
