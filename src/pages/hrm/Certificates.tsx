import React, { useState } from 'react';
import { Plus, Search, Award, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Certificate {
  id: string;
  employeeName: string;
  employeeCode: string;
  certificateType: string;
  certificateName: string;
  issuingOrganization: string;
  certificateNumber: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'Còn hạn' | 'Sắp hết hạn' | 'Hết hạn';
}

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: '',
    certificateType: '',
    certificateName: '',
    issuingOrganization: '',
    certificateNumber: '',
    issuedDate: '',
    expiryDate: ''
  });

  const certificates: Certificate[] = [
    {
      id: 'CERT001',
      employeeName: 'Nguyễn Văn A',
      employeeCode: 'NV001',
      certificateType: 'Bằng lái xe',
      certificateName: 'Bằng lái xe hạng D',
      issuingOrganization: 'Sở GTVT TP.HCM',
      certificateNumber: 'BLX-123456789',
      issuedDate: '2020-05-15',
      expiryDate: '2030-05-15',
      status: 'Còn hạn'
    },
    {
      id: 'CERT002',
      employeeName: 'Phạm Thị C',
      employeeCode: 'NV002',
      certificateType: 'Chứng chỉ nghề',
      certificateName: 'Chứng chỉ kế toán trưởng',
      issuingOrganization: 'Bộ Tài chính',
      certificateNumber: 'KT-2021-7890',
      issuedDate: '2021-03-20',
      status: 'Còn hạn'
    },
    {
      id: 'CERT003',
      employeeName: 'Lê Văn D',
      employeeCode: 'NV003',
      certificateType: 'Chứng chỉ An toàn',
      certificateName: 'Chứng chỉ ATLĐ',
      issuingOrganization: 'Sở Lao động TB&XH',
      certificateNumber: 'ATLĐ-2023-111',
      issuedDate: '2023-01-10',
      expiryDate: '2024-01-10',
      status: 'Sắp hết hạn'
    },
    {
      id: 'CERT004',
      employeeName: 'Hoàng Văn E',
      employeeCode: 'NV004',
      certificateType: 'Bằng lái xe',
      certificateName: 'Bằng lái xe hạng C',
      issuingOrganization: 'Sở GTVT Hà Nội',
      certificateNumber: 'BLX-987654321',
      issuedDate: '2013-08-20',
      expiryDate: '2023-08-20',
      status: 'Hết hạn'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn hạn':
        return 'bg-green-500';
      case 'Sắp hết hạn':
        return 'bg-yellow-500';
      case 'Hết hạn':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create certificate:', formData);
    setIsCreateOpen(false);
    setFormData({
      employeeCode: '',
      certificateType: '',
      certificateName: '',
      issuingOrganization: '',
      certificateNumber: '',
      issuedDate: '',
      expiryDate: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chứng chỉ</h1>
          <p className="text-muted-foreground">Quản lý các chứng chỉ nghề nghiệp của nhân viên</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm chứng chỉ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm chứng chỉ mới</DialogTitle>
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
                  <Label>Loại chứng chỉ</Label>
                  <Select value={formData.certificateType} onValueChange={(value) => setFormData({ ...formData, certificateType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại chứng chỉ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bang-lai">Bằng lái xe</SelectItem>
                      <SelectItem value="chung-chi-nghe">Chứng chỉ nghề</SelectItem>
                      <SelectItem value="an-toan">Chứng chỉ An toàn</SelectItem>
                      <SelectItem value="ngoai-ngu">Chứng chỉ Ngoại ngữ</SelectItem>
                      <SelectItem value="tin-hoc">Chứng chỉ Tin học</SelectItem>
                      <SelectItem value="khac">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tên chứng chỉ</Label>
                  <Input
                    value={formData.certificateName}
                    onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                    placeholder="Nhập tên chứng chỉ"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cơ quan cấp</Label>
                <Input
                  value={formData.issuingOrganization}
                  onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                  placeholder="Nhập tên cơ quan cấp"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Số chứng chỉ</Label>
                <Input
                  value={formData.certificateNumber}
                  onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                  placeholder="Nhập số chứng chỉ"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày cấp</Label>
                  <Input
                    type="date"
                    value={formData.issuedDate}
                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ngày hết hạn (nếu có)</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
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
              placeholder="Tìm kiếm chứng chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã NV</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Loại chứng chỉ</TableHead>
              <TableHead>Tên chứng chỉ</TableHead>
              <TableHead>Cơ quan cấp</TableHead>
              <TableHead>Số CC</TableHead>
              <TableHead>Ngày cấp</TableHead>
              <TableHead>Ngày hết hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell className="font-medium">{cert.employeeCode}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {cert.employeeName}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <Award className="w-3 h-3" />
                    {cert.certificateType}
                  </Badge>
                </TableCell>
                <TableCell>{cert.certificateName}</TableCell>
                <TableCell>{cert.issuingOrganization}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {cert.certificateNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {cert.issuedDate}
                  </div>
                </TableCell>
                <TableCell>
                  {cert.expiryDate ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {cert.expiryDate}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Không có</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(cert.status)}>
                    {cert.status}
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

export default Certificates;
