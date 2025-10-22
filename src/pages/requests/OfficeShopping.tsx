import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

const OfficeShopping = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      requester: 'Nguyễn Văn A',
      department: 'Hành chính',
      items: [
        { name: 'Giấy A4', quantity: 10, unit: 'Ream', unitPrice: 80000 },
        { name: 'Bút bi', quantity: 50, unit: 'Cái', unitPrice: 3000 }
      ],
      totalAmount: 950000,
      status: 'approved',
      requestDate: '2025-10-20',
      purpose: 'Văn phòng phẩm tháng 10'
    },
    {
      id: 2,
      requester: 'Trần Thị B',
      department: 'Kế toán',
      items: [
        { name: 'Mực in', quantity: 5, unit: 'Hộp', unitPrice: 350000 },
        { name: 'Kẹp tài liệu', quantity: 20, unit: 'Cái', unitPrice: 15000 }
      ],
      totalAmount: 2050000,
      status: 'pending',
      requestDate: '2025-10-22',
      purpose: 'Mua sắm thiết bị văn phòng'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([{ name: '', quantity: 1, unit: '', unitPrice: 0 }]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, unit: '', unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mua sắm văn phòng phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý yêu cầu mua sắm văn phòng phẩm và thiết bị
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo yêu cầu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yêu cầu mua sắm văn phòng phẩm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Người yêu cầu</Label>
                  <Input placeholder="Tên người yêu cầu" />
                </div>
                <div className="space-y-2">
                  <Label>Phòng ban</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Hành chính</SelectItem>
                      <SelectItem value="sales">Kinh doanh</SelectItem>
                      <SelectItem value="accounting">Kế toán</SelectItem>
                      <SelectItem value="hrm">Nhân sự</SelectItem>
                      <SelectItem value="operations">Điều hành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mục đích mua sắm</Label>
                <Textarea placeholder="Mô tả mục đích và lý do mua sắm" rows={2} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Danh sách vật phẩm</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm vật phẩm
                  </Button>
                </div>

                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Vật phẩm {index + 1}</span>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Tên vật phẩm</Label>
                        <Input placeholder="Ví dụ: Giấy A4, Bút bi..." />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Đơn vị tính</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đơn vị" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="piece">Cái</SelectItem>
                            <SelectItem value="box">Hộp</SelectItem>
                            <SelectItem value="ream">Ream</SelectItem>
                            <SelectItem value="pack">Gói</SelectItem>
                            <SelectItem value="set">Bộ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Số lượng</Label>
                        <Input type="number" min="1" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Đơn giá (VND)</Label>
                        <Input type="number" min="0" placeholder="0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea placeholder="Thông tin bổ sung về yêu cầu" rows={2} />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setOpen(false)}>
                  Gửi yêu cầu
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã chi tiêu</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                requests
                  .filter(r => r.status === 'approved')
                  .reduce((sum, r) => sum + r.totalAmount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Tổng đã duyệt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">So với tháng trước</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+12%</div>
            <p className="text-xs text-muted-foreground">Tăng chi tiêu</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu mua sắm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người yêu cầu</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Số vật phẩm</TableHead>
                <TableHead>Tổng giá trị</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requester}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.items.length} vật phẩm</TableCell>
                  <TableCell>{formatCurrency(request.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Chi tiết</Button>
                      {request.status === 'pending' && (
                        <>
                          <Button variant="default" size="sm">Duyệt</Button>
                          <Button variant="destructive" size="sm">Từ chối</Button>
                        </>
                      )}
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

export default OfficeShopping;
