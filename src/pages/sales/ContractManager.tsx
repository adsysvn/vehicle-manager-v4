import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
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

const contracts = [
  {
    id: 'HĐ001',
    customer: 'Công ty TNHH ABC',
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'contact@abc.com.vn',
    type: 'Hợp đồng dài hạn',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    value: 2400000000,
    status: 'active',
    services: ['Vận chuyển hàng hóa', 'Kho bãi'],
    routes: ['HCM - Hà Nội', 'HCM - Đà Nẵng'],
    frequency: 'Hàng tuần'
  },
  {
    id: 'HĐ002',
    customer: 'Công ty Cổ phần XYZ',
    contact: 'Trần Thị B',
    phone: '0987654321',
    email: 'sales@xyz.vn',
    type: 'Hợp đồng ngắn hạn',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    value: 850000000,
    status: 'pending',
    services: ['Vận chuyển container'],
    routes: ['Hải Phòng - HCM'],
    frequency: 'Hàng tháng'
  },
  {
    id: 'HĐ003',
    customer: 'Công ty TNHH DEF',
    contact: 'Lê Văn C',
    phone: '0912345678',
    email: 'logistics@def.com',
    type: 'Hợp đồng khung',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    value: 1200000000,
    status: 'draft',
    services: ['Vận chuyển hàng khô', 'Bảo hiểm hàng hóa'],
    routes: ['Đà Nẵng - Nha Trang', 'Quy Nhon - HCM'],
    frequency: 'Theo yêu cầu'
  }
];

const quotes = [
  {
    id: 'BG001',
    customer: 'Công ty GHI',
    contact: 'Phạm Văn D',
    route: 'HCM → Cần Thơ',
    cargoType: 'Hàng điện tử',
    weight: '5 tấn',
    distance: '160km',
    unitPrice: 15000,
    totalPrice: 2400000,
    validUntil: '2024-01-25',
    status: 'pending',
    createdDate: '2024-01-10'
  },
  {
    id: 'BG002',
    customer: 'Công ty JKL',
    contact: 'Võ Thị E',
    route: 'Hà Nội → Hải Phòng',
    cargoType: 'Vật liệu xây dựng',
    weight: '15 tấn',
    distance: '120km',
    unitPrice: 12000,
    totalPrice: 1800000,
    validUntil: '2024-01-20',
    status: 'approved',
    createdDate: '2024-01-08'
  }
];

const statusConfig = {
  active: { label: 'Đang hiệu lực', color: 'bg-green-100 text-green-800' },
  pending: { label: 'Chờ ký kết', color: 'bg-yellow-100 text-yellow-800' },
  draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
  expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800' },
  approved: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-800' }
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
  const [quotations, setQuotations] = useState<any[]>([]);

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
    fetchCustomers();
    fetchRoutes();
    fetchQuotations();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, name, contact_person')
      .order('name');
    if (data) setCustomers(data);
  };

  const fetchRoutes = async () => {
    const { data } = await supabase
      .from('routes')
      .select('id, name, from_location, to_location, distance_km')
      .eq('is_active', true)
      .order('name');
    if (data) setRoutes(data);
  };

  const fetchQuotations = async () => {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        customers!quotations_customer_id_fkey (name, contact_person),
        routes!quotations_route_id_fkey (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách báo giá',
        variant: 'destructive'
      });
      return;
    }
    setQuotations(data || []);
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

      toast({
        title: 'Thành công',
        description: 'Đã tạo báo giá mới'
      });

      setIsQuoteDialogOpen(false);
      setQuoteFormData({
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
      fetchQuotations();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredQuotes = quotations.filter(quote => {
    const matchesSearch = 
      quote.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.customers as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Hợp đồng & Báo giá</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý hợp đồng vận tải và báo giá cho khách hàng
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Tạo báo giá
          </Button>
          <Button className="bg-primary" onClick={() => navigate('/sales/contracts/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo hợp đồng mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'contracts'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Hợp đồng
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'quotes'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Báo giá
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã, khách hàng, người liên hệ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hiệu lực</SelectItem>
                  <SelectItem value="pending">Chờ ký kết</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="expired">Hết hạn</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab === 'contracts' ? (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{contracts.length}</div>
                  <div className="text-sm text-muted-foreground">Tổng hợp đồng</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {contracts.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đang hiệu lực</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {contracts.filter(c => c.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Chờ ký kết</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {formatCurrency(contracts.reduce((sum, c) => sum + c.value, 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">Tổng giá trị</div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{quotations.length}</div>
              <div className="text-sm text-muted-foreground">Tổng báo giá</div>
            </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {quotations.filter(q => q.status === 'approved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Đã duyệt</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {quotations.filter(q => q.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Chờ duyệt</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {formatCurrency(quotations.reduce((sum, q) => sum + q.total_price, 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">Tổng giá trị</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      {activeTab === 'contracts' ? (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách hợp đồng ({filteredContracts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hợp đồng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại hợp đồng</TableHead>
                  <TableHead>Thời hạn</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{contract.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contract.customer}</div>
                        <div className="text-sm text-muted-foreground">
                          {contract.contact} - {contract.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(contract.startDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          → {formatDate(contract.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-success">
                      {formatCurrency(contract.value)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[contract.status as keyof typeof statusConfig].color}>
                        {statusConfig[contract.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo giá ({filteredQuotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã báo giá</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tuyến đường</TableHead>
                  <TableHead>Hàng hóa</TableHead>
                  <TableHead>Giá cước</TableHead>
                  <TableHead>Hiệu lực đến</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{quote.quotation_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{(quote.customers as any)?.name}</div>
                        <div className="text-sm text-muted-foreground">{(quote.customers as any)?.contact_person}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{(quote.routes as any)?.name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{quote.distance_km ? `${quote.distance_km}km` : ''}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quote.cargo_type || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{quote.weight || ''}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-success">
                          {formatCurrency(quote.totalPrice)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.unitPrice.toLocaleString('vi-VN')} VNĐ/km
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(quote.validUntil)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[quote.status as keyof typeof statusConfig].color}>
                        {statusConfig[quote.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}