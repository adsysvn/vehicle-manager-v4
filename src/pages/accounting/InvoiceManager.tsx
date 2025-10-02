import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Plus, Download, Send } from 'lucide-react';

interface Invoice {
  id: string;
  customerName: string;
  company: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  bookingId: string;
}

const mockInvoices: Invoice[] = [
  { id: 'INV001', customerName: 'Nguyễn Văn A', company: 'Công ty ABC', issueDate: '2024-01-01', dueDate: '2024-01-15', amount: 20000000, tax: 2000000, totalAmount: 22000000, status: 'paid', bookingId: 'BK001' },
  { id: 'INV002', customerName: 'Trần Văn B', company: 'Công ty XYZ', issueDate: '2024-01-05', dueDate: '2024-01-20', amount: 35000000, tax: 3500000, totalAmount: 38500000, status: 'sent', bookingId: 'BK002' },
  { id: 'INV003', customerName: 'Lê Thị C', company: 'Công ty 123', issueDate: '2024-01-10', dueDate: '2024-01-25', amount: 15000000, tax: 1500000, totalAmount: 16500000, status: 'draft', bookingId: 'BK003' },
  { id: 'INV004', customerName: 'Phạm Văn D', company: 'Công ty DEF', issueDate: '2023-12-20', dueDate: '2024-01-05', amount: 25000000, tax: 2500000, totalAmount: 27500000, status: 'overdue', bookingId: 'BK004' },
];

export default function InvoiceManager() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/10 text-gray-500';
      case 'sent': return 'bg-blue-500/10 text-blue-500';
      case 'paid': return 'bg-green-500/10 text-green-500';
      case 'overdue': return 'bg-red-500/10 text-red-500';
      case 'cancelled': return 'bg-orange-500/10 text-orange-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Bản nháp';
      case 'sent': return 'Đã gửi';
      case 'paid': return 'Đã thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý hóa đơn</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý hóa đơn cho khách hàng</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo hóa đơn
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo hóa đơn mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Khách hàng</Label>
                  <Input placeholder="Tên khách hàng" />
                </div>
                <div className="space-y-2">
                  <Label>Công ty</Label>
                  <Input placeholder="Tên công ty" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Booking liên quan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn booking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">BK001 - Hà Nội - Hải Phòng</SelectItem>
                    <SelectItem value="2">BK002 - Hà Nội - Quảng Ninh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày phát hành</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Hạn thanh toán</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số tiền (VNĐ)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Thuế (%)</Label>
                  <Input type="number" placeholder="10" defaultValue="10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Lưu nháp</Button>
                <Button className="flex-1">Tạo và gửi</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng hóa đơn</p>
              <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Doanh thu</p>
              <p className="text-2xl font-bold text-green-500">{totalRevenue.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
              <p className="text-2xl font-bold text-blue-500">{pendingAmount.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quá hạn</p>
              <p className="text-2xl font-bold text-red-500">{invoices.filter(i => i.status === 'overdue').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã HĐ, khách hàng, công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã HĐ</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Công ty</TableHead>
                  <TableHead>Ngày phát hành</TableHead>
                  <TableHead>Hạn TT</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Thuế</TableHead>
                  <TableHead>Tổng cộng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.company}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>{invoice.tax.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell className="font-medium">{invoice.totalAmount.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusText(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button size="sm">
                            <Send className="w-3 h-3" />
                          </Button>
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
