import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  invoice_number: string;
  customer_name: string;
  company_name: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  booking_id: string | null;
}

export default function InvoiceManager() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(name, company_name),
          booking:bookings(booking_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: Invoice[] = (data || []).map(inv => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        customer_name: inv.customer?.name || 'N/A',
        company_name: inv.customer?.company_name || 'N/A',
        issue_date: inv.issue_date,
        due_date: inv.due_date,
        subtotal: inv.subtotal,
        tax_amount: inv.tax_amount,
        total_amount: inv.total_amount,
        payment_status: inv.payment_status,
        booking_id: inv.booking?.booking_number || null
      }));

      setInvoices(formattedData);
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

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/10 text-gray-500';
      case 'partial': return 'bg-blue-500/10 text-blue-500';
      case 'paid': return 'bg-green-500/10 text-green-500';
      case 'overdue': return 'bg-red-500/10 text-red-500';
      case 'cancelled': return 'bg-orange-500/10 text-orange-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'partial': return 'Thanh toán 1 phần';
      case 'paid': return 'Đã thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const totalRevenue = invoices.filter(i => i.payment_status === 'paid').reduce((sum, i) => sum + i.total_amount, 0);
  const pendingAmount = invoices.filter(i => i.payment_status === 'pending').reduce((sum, i) => sum + i.total_amount, 0);

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
              <p className="text-2xl font-bold text-red-500">{invoices.filter(i => i.payment_status === 'overdue').length}</p>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">Chưa có hóa đơn nào</TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell>{invoice.company_name}</TableCell>
                      <TableCell>{invoice.issue_date}</TableCell>
                      <TableCell>{invoice.due_date}</TableCell>
                      <TableCell>{invoice.subtotal.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell>{invoice.tax_amount.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell className="font-medium">{invoice.total_amount.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.payment_status)}>
                          {getStatusText(invoice.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                          {invoice.payment_status === 'pending' && (
                            <Button size="sm">
                              <Send className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
