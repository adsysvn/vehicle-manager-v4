import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ShoppingCart, DollarSign, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  { id: 'TO001', booking: 'BK001', customer: 'Công ty ABC', quantity: 50, unitPrice: 30000, total: 1500000, status: 'completed' },
  { id: 'TO002', booking: 'BK003', customer: 'Công ty XYZ', quantity: 30, unitPrice: 30000, total: 900000, status: 'pending' },
  { id: 'TO003', booking: 'BK005', customer: 'Công ty DEF', quantity: 40, unitPrice: 30000, total: 1200000, status: 'confirmed' }
];

const TowelService = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    booking: '',
    customer: '',
    quantity: '',
    unitPrice: '30000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      id: `TO${String(orders.length + 1).padStart(3, '0')}`,
      booking: formData.booking,
      customer: formData.customer,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      total: Number(formData.quantity) * Number(formData.unitPrice),
      status: 'pending'
    };
    setOrders([...orders, newOrder]);
    setIsDialogOpen(false);
    setFormData({ booking: '', customer: '', quantity: '', unitPrice: '30000' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dịch vụ khăn nước</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý dịch vụ cung cấp khăn nước cho khách hàng
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm đơn hàng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm đơn hàng khăn nước</DialogTitle>
              <DialogDescription>
                Nhập số lượng và đơn giá cho booking
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="booking">Mã booking *</Label>
                <Input
                  id="booking"
                  placeholder="BK001"
                  value={formData.booking}
                  onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Khách hàng *</Label>
                <Input
                  id="customer"
                  placeholder="Tên khách hàng"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Số lượng (gói) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="50"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Đơn giá (VNĐ/gói) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="30000"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tổng cộng:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency((Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm đơn hàng</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Đơn hàng tháng này"
          value="45"
          change={{ value: "12%", type: "increase" }}
          icon={ShoppingCart}
          color="primary"
        />
        <StatCard
          title="Doanh thu"
          value="15.5M"
          change={{ value: "8%", type: "increase" }}
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Khách hàng"
          value="23"
          change={{ value: "5%", type: "increase" }}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Đơn chờ xử lý"
          value="8"
          change={{ value: "2", type: "decrease" }}
          icon={Clock}
          color="warning"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng khăn nước ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.booking}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.quantity} gói</TableCell>
                  <TableCell>{formatCurrency(order.unitPrice)}</TableCell>
                  <TableCell className="font-medium text-success">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                      {statusConfig[order.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default TowelService;
