import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CreditCard, Search, Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface Debt {
  id: string;
  customerName: string;
  company: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'overdue' | 'due-soon' | 'paid' | 'partial';
  invoices: string[];
}

const mockDebts: Debt[] = [
  { id: 'DEBT001', customerName: 'Nguyễn Văn A', company: 'Công ty ABC', totalAmount: 50000000, paidAmount: 20000000, remainingAmount: 30000000, dueDate: '2024-01-10', status: 'overdue', invoices: ['INV001', 'INV002'] },
  { id: 'DEBT002', customerName: 'Trần Văn B', company: 'Công ty XYZ', totalAmount: 35000000, paidAmount: 35000000, remainingAmount: 0, dueDate: '2024-01-15', status: 'paid', invoices: ['INV003'] },
  { id: 'DEBT003', customerName: 'Lê Thị C', company: 'Công ty 123', totalAmount: 45000000, paidAmount: 15000000, remainingAmount: 30000000, dueDate: '2024-01-20', status: 'due-soon', invoices: ['INV004', 'INV005'] },
  { id: 'DEBT004', customerName: 'Phạm Văn D', company: 'Công ty DEF', totalAmount: 60000000, paidAmount: 30000000, remainingAmount: 30000000, dueDate: '2024-01-25', status: 'partial', invoices: ['INV006'] },
];

export default function DebtManagement() {
  const [debts] = useState<Debt[]>(mockDebts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebts = debts.filter(debt =>
    debt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-500/10 text-red-500';
      case 'due-soon': return 'bg-yellow-500/10 text-yellow-500';
      case 'paid': return 'bg-green-500/10 text-green-500';
      case 'partial': return 'bg-blue-500/10 text-blue-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue': return 'Quá hạn';
      case 'due-soon': return 'Sắp đến hạn';
      case 'paid': return 'Đã thanh toán';
      case 'partial': return 'Trả một phần';
      default: return status;
    }
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalOverdue = debts.filter(d => d.status === 'overdue').reduce((sum, d) => sum + d.remainingAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Công nợ khách hàng</h1>
          <p className="text-muted-foreground mt-1">Quản lý công nợ và thanh toán</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ghi nhận thanh toán
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ghi nhận thanh toán</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Mã công nợ</Label>
                <Input placeholder="DEBT001" />
              </div>
              <div className="space-y-2">
                <Label>Số tiền thanh toán (VNĐ)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Ngày thanh toán</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Input placeholder="Nhập ghi chú (nếu có)" />
              </div>
              <Button className="w-full">Xác nhận thanh toán</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng công nợ</p>
              <p className="text-2xl font-bold text-foreground">{totalDebt.toLocaleString('vi-VN')} đ</p>
            </div>
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quá hạn</p>
              <p className="text-2xl font-bold text-red-500">{totalOverdue.toLocaleString('vi-VN')} đ</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sắp đến hạn</p>
              <p className="text-2xl font-bold text-yellow-500">{debts.filter(d => d.status === 'due-soon').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã thanh toán</p>
              <p className="text-2xl font-bold text-green-500">{debts.filter(d => d.status === 'paid').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo khách hàng, công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã CN</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Công ty</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Đã trả</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead>Hạn thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.id}</TableCell>
                    <TableCell>{debt.customerName}</TableCell>
                    <TableCell>{debt.company}</TableCell>
                    <TableCell className="font-medium">{debt.totalAmount.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="text-green-600">{debt.paidAmount.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="font-medium text-red-600">{debt.remainingAmount.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>{debt.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(debt.status)}>
                        {getStatusText(debt.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Chi tiết</Button>
                        {debt.remainingAmount > 0 && (
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
