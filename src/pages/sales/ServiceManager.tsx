import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockServices = [
  { id: 1, name: 'Nước lọc', category: 'beverage', unit: 'Thùng', price: 50000 },
  { id: 2, name: 'Khăn nước', category: 'amenity', unit: 'Gói', price: 30000 },
  { id: 3, name: 'Bảo hiểm hành trình', category: 'insurance', unit: 'Chuyến', price: 100000 },
  { id: 4, name: 'Hướng dẫn viên', category: 'staff', unit: 'Người/ngày', price: 500000 }
];

const categories = [
  { value: 'beverage', label: 'Đồ uống' },
  { value: 'amenity', label: 'Tiện ích' },
  { value: 'insurance', label: 'Bảo hiểm' },
  { value: 'staff', label: 'Nhân sự' },
  { value: 'other', label: 'Khác' }
];

const ServiceManager = () => {
  const [services, setServices] = useState(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    price: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      id: services.length + 1,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      price: Number(formData.price)
    };
    setServices([...services, newService]);
    setIsDialogOpen(false);
    setFormData({ name: '', category: '', unit: '', price: '' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý dịch vụ</h1>
          <p className="text-muted-foreground mt-1">
            Thêm và quản lý các dịch vụ bổ sung cho booking
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin dịch vụ bổ sung
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên dịch vụ *</Label>
                <Input
                  id="name"
                  placeholder="VD: Nước lọc"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Phân loại *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phân loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Đơn vị tính *</Label>
                <Input
                  id="unit"
                  placeholder="VD: Thùng, Gói, Người/ngày"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Đơn giá (VNĐ) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Thêm dịch vụ</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Danh sách dịch vụ ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{getCategoryLabel(service.category)}</TableCell>
                  <TableCell>{service.unit}</TableCell>
                  <TableCell>{formatCurrency(service.price)}</TableCell>
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

export default ServiceManager;
