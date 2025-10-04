import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, RefreshCw, Download, Eye, Settings, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Invoice {
  id: string;
  emailSubject: string;
  sender: string;
  receivedDate: string;
  invoiceNumber: string;
  amount: number;
  status: 'pending' | 'imported' | 'error';
  attachmentName: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    emailSubject: 'Hóa đơn VAT tháng 12/2024 - Công ty ABC',
    sender: 'kethoan@abc.com',
    receivedDate: '2024-12-20 10:30',
    invoiceNumber: 'HD20241220001',
    amount: 15000000,
    status: 'imported',
    attachmentName: 'hoadon_202412.pdf'
  },
  {
    id: '2',
    emailSubject: 'Invoice #INV-2024-456',
    sender: 'billing@xyz.com',
    receivedDate: '2024-12-19 14:20',
    invoiceNumber: 'INV-2024-456',
    amount: 8500000,
    status: 'pending',
    attachmentName: 'invoice_456.pdf'
  },
  {
    id: '3',
    emailSubject: 'Biên lai thanh toán dịch vụ',
    sender: 'finance@service.vn',
    receivedDate: '2024-12-18 09:15',
    invoiceNumber: '',
    amount: 0,
    status: 'error',
    attachmentName: 'receipt.pdf'
  }
];

export default function InvoiceEmailSync() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [emailConfig, setEmailConfig] = useState({
    email: '',
    password: '',
    server: 'imap.gmail.com',
    port: '993'
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const statusConfig = {
    pending: { label: 'Chờ nhập', color: 'secondary' },
    imported: { label: 'Đã nhập', color: 'default' },
    error: { label: 'Lỗi', color: 'destructive' }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Đồng bộ Hóa đơn từ Email</h1>
          <p className="text-muted-foreground mt-1">Tự động lấy và nhập hóa đơn từ email</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Cấu hình
          </Button>
          <Button onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Đồng bộ ngay
          </Button>
        </div>
      </div>

      {!isConfigured && (
        <Alert>
          <Mail className="w-4 h-4" />
          <AlertDescription>
            Vui lòng cấu hình email để bắt đầu đồng bộ hóa đơn tự động. Hệ thống sẽ quét email theo lịch trình đã đặt.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng hóa đơn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đã nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {invoices.filter(i => i.status === 'imported').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {invoices.filter(i => i.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {invoices.filter(i => i.status === 'error').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hóa đơn từ Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề email</TableHead>
                <TableHead>Người gửi</TableHead>
                <TableHead>Ngày nhận</TableHead>
                <TableHead>Số hóa đơn</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>File đính kèm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="max-w-xs">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{invoice.emailSubject}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{invoice.sender}</TableCell>
                  <TableCell className="text-sm">{invoice.receivedDate}</TableCell>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber || '-'}
                  </TableCell>
                  <TableCell>
                    {invoice.amount > 0 ? (
                      <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{invoice.attachmentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[invoice.status].color as any}>
                      {statusConfig[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {invoice.status === 'pending' && (
                        <Button size="sm">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Nhập
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cấu hình Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ketoan@company.com"
                value={emailConfig.email}
                onChange={(e) => setEmailConfig({...emailConfig, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu ứng dụng</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server">IMAP Server</Label>
              <Input 
                id="server" 
                placeholder="imap.gmail.com"
                value={emailConfig.server}
                onChange={(e) => setEmailConfig({...emailConfig, server: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input 
                id="port" 
                placeholder="993"
                value={emailConfig.port}
                onChange={(e) => setEmailConfig({...emailConfig, port: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <Button onClick={() => setIsConfigured(true)}>
                Lưu cấu hình
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}