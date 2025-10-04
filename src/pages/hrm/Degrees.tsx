import React, { useState } from 'react';
import { Plus, Search, GraduationCap, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Degree {
  id: string;
  employeeName: string;
  employeeCode: string;
  degreeType: string;
  major: string;
  institution: string;
  graduationYear: string;
  degreeNumber: string;
  issuedDate: string;
  classification: string;
}

const Degrees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: '',
    degreeType: '',
    major: '',
    institution: '',
    graduationYear: '',
    degreeNumber: '',
    issuedDate: '',
    classification: ''
  });

  const degrees: Degree[] = [
    {
      id: 'DEG001',
      employeeName: 'Nguyễn Văn A',
      employeeCode: 'NV001',
      degreeType: 'Đại học',
      major: 'Quản trị kinh doanh',
      institution: 'Đại học Kinh tế TP.HCM',
      graduationYear: '2018',
      degreeNumber: 'KT2018-12345',
      issuedDate: '2018-10-15',
      classification: 'Khá'
    },
    {
      id: 'DEG002',
      employeeName: 'Phạm Thị C',
      employeeCode: 'NV002',
      degreeType: 'Thạc sĩ',
      major: 'Kế toán - Kiểm toán',
      institution: 'Đại học Kinh tế Quốc dân',
      graduationYear: '2020',
      degreeNumber: 'KT2020-67890',
      issuedDate: '2020-11-20',
      classification: 'Giỏi'
    },
    {
      id: 'DEG003',
      employeeName: 'Lê Văn D',
      employeeCode: 'NV003',
      degreeType: 'Cao đẳng',
      major: 'Công nghệ ô tô',
      institution: 'Cao đẳng Giao thông Vận tải',
      graduationYear: '2019',
      degreeNumber: 'GT2019-11111',
      issuedDate: '2019-07-10',
      classification: 'Khá'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create degree:', formData);
    setIsCreateOpen(false);
    setFormData({
      employeeCode: '',
      degreeType: '',
      major: '',
      institution: '',
      graduationYear: '',
      degreeNumber: '',
      issuedDate: '',
      classification: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bằng cấp</h1>
          <p className="text-muted-foreground">Quản lý bằng cấp của nhân viên</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bằng cấp
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm bằng cấp mới</DialogTitle>
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
                  <Label>Loại bằng cấp</Label>
                  <Select value={formData.degreeType} onValueChange={(value) => setFormData({ ...formData, degreeType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại bằng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trung-cap">Trung cấp</SelectItem>
                      <SelectItem value="cao-dang">Cao đẳng</SelectItem>
                      <SelectItem value="dai-hoc">Đại học</SelectItem>
                      <SelectItem value="thac-si">Thạc sĩ</SelectItem>
                      <SelectItem value="tien-si">Tiến sĩ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chuyên ngành</Label>
                  <Input
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="Nhập chuyên ngành"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trường/Cơ sở đào tạo</Label>
                <Input
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Nhập tên trường"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Năm tốt nghiệp</Label>
                  <Input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    placeholder="YYYY"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Xếp loại</Label>
                  <Select value={formData.classification} onValueChange={(value) => setFormData({ ...formData, classification: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn xếp loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xuat-sac">Xuất sắc</SelectItem>
                      <SelectItem value="gioi">Giỏi</SelectItem>
                      <SelectItem value="kha">Khá</SelectItem>
                      <SelectItem value="trung-binh">Trung bình</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số văn bằng</Label>
                  <Input
                    value={formData.degreeNumber}
                    onChange={(e) => setFormData({ ...formData, degreeNumber: e.target.value })}
                    placeholder="Nhập số văn bằng"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ngày cấp</Label>
                  <Input
                    type="date"
                    value={formData.issuedDate}
                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                    required
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
              placeholder="Tìm kiếm bằng cấp..."
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
              <TableHead>Loại bằng</TableHead>
              <TableHead>Chuyên ngành</TableHead>
              <TableHead>Trường</TableHead>
              <TableHead>Năm TN</TableHead>
              <TableHead>Số văn bằng</TableHead>
              <TableHead>Xếp loại</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {degrees.map((degree) => (
              <TableRow key={degree.id}>
                <TableCell className="font-medium">{degree.employeeCode}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {degree.employeeName}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <GraduationCap className="w-3 h-3" />
                    {degree.degreeType}
                  </Badge>
                </TableCell>
                <TableCell>{degree.major}</TableCell>
                <TableCell>{degree.institution}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {degree.graduationYear}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {degree.degreeNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{degree.classification}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Degrees;
