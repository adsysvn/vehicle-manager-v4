import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Phone, Mail, Calendar, MessageSquare, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Textarea } from '@/components/ui/textarea';

const customers = [
  {
    id: 'KH001',
    name: 'Công ty TNHH ABC',
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'contact@abc.com.vn',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    segment: 'Doanh nghiệp lớn',
    status: 'active',
    totalOrders: 125,
    totalValue: 2400000000,
    lastOrderDate: '2024-01-15',
    rating: 4.8,
    paymentTerm: '30 ngày',
    preferredRoutes: ['HCM - Hà Nội', 'HCM - Đà Nẵng']
  },
  {
    id: 'KH002',
    name: 'Công ty Cổ phần XYZ',
    contact: 'Trần Thị B',
    phone: '0987654321',
    email: 'sales@xyz.vn',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    segment: 'Doanh nghiệp vừa',
    status: 'potential',
    totalOrders: 48,
    totalValue: 850000000,
    lastOrderDate: '2024-01-12',
    rating: 4.5,
    paymentTerm: '15 ngày',
    preferredRoutes: ['Hải Phòng - HCM']
  },
  {
    id: 'KH003',
    name: 'Công ty TNHH DEF',
    contact: 'Lê Văn C',
    phone: '0912345678',
    email: 'logistics@def.com',
    address: '789 Đường DEF, Quận 7, TP.HCM',
    segment: 'Doanh nghiệp nhỏ',
    status: 'inactive',
    totalOrders: 15,
    totalValue: 320000000,
    lastOrderDate: '2023-12-20',
    rating: 4.2,
    paymentTerm: '7 ngày',
    preferredRoutes: ['Đà Nẵng - Nha Trang']
  }
];

const careHistory = [
  {
    id: 'CS001',
    customerId: 'KH001',
    customerName: 'Công ty TNHH ABC',
    contact: 'Nguyễn Văn A',
    type: 'Cuộc gọi',
    subject: 'Tư vấn dịch vụ vận tải mới',
    date: '2024-01-15',
    time: '14:30',
    duration: '25 phút',
    staff: 'Nguyễn Thị Sales',
    status: 'completed',
    note: 'Khách hàng quan tâm đến dịch vụ vận tải container. Hẹn gặp trực tiếp vào tuần sau.',
    priority: 'high',
    nextAction: 'Chuẩn bị báo giá chi tiết',
    nextActionDate: '2024-01-20'
  },
  {
    id: 'CS002',
    customerId: 'KH002',
    customerName: 'Công ty Cổ phần XYZ',
    contact: 'Trần Thị B',
    type: 'Email',
    subject: 'Theo dõi đơn hàng BK002',
    date: '2024-01-14',
    time: '10:15',
    duration: '-',
    staff: 'Lê Văn Support',
    status: 'completed',
    note: 'Gửi thông tin cập nhật tiến độ vận chuyển. Khách hàng hài lòng.',
    priority: 'medium',
    nextAction: 'Gọi điện xác nhận nhận hàng',
    nextActionDate: '2024-01-16'
  },
  {
    id: 'CS003',
    customerId: 'KH001',
    customerName: 'Công ty TNHH ABC',
    contact: 'Nguyễn Văn A',
    type: 'Gặp mặt',
    subject: 'Đàm phán hợp đồng 2024',
    date: '2024-01-10',
    time: '09:00',
    duration: '2 giờ',
    staff: 'Phạm Văn Manager',
    status: 'completed',
    note: 'Thảo luận điều khoản hợp đồng, giá cước. Khách hàng yêu cầu giảm giá 5%.',
    priority: 'high',
    nextAction: 'Báo cáo lên Ban giám đốc',
    nextActionDate: '2024-01-12'
  }
];

const upcomingTasks = [
  {
    id: 'T001',
    customerId: 'KH001',
    customerName: 'Công ty TNHH ABC',
    task: 'Gửi báo giá dịch vụ container',
    dueDate: '2024-01-20',
    priority: 'high',
    assignee: 'Nguyễn Thị Sales',
    status: 'pending'
  },
  {
    id: 'T002',
    customerId: 'KH002',
    customerName: 'Công ty Cổ phần XYZ',
    task: 'Gọi điện xác nhận nhận hàng',
    dueDate: '2024-01-16',
    priority: 'medium',
    assignee: 'Lê Văn Support',
    status: 'pending'
  },
  {
    id: 'T003',
    customerId: 'KH003',
    customerName: 'Công ty TNHH DEF',
    task: 'Liên hệ tái kích hoạt hợp tác',
    dueDate: '2024-01-25',
    priority: 'low',
    assignee: 'Trần Thị Care',
    status: 'pending'
  }
];

const statusConfig = {
  active: { label: 'Đang hợp tác', color: 'bg-green-100 text-green-800' },
  potential: { label: 'Tiềm năng', color: 'bg-blue-100 text-blue-800' },
  inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-800' },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'Cao', color: 'bg-red-100 text-red-800' },
  medium: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Thấp', color: 'bg-gray-100 text-gray-800' }
};

export default function CustomerCare() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [careNotes, setCareNotes] = useState<any[]>([]);

  const [noteFormData, setNoteFormData] = useState({
    customer_id: '',
    contact_type: 'Cuộc gọi',
    subject: '',
    note: '',
    next_action: '',
    next_action_date: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchCustomers();
    fetchCareNotes();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, name, contact_person, phone, email')
      .order('name');
    if (data) setDbCustomers(data);
  };

  const fetchCareNotes = async () => {
    const { data, error } = await supabase
      .from('customer_care_notes')
      .select(`
        *,
        customers!customer_care_notes_customer_id_fkey (name, contact_person)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải ghi chú chăm sóc',
        variant: 'destructive'
      });
      return;
    }
    setCareNotes(data || []);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('customer_care_notes')
        .insert({
          customer_id: noteFormData.customer_id,
          contact_type: noteFormData.contact_type,
          subject: noteFormData.subject,
          note: noteFormData.note,
          next_action: noteFormData.next_action || null,
          next_action_date: noteFormData.next_action_date || null,
          priority: noteFormData.priority,
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã thêm ghi chú chăm sóc khách hàng'
      });

      setIsNoteDialogOpen(false);
      setNoteFormData({
        customer_id: '',
        contact_type: 'Cuộc gọi',
        subject: '',
        note: '',
        next_action: '',
        next_action_date: '',
        priority: 'medium'
      });
      fetchCareNotes();
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

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredHistory = careHistory.filter(history => {
    const matchesSearch = 
      history.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.staff.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
          <h1 className="text-3xl font-bold text-foreground">Chăm sóc Khách hàng</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin và lịch sử chăm sóc khách hàng
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Cuộc gọi mới
          </Button>
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Thêm ghi chú
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm ghi chú chăm sóc khách hàng</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">Khách hàng *</Label>
                    <Select value={noteFormData.customer_id} onValueChange={(value) => setNoteFormData({...noteFormData, customer_id: value})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khách hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {dbCustomers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_type">Loại liên hệ *</Label>
                    <Select value={noteFormData.contact_type} onValueChange={(value) => setNoteFormData({...noteFormData, contact_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cuộc gọi">Cuộc gọi</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Gặp mặt">Gặp mặt</SelectItem>
                        <SelectItem value="Tin nhắn">Tin nhắn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="subject">Tiêu đề *</Label>
                    <Input
                      id="subject"
                      value={noteFormData.subject}
                      onChange={(e) => setNoteFormData({...noteFormData, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="note">Nội dung ghi chú *</Label>
                    <Textarea
                      id="note"
                      value={noteFormData.note}
                      onChange={(e) => setNoteFormData({...noteFormData, note: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Độ ưu tiên</Label>
                    <Select value={noteFormData.priority} onValueChange={(value) => setNoteFormData({...noteFormData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_action_date">Ngày hành động tiếp theo</Label>
                    <Input
                      id="next_action_date"
                      type="date"
                      value={noteFormData.next_action_date}
                      onChange={(e) => setNoteFormData({...noteFormData, next_action_date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="next_action">Hành động tiếp theo</Label>
                    <Textarea
                      id="next_action"
                      value={noteFormData.next_action}
                      onChange={(e) => setNoteFormData({...noteFormData, next_action: e.target.value})}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang lưu...' : 'Lưu ghi chú'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'customers'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Khách hàng
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Lịch sử chăm sóc
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Công việc
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
                  placeholder="Tìm kiếm khách hàng, người liên hệ, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {activeTab === 'customers' && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Đang hợp tác</SelectItem>
                    <SelectItem value="potential">Tiềm năng</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{customers.length}</div>
              <div className="text-sm text-muted-foreground">Tổng khách hàng</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang hợp tác</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.status === 'potential').length}
              </div>
              <div className="text-sm text-muted-foreground">Tiềm năng</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalValue, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Tổng giá trị</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Phân khúc</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Hiệu suất</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.segment}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.contact}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.totalOrders} đơn hàng</div>
                        <div className="text-sm text-success">
                          {formatCurrency(customer.totalValue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Lần cuối: {formatDate(customer.lastOrderDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{customer.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[customer.status as keyof typeof statusConfig].color}>
                        {statusConfig[customer.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
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

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử chăm sóc khách hàng ({filteredHistory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHistory.map((history) => (
                <div key={history.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        history.type === 'Cuộc gọi' ? 'bg-blue-500' :
                        history.type === 'Email' ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{history.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {history.customerName} - {history.contact}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusConfig[history.priority as keyof typeof statusConfig].color}>
                        {statusConfig[history.priority as keyof typeof statusConfig].label}
                      </Badge>
                      <Badge className={statusConfig[history.status as keyof typeof statusConfig].color}>
                        {statusConfig[history.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Loại:</span>
                      <span className="ml-2 font-medium">{history.type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Thời gian:</span>
                      <span className="ml-2 font-medium">
                        {formatDate(history.date)} - {history.time}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Nhân viên:</span>
                      <span className="ml-2 font-medium">{history.staff}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3 p-3 bg-muted/30 rounded">
                    {history.note}
                  </p>
                  
                  {history.nextAction && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Hành động tiếp theo: <span className="text-foreground">{history.nextAction}</span>
                      </span>
                      <div className="flex items-center space-x-1 text-warning">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(history.nextActionDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <Card>
          <CardHeader>
            <CardTitle>Công việc cần làm ({upcomingTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{task.task}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.customerName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Hạn: {formatDate(task.dueDate)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phụ trách:</span>
                          <span className="ml-1 font-medium">{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusConfig[task.priority as keyof typeof statusConfig].color}>
                        Ưu tiên {statusConfig[task.priority as keyof typeof statusConfig].label.toLowerCase()}
                      </Badge>
                      <Badge className={statusConfig[task.status as keyof typeof statusConfig].color}>
                        {statusConfig[task.status as keyof typeof statusConfig].label}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Hoàn thành
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Note */}
      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm ghi chú nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.contact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Nhập ghi chú chăm sóc khách hàng..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Hủy</Button>
                <Button>Lưu ghi chú</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}