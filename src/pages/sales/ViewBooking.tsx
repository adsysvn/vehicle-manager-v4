import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Car, User, Phone, Mail, FileText, Edit, Users, UserCheck, Hash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ViewBooking() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - sẽ được thay thế bằng API call thực tế
  const booking = {
    id: id,
    code: 'BK001',
    customerType: 'corporate',
    companyCode: 'DN001',
    customerName: 'Công ty TNHH ABC',
    contactName: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'contact@abc.com',
    passengerCount: 15,
    childrenCount: 3,
    tourGuideName: 'Nguyễn Văn B',
    tourGuidePhone: '0909876543',
    reference: 'REF123',
    additionalServices: 'Nước suối, khăn lạnh, bữa ăn trưa tại nhà hàng 5 sao',
    status: 'confirmed',
    routePoints: [
      { id: '1', location: 'Hà Nội', date: '2024-03-20', time: '08:00' },
      { id: '2', location: 'Hải Phòng', date: '2024-03-20', time: '10:30' },
      { id: '3', location: 'Quảng Ninh', date: '2024-03-20', time: '14:00' }
    ],
    vehicles: [
      { id: '1', type: '16 chỗ', notes: 'Yêu cầu xe mới' },
      { id: '2', type: '7 chỗ', notes: '' }
    ],
    notes: 'Khách VIP, cần chăm sóc đặc biệt',
    createdAt: '2024-03-15 10:30',
    value: 15000000
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sales/bookings')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Chi tiết booking</h1>
              <Badge className={getStatusColor(booking.status)}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Mã booking: {booking.code} • Tạo lúc: {booking.createdAt}
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(`/sales/bookings/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Thông tin khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Loại khách hàng</p>
              <Badge variant="outline">
                {booking.customerType === 'corporate' ? 'Doanh nghiệp' : 'Khách lẻ'}
              </Badge>
            </div>
            {booking.customerType === 'corporate' && booking.companyCode && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mã doanh nghiệp</p>
                <p className="font-medium">{booking.companyCode}</p>
              </div>
            )}
          </div>

          {booking.customerType === 'corporate' && booking.companyCode && <Separator />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {booking.customerType === 'corporate' ? 'Tên công ty' : 'Tên khách hàng'}
              </p>
              <p className="font-medium">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Người liên hệ</p>
              <p className="font-medium">{booking.contactName}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </p>
              <p className="font-medium">{booking.phone}</p>
            </div>
            {booking.email && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-medium">{booking.email}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trip Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Thông tin chuyến đi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {booking.passengerCount !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Số khách</p>
                <p className="font-medium text-lg">{booking.passengerCount}</p>
              </div>
            )}
            {booking.childrenCount !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Em bé</p>
                <p className="font-medium text-lg">{booking.childrenCount}</p>
              </div>
            )}
            {booking.reference && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Reference
                </p>
                <p className="font-medium">{booking.reference}</p>
              </div>
            )}
          </div>

          {(booking.tourGuideName || booking.tourGuidePhone) && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Hướng dẫn viên
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {booking.tourGuideName && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tên HDV</p>
                      <p className="font-medium">{booking.tourGuideName}</p>
                    </div>
                  )}
                  {booking.tourGuidePhone && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Số điện thoại HDV</p>
                      <p className="font-medium">{booking.tourGuidePhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Route Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Hành trình đa điểm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {booking.routePoints.map((point, index) => (
            <div key={point.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  {index < booking.routePoints.length - 1 && (
                    <div className="w-0.5 h-12 bg-border my-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-lg mb-2">{point.location}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {point.date}
                    </span>
                    <span>{point.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Phương tiện ({booking.vehicles.length} xe)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {booking.vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Badge variant="secondary">Xe {index + 1}</Badge>
                <div className="flex-1">
                  <p className="font-semibold mb-1">{vehicle.type}</p>
                  {vehicle.notes && (
                    <p className="text-sm text-muted-foreground">{vehicle.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Services */}
      {booking.additionalServices && (
        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ bổ sung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{booking.additionalServices}</p>
          </CardContent>
        </Card>
      )}

      {/* Additional Notes */}
      {booking.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Ghi chú bổ sung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Financial Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài chính</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-lg font-medium">Giá trị booking</span>
            <span className="text-2xl font-bold text-primary">
              {booking.value.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
