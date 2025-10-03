import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Receipt, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Expense {
  id: string;
  bookingId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  vehicleType: string;
  route: string;
  receiptUrl?: string;
}

const mockExpenses: Expense[] = [
  {
    id: 'EXP001',
    bookingId: 'BOOK001',
    category: 'Phí đỗ xe',
    description: 'Phí đỗ xe tại bãi đỗ sân bay Nội Bài',
    amount: 50000,
    date: '2024-03-15',
    approvedBy: 'Nguyễn Văn A',
    status: 'approved',
    vehicleType: '7 chỗ',
    route: 'Hà Nội - Hải Phòng'
  },
  {
    id: 'EXP002',
    bookingId: 'BOOK002',
    category: 'Cầu phà',
    description: 'Phí qua cầu Thanh Trì',
    amount: 30000,
    date: '2024-03-15',
    status: 'pending',
    vehicleType: '16 chỗ',
    route: 'Hà Nội - Quảng Ninh'
  },
  {
    id: 'EXP003',
    bookingId: 'BOOK003',
    category: 'Chi phí phát sinh',
    description: 'Sửa lốp xe giữa đường',
    amount: 200000,
    date: '2024-03-16',
    approvedBy: 'Trần Thị B',
    status: 'approved',
    vehicleType: '4 chỗ',
    route: 'Hà Nội - Hạ Long'
  }
];

const expenseCategories = [
  'Phí đỗ xe',
  'Cầu phà',
  'Vệ sinh xe',
  'Sửa chữa khẩn cấp',
  'Chi phí ăn uống',
  'Chi phí lưu trú',
  'Phí cao tốc',
  'Chi phí phát sinh khác'
];

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);

  const handleApprove = (id: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: 'approved' as const, approvedBy: 'Admin' } : exp
    ));
  };

  const handleReject = (id: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: 'rejected' as const } : exp
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Chi phí phát sinh</h1>
          <p className="text-muted-foreground mt-1">Theo dõi và phê duyệt các chi phí phát sinh trong hành trình</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm chi phí
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm chi phí phát sinh</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Mã Booking</Label>
                  <Input id="bookingId" placeholder="BOOK001" required />
                </div>
                <div className="space-y-2">
                  <Label>Loại chi phí</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền (VNĐ)</Label>
                  <Input id="amount" type="number" placeholder="50000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày phát sinh</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Mô tả chi tiết về chi phí phát sinh..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="receipt">Hóa đơn / Chứng từ</Label>
                  <Input id="receipt" type="file" accept="image/*,application/pdf" />
                  <p className="text-xs text-muted-foreground">Tải lên hình ảnh hoặc PDF hóa đơn</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu chi phí</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Receipt className="w-4 h-4 mr-2" />
              Tổng chi phí
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} chi phí</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
              Đã duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(approvedExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.filter(e => e.status === 'approved').length} chi phí
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
              Chờ duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.filter(e => e.status === 'pending').length} chi phí
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Chi phí TB/chuyến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalExpenses / expenses.length || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chi phí phát sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Loại chi phí</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người duyệt</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{expense.bookingId}</p>
                      <p className="text-xs text-muted-foreground">{expense.vehicleType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        expense.status === 'approved' ? 'default' : 
                        expense.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {expense.status === 'approved' ? 'Đã duyệt' :
                       expense.status === 'pending' ? 'Chờ duyệt' :
                       'Từ chối'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.approvedBy || '-'}
                  </TableCell>
                  <TableCell>
                    {expense.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprove(expense.id)}
                        >
                          Duyệt
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(expense.id)}
                        >
                          Từ chối
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm">Chi tiết</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
