import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Eye, Edit, Trash2, Calendar, X, User, Phone, Users, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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

interface RoutePoint {
  location: string;
  datetime: string;
}

interface Vehicle {
  type: string;
  licensePlate?: string;
  driver?: string;
}

const bookings = [
  {
    id: 'BK001',
    customer: 'Công ty TNHH ABC',
    customerType: 'corporate' as const,
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    companyCode: 'VN - Công ty TNHH ABC',
    groupCode: 'GRP2024001',
    numAdults: 25,
    numChildren: 5,
    reference: 'REF2024-ABC-001',
    visaType: 'Tourist',
    guestType: 'inbound',
    tourGuideName: 'Nguyễn Hướng Dẫn',
    tourGuidePhone: '0909123456',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    routePoints: [
      { location: 'HCM', datetime: '2024-01-15 08:00' },
      { location: 'Bình Dương', datetime: '2024-01-15 10:00' },
      { location: 'Hà Nội', datetime: '2024-01-15 18:00' }
    ],
    vehicles: [
      { type: '7 chỗ', licensePlate: '30A-123.45', driver: 'Trần Văn B' },
      { type: '7 chỗ', licensePlate: '30A-123.46', driver: 'Lê Văn C' }
    ],
    status: 'confirmed',
    value: 15000000,
    created: '2024-01-10'
  },
  {
    id: 'BK002',
    customer: 'Lê Thị C',
    customerType: 'individual' as const,
    contact: 'Lê Thị C',
    phone: '0987654321',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    routePoints: [
      { location: 'Đà Nẵng', datetime: '2024-01-16 14:30' },
      { location: 'HCM', datetime: '2024-01-16 20:00' }
    ],
    vehicles: [
      { type: '4 chỗ', licensePlate: 'Chưa phân', driver: 'Chưa phân' }
    ],
    status: 'pending',
    value: 8500000,
    created: '2024-01-11'
  },
  {
    id: 'BK003',
    customer: 'Công ty DEF',
    customerType: 'corporate' as const,
    contact: 'Phạm Văn D',
    phone: '0912345678',
    companyCode: 'VJ - Công ty DEF',
    groupCode: 'GRP2024002',
    numAdults: 15,
    numChildren: 0,
    reference: 'REF2024-DEF-002',
    visaType: 'Business',
    guestType: 'outbound',
    tourGuideName: 'Trần Minh',
    tourGuidePhone: '0908765432',
    startDate: '2024-01-17',
    endDate: '2024-01-19',
    routePoints: [
      { location: 'Hà Nội', datetime: '2024-01-17 10:00' },
      { location: 'Hải Phòng', datetime: '2024-01-17 12:30' }
    ],
    vehicles: [
      { type: '16 chỗ', licensePlate: '51B-678.90', driver: 'Hoàng Văn E' }
    ],
    status: 'in_progress',
    value: 5200000,
    created: '2024-01-12'
  },
  {
    id: 'BK004',
    customer: 'Công ty GHI',
    customerType: 'corporate' as const,
    contact: 'Võ Thị F',
    phone: '0923456789',
    companyCode: 'QH - Công ty GHI',
    groupCode: 'GRP2024003',
    numAdults: 10,
    numChildren: 2,
    reference: 'REF2024-GHI-003',
    visaType: 'Transit',
    guestType: 'inbound',
    tourGuideName: 'Lê Thanh',
    tourGuidePhone: '0907654321',
    startDate: '2024-01-14',
    endDate: '2024-01-14',
    routePoints: [
      { location: 'Cần Thơ', datetime: '2024-01-14 16:00' },
      { location: 'HCM', datetime: '2024-01-14 19:00' }
    ],
    vehicles: [
      { type: '7 chỗ', licensePlate: '92C-111.22', driver: 'Nguyễn Văn G' }
    ],
    status: 'completed',
    value: 3200000,
    created: '2024-01-09'
  }
];

const statusConfig = {
  pending: { label: 'Chờ xử lý', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'Đang thực hiện', variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
  completed: { label: 'Hoàn thành', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Đã hủy', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
};

export default function BookingList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = bookings.filter(booking => {
    const routeString = booking.routePoints.map(p => p.location).join(' → ');
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routeString.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
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

  const handleView = (booking: any) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const handleEdit = (booking: any) => {
    setSelectedBooking(booking);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh sách Booking</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý đặt chỗ và lịch trình vận chuyển
          </p>
        </div>
        <Button onClick={() => navigate('/sales/bookings/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo booking mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã booking, khách hàng, tuyến đường..."
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
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
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
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Tổng booking</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang thực hiện</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {formatCurrency(bookings.reduce((sum, b) => sum + b.value, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Tổng giá trị</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách booking ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã booking</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Thông tin đoàn</TableHead>
                <TableHead>Hành trình</TableHead>
                <TableHead>Xe & Lái xe</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        {booking.companyCode && (
                          <span className="font-semibold text-primary">{booking.companyCode}</span>
                        )}
                        {!booking.companyCode && (
                          <span className="font-medium">{booking.customer}</span>
                        )}
                        <Badge variant="outline" className={booking.customerType === 'corporate' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {booking.customerType === 'corporate' ? 'DN' : 'Lẻ'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.contact} - {booking.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.customerType === 'corporate' ? (
                      <div className="space-y-1">
                        {booking.groupCode && (
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-xs">{booking.groupCode}</Badge>
                          </div>
                        )}
                        {(booking.numAdults || booking.numChildren) && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-3 h-3" />
                            <span>{booking.numAdults || 0} NL</span>
                            {booking.numChildren > 0 && <span>+ {booking.numChildren} TE</span>}
                          </div>
                        )}
                        {booking.guestType && (
                          <Badge variant="outline" className="text-xs">
                            {booking.guestType === 'inbound' ? 'Inbound' : 'Outbound'}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.routePoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="flex items-center gap-1 min-w-0">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(point.datetime).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{point.location}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {booking.vehicles.map((vehicle, idx) => (
                        <div key={idx} className="text-sm">
                          <Badge variant="secondary" className="mr-1">{vehicle.type}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {vehicle.licensePlate} - {vehicle.driver}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusConfig[booking.status as keyof typeof statusConfig].variant}
                      className={statusConfig[booking.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[booking.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-success">
                    {formatCurrency(booking.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(booking)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(booking)}>
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Chi tiết Booking - {selectedBooking?.id}</span>
              <Button variant="ghost" size="sm" onClick={() => setViewDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Tên khách hàng</Label>
                    <p className="font-medium">{selectedBooking.companyCode || selectedBooking.customer}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Loại khách</Label>
                    <Badge variant={selectedBooking.customerType === 'corporate' ? 'default' : 'secondary'}>
                      {selectedBooking.customerType === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Người liên hệ</Label>
                    <p>{selectedBooking.contact}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số điện thoại</Label>
                    <p>{selectedBooking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Corporate Info */}
              {selectedBooking.customerType === 'corporate' && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      Thông tin đoàn
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedBooking.groupCode && (
                        <div>
                          <Label className="text-muted-foreground">Mã đoàn</Label>
                          <p className="font-medium">{selectedBooking.groupCode}</p>
                        </div>
                      )}
                      {selectedBooking.reference && (
                        <div>
                          <Label className="text-muted-foreground">Reference</Label>
                          <p>{selectedBooking.reference}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-muted-foreground">Số lượng khách</Label>
                        <p>{selectedBooking.numAdults || 0} người lớn {selectedBooking.numChildren > 0 && `+ ${selectedBooking.numChildren} trẻ em`}</p>
                      </div>
                      {selectedBooking.visaType && (
                        <div>
                          <Label className="text-muted-foreground">Loại Visa</Label>
                          <p>{selectedBooking.visaType}</p>
                        </div>
                      )}
                      {selectedBooking.guestType && (
                        <div>
                          <Label className="text-muted-foreground">Loại khách</Label>
                          <Badge variant="outline">
                            {selectedBooking.guestType === 'inbound' ? 'Inbound' : 'Outbound'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Tour Guide */}
              {selectedBooking.tourGuideName && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Hướng dẫn viên
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Tên HDV</Label>
                        <p>{selectedBooking.tourGuideName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Số điện thoại</Label>
                        <p>{selectedBooking.tourGuidePhone}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Trip Dates */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thời gian
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedBooking.startDate && (
                    <div>
                      <Label className="text-muted-foreground">Ngày bắt đầu</Label>
                      <p>{formatDate(selectedBooking.startDate)}</p>
                    </div>
                  )}
                  {selectedBooking.endDate && (
                    <div>
                      <Label className="text-muted-foreground">Ngày kết thúc</Label>
                      <p>{formatDate(selectedBooking.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Route Points */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Hành trình đa điểm</h3>
                <div className="space-y-2">
                  {selectedBooking.routePoints.map((point: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Badge variant="secondary">{idx + 1}</Badge>
                      <div className="flex-1">
                        <p className="font-medium">{point.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(point.datetime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Xe & Lái xe</h3>
                <div className="space-y-2">
                  {selectedBooking.vehicles.map((vehicle: any, idx: number) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{vehicle.type}</Badge>
                        <div className="text-sm">
                          <span className="font-medium">{vehicle.licensePlate}</span>
                          <span className="text-muted-foreground"> - {vehicle.driver}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Value */}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge className={statusConfig[selectedBooking.status as keyof typeof statusConfig].color}>
                      {statusConfig[selectedBooking.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Giá trị</Label>
                  <p className="font-semibold text-lg text-success">{formatCurrency(selectedBooking.value)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Booking - {selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-muted-foreground">
            <p>Chức năng chỉnh sửa đang được phát triển</p>
            <Button className="mt-4" onClick={() => {
              setEditDialogOpen(false);
              navigate('/sales/bookings/create');
            }}>
              Tạo booking mới
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
