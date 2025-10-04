import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, MapPin, Calendar, Car, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Stop {
  id: string;
  location: string;
  time: string;
  notes: string;
}

interface Vehicle {
  id: string;
  type: string;
  quantity: number;
  stops: string[]; // IDs of stops this vehicle serves
}

export default function BookingCreate() {
  const navigate = useNavigate();
  const [isMultiStop, setIsMultiStop] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');
  
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', location: '', time: '', notes: 'Điểm đón' },
    { id: '2', location: '', time: '', notes: 'Điểm trả' }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', type: '', quantity: 1, stops: ['1', '2'] }
  ]);

  const addStop = () => {
    const newStop: Stop = {
      id: Date.now().toString(),
      location: '',
      time: '',
      notes: ''
    };
    setStops([...stops.slice(0, -1), newStop, stops[stops.length - 1]]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter(s => s.id !== id));
      // Remove stop from all vehicles
      setVehicles(vehicles.map(v => ({
        ...v,
        stops: v.stops.filter(sid => sid !== id)
      })));
    }
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: '',
      quantity: 1,
      stops: stops.map(s => s.id)
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const removeVehicle = (id: string) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const updateVehicleStops = (vehicleId: string, stopId: string, checked: boolean) => {
    setVehicles(vehicles.map(v => {
      if (v.id === vehicleId) {
        const newStops = checked 
          ? [...v.stops, stopId]
          : v.stops.filter(sid => sid !== stopId);
        return { ...v, stops: newStops };
      }
      return v;
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tạo Booking mới</h1>
          <p className="text-muted-foreground mt-1">Tạo booking với hành trình đơn hoặc đa điểm</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/sales/bookings')}>
          Hủy
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại khách hàng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Cá nhân</SelectItem>
                      <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Khách hàng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cus1">Nguyễn Văn A - 0901234567</SelectItem>
                      <SelectItem value="cus2">Công ty TNHH ABC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingDate">Ngày booking</Label>
                <Input id="bookingDate" type="date" required />
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Type */}
          <Card>
            <CardHeader>
              <CardTitle>Loại hành trình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  variant={!isMultiStop ? 'default' : 'outline'}
                  onClick={() => setIsMultiStop(false)}
                >
                  Đơn điểm
                </Button>
                <Button 
                  variant={isMultiStop ? 'default' : 'outline'}
                  onClick={() => setIsMultiStop(true)}
                >
                  Đa điểm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stops */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hành trình</CardTitle>
                {isMultiStop && (
                  <Button onClick={addStop} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm điểm dừng
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stops.map((stop, index) => (
                <div key={stop.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <Badge variant={index === 0 ? 'default' : index === stops.length - 1 ? 'secondary' : 'outline'}>
                        {index === 0 ? 'Điểm đón' : index === stops.length - 1 ? 'Điểm trả' : 'Điểm dừng'}
                      </Badge>
                    </div>
                    {isMultiStop && index > 0 && index < stops.length - 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeStop(stop.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Địa điểm</Label>
                      <div className="flex gap-2">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-2" />
                        <Input placeholder="Nhập địa điểm..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Thời gian</Label>
                      <Input type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label>Ghi chú</Label>
                      <Input placeholder="Ghi chú thêm..." />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Vehicles */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Phương tiện</CardTitle>
                <Button onClick={addVehicle} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm xe
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicles.map((vehicle, vIndex) => (
                <div key={vehicle.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      <span className="font-medium">Xe #{vIndex + 1}</span>
                    </div>
                    {vehicles.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeVehicle(vehicle.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Loại xe</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại xe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4seats">4 chỗ</SelectItem>
                          <SelectItem value="7seats">7 chỗ</SelectItem>
                          <SelectItem value="16seats">16 chỗ</SelectItem>
                          <SelectItem value="29seats">29 chỗ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Số lượng</Label>
                      <Input type="number" min="1" defaultValue="1" />
                    </div>
                  </div>

                  {isMultiStop && (
                    <div className="space-y-2">
                      <Label>Hành trình phục vụ</Label>
                      <div className="space-y-2">
                        {stops.map((stop, sIndex) => (
                          <div key={stop.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`vehicle-${vehicle.id}-stop-${stop.id}`}
                              checked={vehicle.stops.includes(stop.id)}
                              onChange={(e) => updateVehicleStops(vehicle.id, stop.id, e.target.checked)}
                              className="w-4 h-4"
                            />
                            <Label htmlFor={`vehicle-${vehicle.id}-stop-${stop.id}`} className="cursor-pointer">
                              Chặng {sIndex + 1}: {stop.notes || `Điểm ${sIndex + 1}`}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Booking Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú booking</Label>
                <Textarea 
                  id="notes"
                  placeholder="Nhập thông tin bổ sung, yêu cầu đặc biệt..."
                  rows={4}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại hành trình:</span>
                <Badge>{isMultiStop ? 'Đa điểm' : 'Đơn điểm'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điểm dừng:</span>
                <span className="font-medium">{stops.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số xe:</span>
                <span className="font-medium">{vehicles.reduce((sum, v) => sum + v.quantity, 0)}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-2">Loại xe:</p>
                <div className="space-y-1">
                  {vehicles.map((v, i) => (
                    <p key={v.id} className="text-sm">
                      Xe #{i + 1}: {v.type || 'Chưa chọn'} (x{v.quantity})
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            <Calendar className="w-4 h-4 mr-2" />
            Tạo Booking
          </Button>
        </div>
      </div>
    </div>
  );
}