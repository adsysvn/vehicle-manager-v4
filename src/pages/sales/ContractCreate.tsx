import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContractCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractNumber: '',
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    startDate: '',
    endDate: '',
    contractType: '',
    value: '',
    terms: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contract data:', formData);
    // Handle contract creation
    navigate('/sales/contracts');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/sales/contracts')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tạo hợp đồng mới</h1>
            <p className="text-muted-foreground mt-1">
              Nhập thông tin chi tiết hợp đồng
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hợp đồng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">Số hợp đồng *</Label>
                <Input
                  id="contractNumber"
                  placeholder="HĐ-2024-001"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractType">Loại hợp đồng *</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => setFormData({ ...formData, contractType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hợp đồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transport">Vận chuyển</SelectItem>
                    <SelectItem value="lease">Cho thuê xe</SelectItem>
                    <SelectItem value="service">Dịch vụ</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Tên khách hàng *</Label>
                <Input
                  id="customerName"
                  placeholder="Công ty TNHH ABC"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Người liên hệ</Label>
                <Input
                  id="contactPerson"
                  placeholder="Nguyễn Văn A"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Giá trị hợp đồng (VNĐ) *</Label>
              <Input
                id="value"
                type="number"
                placeholder="50000000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Điều khoản hợp đồng</Label>
              <Textarea
                id="terms"
                placeholder="Nhập các điều khoản và điều kiện của hợp đồng..."
                rows={6}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/sales/contracts')}>
                Hủy
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Lưu hợp đồng
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ContractCreate;
