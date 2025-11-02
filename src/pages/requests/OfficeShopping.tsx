import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OfficeShopping = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    purpose: '',
    notes: ''
  });
  const [items, setItems] = useState([{ item_name: '', quantity: 1, unit: '', unit_price: 0 }]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_requests')
        .select(`
          *,
          profile:profiles!shopping_requests_profile_id_fkey(full_name, email),
          department:departments(name),
          items:shopping_request_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Chưa đăng nhập');

      const { data: profile } = await supabase
        .from('profiles')
        .select('department_id')
        .eq('id', user.id)
        .single();

      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

      const { data: request, error: requestError } = await supabase
        .from('shopping_requests')
        .insert([{
          profile_id: user.id,
          department_id: profile?.department_id || null,
          purpose: formData.purpose,
          total_amount: totalAmount,
          notes: formData.notes
        }])
        .select()
        .single();

      if (requestError) throw requestError;

      const itemsToInsert = items.map(item => ({
        request_id: request.id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('shopping_request_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: 'Thành công',
        description: 'Đã tạo yêu cầu mua sắm'
      });
      
      setOpen(false);
      fetchRequests();
      setFormData({ purpose: '', notes: '' });
      setItems([{ item_name: '', quantity: 1, unit: '', unit_price: 0 }]);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('shopping_requests')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã duyệt yêu cầu'
      });
      fetchRequests();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('shopping_requests')
        .update({
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã từ chối yêu cầu'
      });
      fetchRequests();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

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
    setItems([...items, { item_name: '', quantity: 1, unit: '', unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
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
              <div className="space-y-2">
                <Label>Mục đích mua sắm</Label>
                <Textarea 
                  placeholder="Mô tả mục đích và lý do mua sắm" 
                  rows={2} 
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                />
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
                        <Input 
                          placeholder="Ví dụ: Giấy A4, Bút bi..." 
                          value={item.item_name}
                          onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Đơn vị tính</Label>
                        <Select value={item.unit} onValueChange={(v) => updateItem(index, 'unit', v)}>
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
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="0" 
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Đơn giá (VND)</Label>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Thành tiền: {formatCurrency(item.quantity * item.unit_price)}
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Tổng giá trị:</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea 
                  placeholder="Thông tin bổ sung về yêu cầu" 
                  rows={2} 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSubmit}>
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
                  .reduce((sum, r) => sum + Number(r.total_amount), 0)
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Chưa có yêu cầu mua sắm nào</TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.profile?.full_name}</TableCell>
                    <TableCell>{request.department?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{request.items?.length || 0} vật phẩm</TableCell>
                    <TableCell>{formatCurrency(Number(request.total_amount))}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Chi tiết</Button>
                        {request.status === 'pending' && (
                          <>
                            <Button variant="default" size="sm" onClick={() => handleApprove(request.id)}>Duyệt</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(request.id)}>Từ chối</Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficeShopping;