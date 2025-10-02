import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Search, DollarSign, TrendingUp, Users } from 'lucide-react';

interface Payroll {
  id: string;
  employeeName: string;
  role: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid';
  workDays: number;
}

const mockPayrolls: Payroll[] = [
  { id: 'PAY001', employeeName: 'Nguyễn Văn A', role: 'Lái xe', month: '2024-01', baseSalary: 12000000, bonus: 2000000, deductions: 1000000, netSalary: 13000000, status: 'paid', workDays: 26 },
  { id: 'PAY002', employeeName: 'Trần Văn B', role: 'Lái xe', month: '2024-01', baseSalary: 12000000, bonus: 1500000, deductions: 800000, netSalary: 12700000, status: 'paid', workDays: 25 },
  { id: 'PAY003', employeeName: 'Lê Thị C', role: 'Lái xe', month: '2024-01', baseSalary: 15000000, bonus: 3000000, deductions: 1200000, netSalary: 16800000, status: 'approved', workDays: 26 },
  { id: 'PAY004', employeeName: 'Phạm Văn D', role: 'Nhân viên', month: '2024-01', baseSalary: 10000000, bonus: 1000000, deductions: 500000, netSalary: 10500000, status: 'pending', workDays: 26 },
];

export default function PayrollManager() {
  const [payrolls] = useState<Payroll[]>(mockPayrolls);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayrolls = payrolls.filter(payroll =>
    payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'approved': return 'bg-blue-500/10 text-blue-500';
      case 'paid': return 'bg-green-500/10 text-green-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'paid': return 'Đã thanh toán';
      default: return status;
    }
  };

  const totalPayroll = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const totalBonus = payrolls.reduce((sum, p) => sum + p.bonus, 0);
  const avgSalary = totalPayroll / payrolls.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tính lương & chi phí</h1>
          <p className="text-muted-foreground mt-1">Quản lý lương và chi phí nhân sự</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Calculator className="w-4 h-4 mr-2" />
              Tính lương tháng mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tính lương tháng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Chọn tháng</Label>
                <Input type="month" />
              </div>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">Hệ thống sẽ tự động:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Tính lương cơ bản theo ngày công</li>
                  <li>Cộng thưởng theo hiệu suất</li>
                  <li>Trừ các khoản khấu trừ</li>
                  <li>Tạo bảng lương cho tất cả nhân viên</li>
                </ul>
              </div>
              <Button className="w-full">Bắt đầu tính lương</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng chi lương</p>
              <p className="text-2xl font-bold text-foreground">{totalPayroll.toLocaleString('vi-VN')} đ</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng thưởng</p>
              <p className="text-2xl font-bold text-green-500">{totalBonus.toLocaleString('vi-VN')} đ</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lương TB</p>
              <p className="text-2xl font-bold text-foreground">{avgSalary.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nhân viên</p>
              <p className="text-2xl font-bold text-foreground">{payrolls.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="2024-01">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">Tháng 1/2024</SelectItem>
                <SelectItem value="2023-12">Tháng 12/2023</SelectItem>
                <SelectItem value="2023-11">Tháng 11/2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Tháng</TableHead>
                  <TableHead>Ngày công</TableHead>
                  <TableHead>Lương CB</TableHead>
                  <TableHead>Thưởng</TableHead>
                  <TableHead>Khấu trừ</TableHead>
                  <TableHead>Thực nhận</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">{payroll.id}</TableCell>
                    <TableCell>{payroll.employeeName}</TableCell>
                    <TableCell>{payroll.role}</TableCell>
                    <TableCell>{payroll.month}</TableCell>
                    <TableCell>{payroll.workDays}</TableCell>
                    <TableCell>{payroll.baseSalary.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="text-green-600">+{payroll.bonus.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="text-red-600">-{payroll.deductions.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="font-medium">{payroll.netSalary.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payroll.status)}>
                        {getStatusText(payroll.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Chi tiết</Button>
                        {payroll.status === 'approved' && (
                          <Button size="sm">Thanh toán</Button>
                        )}
                      </div>
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
