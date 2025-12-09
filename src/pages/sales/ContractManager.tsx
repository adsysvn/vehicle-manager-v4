import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit, Trash2, FileText, Calendar, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportToExcel } from '@/lib/exportToExcel';

interface Contract {
  id: string;
  contract_number: string;
  title: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  customers: { name: string; contact_person: string; phone: string; email: string } | null;
}

interface Quotation {
  id: string;
  quotation_number: string;
  pickup_location: string;
  dropoff_location: string;
  cargo_type: string;
  weight: string;
  distance_km: number;
  unit_price: number;
  total_price: number;
  valid_until: string;
  status: string;
  created_at: string;
  customers: { name: string; contact_person: string } | null;
  routes: { name: string } | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Đang hiệu lực', color: 'bg-green-100 text-green-800' },
  pending: { label: 'Chờ ký kết', color: 'bg-yellow-100 text-yellow-800' },
  draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
  expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800' },
  approved: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-800' },
  terminated: { label: 'Đã thanh lý', color: 'bg-orange-100 text-orange-800' }
};

export default function ContractManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('contracts');
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  const [quoteFormData, setQuoteFormData] = useState({
    customer_id: '',
    route_id: '',
    pickup_location: '',
    dropoff_location: '',
    cargo_type: '',
    weight: '',
    distance_km: '',
    unit_price: '',
    total_price: '',
    valid_until: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, routesRes, quotationsRes, contractsRes] = await Promise.all([
        supabase.from('customers').select('id, name, contact_person').order('name'),
        supabase.from('routes').select('id, name, from_location, to_location, distance_km').eq('is_active', true).order('name'),
        supabase.from('quotations').select(`*, customers!quotations_customer_id_fkey (name, contact_person), routes!quotations_route_id_fkey (name)`).order('created_at', { ascending: false }),
        supabase.from('contracts').select(`*, customers!contracts_customer_id_fkey (name, contact_person, phone, email)`).order('created_at', { ascending: false })
      ]);

      if (customersRes.data) setCustomers(customersRes.data);
      if (routesRes.data) setRoutes(routesRes.data);
      if (quotationsRes.data) setQuotations(quotationsRes.data);
      if (contractsRes.data) setContracts(contractsRes.data);
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quotationNumber = `BG${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from('quotations')
        .insert({
          quotation_number: quotationNumber,
          customer_id: quoteFormData.customer_id,
          route_id: quoteFormData.route_id || null,
          pickup_location: quoteFormData.pickup_location,
          dropoff_location: quoteFormData.dropoff_location,
          cargo_type: quoteFormData.cargo_type || null,
          weight: quoteFormData.weight || null,
          distance_km: quoteFormData.distance_km ? parseFloat(quoteFormData.distance_km) : null,
          unit_price: parseFloat(quoteFormData.unit_price),
          total_price: parseFloat(quoteFormData.total_price),
          valid_until: quoteFormData.valid_until,
          notes: quoteFormData.notes || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({ title: 'Thành công', description: 'Đã tạo báo giá mới' });
      setIsQuoteDialogOpen(false);
      setQuoteFormData({ customer_id: '', route_id: '', pickup_location: '', dropoff_location: '', cargo_type: '', weight: '', distance_km: '', unit_price: '', total_price: '', valid_until: '', notes: '' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customers?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredQuotes = quotations.filter(quote => {
    const matchesSearch = 
      quote.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleExport = () => {
    if (activeTab === 'contracts') {
      const exportData = filteredContracts.map(c => ({
        'Mã HĐ': c.contract_number,
        'Tiêu đề': c.title,
        'Khách hàng': c.customers?.name || '',
        'Người liên hệ': c.customers?.contact_person || '',
        'Ngày bắt đầu': formatDate(c.start_date),
        'Ngày kết thúc': formatDate(c.end_date),
        'Giá trị': c.total_amount || 0,
        'Trạng thái': statusConfig[c.status]?.label || c.status
      }));
      exportToExcel(exportData, 'Contracts');
    } else {
      const exportData = filteredQuotes.map(q => ({
        'Mã BG': q.quotation_number,
        'Khách hàng': q.customers?.name || '',
        'Điểm đón': q.pickup_location,
        'Điểm đến': q.dropoff_location,
        'Đơn giá': q.unit_price,
        'Tổng giá': q.total_price,
        'Hiệu lực đến': formatDate(q.valid_until),
        'Trạng thái': statusConfig[q.status]?.label || q.status
      }));
      exportToExcel(exportData, 'Quotations');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Hợp đồng & Báo giá</h1>
          <p className="text-muted-foreground mt-2">Quản lý hợp đồng vận tải và báo giá cho khách hàng</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Tạo báo giá
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo báo giá mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Khách hàng *</Label>
                    <Select value={quoteFormData.customer_id} onValueChange={(v) => setQuoteFormData({...quoteFormData, customer_id: v})} required>
                      <SelectTrigger><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                      <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tuyến đường</Label>
                    <Select value={quoteFormData.route_id} onValueChange={(v) => {
                      const route = routes.find(r => r.id === v);
                      setQuoteFormData({
                        ...quoteFormData, 
                        route_id: v,
                        pickup_location: route?.from_location || '',
                        dropoff_location: route?.to_location || '',
                        distance_km: route?.distance_km?.toString() || ''
                      });
                    }}>
                      <SelectTrigger><SelectValue placeholder="Chọn tuyến đường" /></SelectTrigger>
                      <SelectContent>
                        {routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Điểm đón *</Label>
                    <Input value={quoteFormData.pickup_location} onChange={(e) => setQuoteFormData({...quoteFormData, pickup_location: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Điểm đến *</Label>
                    <Input value={quoteFormData.dropoff_location} onChange={(e) => setQuoteFormData({...quoteFormData, dropoff_location: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Đơn giá (VNĐ) *</Label>
                    <Input type="number" value={quoteFormData.unit_price} onChange={(e) => setQuoteFormData({...quoteFormData, unit_price: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tổng giá (VNĐ) *</Label>
                    <Input type="number" value={quoteFormData.total_price} onChange={(e) => setQuoteFormData({...quoteFormData, total_price: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Hiệu lực đến *</Label>
                    <Input type="date" value={quoteFormData.valid_until} onChange={(e) => setQuoteFormData({...quoteFormData, valid_until: e.target.value})} required />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>Hủy</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Tạo báo giá'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button className="bg-primary" onClick={() => navigate('/sales/contracts/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo hợp đồng mới
          </Button>
        </div>
      </div>

      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('contracts')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'contracts' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          Hợp đồng
        </button>
        <button onClick={() => setActiveTab('quotes')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'quotes' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          Báo giá
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Tìm kiếm theo mã, khách hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hiệu lực</SelectItem>
                <SelectItem value="pending">Chờ ký kết</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab === 'contracts' ? (
          <>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-primary">{contracts.length}</div><div className="text-sm text-muted-foreground">Tổng hợp đồng</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-green-600">{contracts.filter(c => c.status === 'active').length}</div><div className="text-sm text-muted-foreground">Đang hiệu lực</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-yellow-600">{contracts.filter(c => c.status === 'pending' || c.status === 'draft').length}</div><div className="text-sm text-muted-foreground">Chờ ký kết</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-primary">{formatCurrency(contracts.reduce((sum, c) => sum + (c.total_amount || 0), 0))}</div><div className="text-sm text-muted-foreground">Tổng giá trị</div></div></CardContent></Card>
          </>
        ) : (
          <>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-primary">{quotations.length}</div><div className="text-sm text-muted-foreground">Tổng báo giá</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-blue-600">{quotations.filter(q => q.status === 'approved').length}</div><div className="text-sm text-muted-foreground">Đã duyệt</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-yellow-600">{quotations.filter(q => q.status === 'pending').length}</div><div className="text-sm text-muted-foreground">Chờ duyệt</div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-primary">{formatCurrency(quotations.reduce((sum, q) => sum + q.total_price, 0))}</div><div className="text-sm text-muted-foreground">Tổng giá trị</div></div></CardContent></Card>
          </>
        )}
      </div>

      {activeTab === 'contracts' ? (
        <Card>
          <CardHeader><CardTitle>Danh sách hợp đồng ({filteredContracts.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hợp đồng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center">Đang tải...</TableCell></TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center">Không có hợp đồng nào</TableCell></TableRow>
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.contract_number}</TableCell>
                      <TableCell>
                        <div><div className="font-medium">{contract.customers?.name}</div><div className="text-sm text-muted-foreground">{contract.customers?.contact_person} - {contract.customers?.phone}</div></div>
                      </TableCell>
                      <TableCell>{contract.title}</TableCell>
                      <TableCell>
                        <div><div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{formatDate(contract.start_date)}</div><div className="text-sm text-muted-foreground">→ {formatDate(contract.end_date)}</div></div>
                      </TableCell>
                      <TableCell className="font-medium text-primary">{formatCurrency(contract.total_amount || 0)}</TableCell>
                      <TableCell><Badge className={statusConfig[contract.status]?.color || ''}>{statusConfig[contract.status]?.label || contract.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Danh sách báo giá ({filteredQuotes.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã báo giá</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Hành trình</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Tổng giá</TableHead>
                  <TableHead>Hiệu lực đến</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8} className="text-center">Đang tải...</TableCell></TableRow>
                ) : filteredQuotes.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center">Không có báo giá nào</TableCell></TableRow>
                ) : (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.quotation_number}</TableCell>
                      <TableCell>
                        <div><div className="font-medium">{quote.customers?.name}</div><div className="text-sm text-muted-foreground">{quote.customers?.contact_person}</div></div>
                      </TableCell>
                      <TableCell>{quote.pickup_location} → {quote.dropoff_location}</TableCell>
                      <TableCell>{formatCurrency(quote.unit_price)}</TableCell>
                      <TableCell className="font-medium text-primary">{formatCurrency(quote.total_price)}</TableCell>
                      <TableCell>{formatDate(quote.valid_until)}</TableCell>
                      <TableCell><Badge className={statusConfig[quote.status]?.color || ''}>{statusConfig[quote.status]?.label || quote.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                          <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
