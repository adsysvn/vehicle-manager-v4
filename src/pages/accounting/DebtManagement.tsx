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
import { CreditCard, Search, Plus, AlertTriangle, Clock, CheckCircle, Download } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

interface CustomerDebt {
  customer_id: string;
  customer_name: string;
  company_name: string | null;
  total_invoiced: number;
  total_paid: number;
  remaining: number;
  latest_due_date: string | null;
  status: 'paid' | 'partial' | 'overdue' | 'due-soon';
}

export default function DebtManagement() {
  const { toast } = useToast();
  const [debts, setDebts] = useState<CustomerDebt[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDebts();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('id, name, company_name');
    if (data) setCustomers(data);
  };

  const fetchDebts = async () => {
    try {
      // Get all invoices with customer info
      const { data: invoices, error: invError } = await supabase
        .from('invoices')
        .select(`
          customer_id,
          total_amount,
          paid_amount,
          due_date,
          payment_status,
          customer:customers(name, company_name)
        `);

      if (invError) throw invError;

      // Group by customer
      const customerDebts: { [key: string]: CustomerDebt } = {};
      
      (invoices || []).forEach(inv => {
        const customerId = inv.customer_id;
        if (!customerDebts[customerId]) {
          customerDebts[customerId] = {
            customer_id: customerId,
            customer_name: inv.customer?.name || 'N/A',
            company_name: inv.customer?.company_name,
            total_invoiced: 0,
            total_paid: 0,
            remaining: 0,
            latest_due_date: null,
            status: 'paid'
          };
        }
        
        customerDebts[customerId].total_invoiced += inv.total_amount || 0;
        customerDebts[customerId].total_paid += inv.paid_amount || 0;
        
        if (inv.due_date && (!customerDebts[customerId].latest_due_date || inv.due_date > customerDebts[customerId].latest_due_date)) {
          customerDebts[customerId].latest_due_date = inv.due_date;
        }
      });

      // Calculate remaining and status
      const today = new Date();
      Object.values(customerDebts).forEach(debt => {
        debt.remaining = debt.total_invoiced - debt.total_paid;
        
        if (debt.remaining <= 0) {
          debt.status = 'paid';
        } else if (debt.latest_due_date) {
          const dueDate = new Date(debt.latest_due_date);
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays < 0) {
            debt.status = 'overdue';
          } else if (diffDays <= 7) {
            debt.status = 'due-soon';
          } else {
            debt.status = 'partial';
          }
        } else {
          debt.status = 'partial';
        }
      });

      setDebts(Object.values(customerDebts).filter(d => d.total_invoiced > 0));
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedCustomer || !paymentAmount) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('payment_records').insert({
        customer_id: selectedCustomer,
        amount: parseFloat(paymentAmount),
        payment_date: paymentDate,
        payment_method: paymentMethod,
        reference_number: referenceNumber || null,
        notes: notes || null
      });

      if (error) throw error;

      // Update invoice paid amounts
      const { data: invoices } = await supabase
        .from('invoices')
        .select('id, total_amount, paid_amount')
        .eq('customer_id', selectedCustomer)
        .neq('payment_status', 'paid')
        .order('due_date', { ascending: true });

      let remainingPayment = parseFloat(paymentAmount);
      
      for (const inv of invoices || []) {
        if (remainingPayment <= 0) break;
        
        const owed = inv.total_amount - (inv.paid_amount || 0);
        const toApply = Math.min(remainingPayment, owed);
        
        const newPaidAmount = (inv.paid_amount || 0) + toApply;
        const newStatus = newPaidAmount >= inv.total_amount ? 'paid' : 'partial';
        
        await supabase.from('invoices').update({
          paid_amount: newPaidAmount,
          payment_status: newStatus
        }).eq('id', inv.id);
        
        remainingPayment -= toApply;
      }

      toast({ title: 'Thành công', description: 'Đã ghi nhận thanh toán' });
      setIsDialogOpen(false);
      setSelectedCustomer('');
      setPaymentAmount('');
      setReferenceNumber('');
      setNotes('');
      fetchDebts();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const filteredDebts = debts.filter(debt =>
    debt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (debt.company_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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

  const totalDebt = debts.reduce((sum, d) => sum + d.remaining, 0);
  const totalOverdue = debts.filter(d => d.status === 'overdue').reduce((sum, d) => sum + d.remaining, 0);

  const handleExport = () => {
    const exportData = filteredDebts.map(d => ({
      'Khách hàng': d.customer_name,
      'Công ty': d.company_name || '',
      'Tổng tiền': d.total_invoiced,
      'Đã trả': d.total_paid,
      'Còn lại': d.remaining,
      'Hạn TT': d.latest_due_date || '',
      'Trạng thái': getStatusText(d.status)
    }));
    exportToExcel(exportData, 'cong-no-khach-hang');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Công nợ khách hàng</h1>
          <p className="text-muted-foreground mt-1">Quản lý công nợ và thanh toán</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <Label>Khách hàng</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.company_name ? `- ${c.company_name}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số tiền thanh toán (VNĐ)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày thanh toán</Label>
                  <Input 
                    type="date" 
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phương thức</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Chuyển khoản</SelectItem>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="card">Thẻ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số tham chiếu</Label>
                  <Input 
                    placeholder="Mã giao dịch (nếu có)" 
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Input 
                    placeholder="Nhập ghi chú (nếu có)" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleRecordPayment}>Xác nhận thanh toán</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
              <p className="text-sm text-muted-foreground">Đã thanh toán đủ</p>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : filteredDebts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Không có dữ liệu</TableCell>
                  </TableRow>
                ) : (
                  filteredDebts.map((debt) => (
                    <TableRow key={debt.customer_id}>
                      <TableCell className="font-medium">{debt.customer_name}</TableCell>
                      <TableCell>{debt.company_name || '-'}</TableCell>
                      <TableCell className="font-medium">{debt.total_invoiced.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell className="text-green-600">{debt.total_paid.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell className="font-medium text-red-600">{debt.remaining.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell>{debt.latest_due_date || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(debt.status)}>
                          {getStatusText(debt.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {debt.remaining > 0 && (
                            <Button size="sm" onClick={() => {
                              setSelectedCustomer(debt.customer_id);
                              setIsDialogOpen(true);
                            }}>
                              Thanh toán
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
