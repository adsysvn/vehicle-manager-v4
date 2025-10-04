import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, MapPin, Calendar, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoutePoint {
  id: string;
  location: string;
  date: string;
  time: string;
}

interface Vehicle {
  id: string;
  type: string;
  notes: string;
}

export default function BookingCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [customerType, setCustomerType] = useState<'individual' | 'corporate'>('individual');
  const [customerName, setCustomerName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([
    { id: '1', location: '', date: '', time: '' },
    { id: '2', location: '', date: '', time: '' }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', type: '', notes: '' }
  ]);

  const addRoutePoint = () => {
    const newId = String(routePoints.length + 1);
    setRoutePoints([...routePoints, { id: newId, location: '', date: '', time: '' }]);
  };

  const removeRoutePoint = (id: string) => {
    if (routePoints.length > 2) {
      setRoutePoints(routePoints.filter(point => point.id !== id));
    }
  };

  const updateRoutePoint = (id: string, field: keyof RoutePoint, value: string) => {
    setRoutePoints(routePoints.map(point =>
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  const addVehicle = () => {
    const newId = String(vehicles.length + 1);
    setVehicles([...vehicles, { id: newId, type: '', notes: '' }]);
  };

  const removeVehicle = (id: string) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  const updateVehicle = (id: string, field: keyof Vehicle, value: string) => {
    setVehicles(vehicles.map(vehicle =>
      vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customerName || !contactName || !phone) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin khách hàng',
        variant: 'destructive'
      });
      return;
    }

    const invalidRoutePoint = routePoints.find(point => !point.location || !point.date || !point.time);
    if (invalidRoutePoint) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin hành trình',
        variant: 'destructive'
      });
      return;
    }

    const invalidVehicle = vehicles.find(vehicle => !vehicle.type);
    if (invalidVehicle) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn dòng xe cho tất cả các xe',
        variant: 'destructive'
      });
      return;
    }

    // Success
    toast({
      title: 'Thành công',
      description: 'Đã tạo booking mới'
    });

    setTimeout(() => {
      navigate('/sales/bookings');
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/sales/bookings')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tạo booking mới</h1>
          <p className="text-muted-foreground mt-2">
            Nhập thông tin chi tiết cho booking
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Loại khách hàng</Label>
              <Select value={customerType} onValueChange={(value: 'individual' | 'corporate') => setCustomerType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Khách lẻ</SelectItem>
                  <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  {customerType === 'corporate' ? 'Tên công ty' : 'Tên khách hàng'} *
                </Label>
                <Input
                  placeholder={customerType === 'corporate' ? 'Công ty TNHH ABC' : 'Nguyễn Văn A'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Người liên hệ *</Label>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số điện thoại *</Label>
                <Input
                  type="tel"
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Points */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Hành trình đa điểm
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addRoutePoint}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm điểm
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {routePoints.map((point, index) => (
              <div key={point.id} className="flex gap-4 items-start p-4 border rounded-lg">
                <Badge variant="secondary" className="mt-2">
                  Điểm {index + 1}
                </Badge>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Địa điểm *</Label>
                    <Input
                      placeholder="Hà Nội, Hải Phòng..."
                      value={point.location}
                      onChange={(e) => updateRoutePoint(point.id, 'location', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày *</Label>
                    <Input
                      type="date"
                      value={point.date}
                      onChange={(e) => updateRoutePoint(point.id, 'date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Giờ *</Label>
                    <Input
                      type="time"
                      value={point.time}
                      onChange={(e) => updateRoutePoint(point.id, 'time', e.target.value)}
                      required
                    />
                  </div>
                </div>
                {routePoints.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive mt-8"
                    onClick={() => removeRoutePoint(point.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Phương tiện
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVehicle}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm xe
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="flex gap-4 items-start p-4 border rounded-lg">
                <Badge variant="secondary" className="mt-2">
                  Xe {index + 1}
                </Badge>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dòng xe *</Label>
                    <Select
                      value={vehicle.type}
                      onValueChange={(value) => updateVehicle(vehicle.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dòng xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4 chỗ">4 chỗ</SelectItem>
                        <SelectItem value="7 chỗ">7 chỗ</SelectItem>
                        <SelectItem value="16 chỗ">16 chỗ</SelectItem>
                        <SelectItem value="29 chỗ">29 chỗ</SelectItem>
                        <SelectItem value="35 chỗ">35 chỗ</SelectItem>
                        <SelectItem value="45 chỗ">45 chỗ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ghi chú xe</Label>
                    <Input
                      placeholder="Yêu cầu đặc biệt..."
                      value={vehicle.notes}
                      onChange={(e) => updateVehicle(vehicle.id, 'notes', e.target.value)}
                    />
                  </div>
                </div>
                {vehicles.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive mt-8"
                    onClick={() => removeVehicle(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Ghi chú bổ sung</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Nhập các ghi chú, yêu cầu đặc biệt..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/sales/bookings')}>
            Hủy
          </Button>
          <Button type="submit">
            Tạo booking
          </Button>
        </div>
      </form>
    </div>
  );
}
