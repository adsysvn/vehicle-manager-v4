import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Clock, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Stop {
  id: string;
  location: string;
  arrivalTime: string;
  departureTime: string;
  duration: number;
  notes?: string;
}

interface Service {
  id: string;
  name: string;
  quantity: number;
  confirmed: boolean;
}

export default function MultiStopBooking() {
  const [stops, setStops] = useState<Stop[]>([
    {
      id: '1',
      location: 'Hà Nội',
      arrivalTime: '',
      departureTime: '08:00',
      duration: 0,
      notes: 'Điểm đón'
    }
  ]);

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Nước suối', quantity: 10, confirmed: false },
    { id: '2', name: 'Khăn lạnh', quantity: 10, confirmed: false },
    { id: '3', name: 'Wifi', quantity: 1, confirmed: false }
  ]);

  const [availableForOtherTour, setAvailableForOtherTour] = useState(false);
  const [waitingTimeStart, setWaitingTimeStart] = useState('');
  const [waitingTimeEnd, setWaitingTimeEnd] = useState('');

  const addStop = () => {
    const newStop: Stop = {
      id: Date.now().toString(),
      location: '',
      arrivalTime: '',
      departureTime: '',
      duration: 0,
      notes: ''
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 1) {
      setStops(stops.filter(stop => stop.id !== id));
    }
  };

  const moveStop = (index: number, direction: 'up' | 'down') => {
    const newStops = [...stops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < stops.length) {
      [newStops[index], newStops[targetIndex]] = [newStops[targetIndex], newStops[index]];
      setStops(newStops);
    }
  };

  const updateStop = (id: string, field: keyof Stop, value: any) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const toggleServiceConfirmation = (id: string) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, confirmed: !service.confirmed } : service
    ));
  };

  const allServicesConfirmed = services.every(s => s.confirmed);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Hành trình đa điểm</h1>
        <p className="text-muted-foreground mt-1">Bổ sung điểm dừng và quản lý thời gian chờ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hành trình đa điểm</CardTitle>
                <Button onClick={addStop}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm điểm dừng
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stops.map((stop, index) => (
                <Card key={stop.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <Badge variant={index === 0 ? 'default' : index === stops.length - 1 ? 'secondary' : 'outline'}>
                          {index === 0 ? 'Điểm đón' : index === stops.length - 1 ? 'Điểm trả' : 'Điểm dừng'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {index > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => moveStop(index, 'up')}
                          >
                            <MoveUp className="w-4 h-4" />
                          </Button>
                        )}
                        {index < stops.length - 1 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => moveStop(index, 'down')}
                          >
                            <MoveDown className="w-4 h-4" />
                          </Button>
                        )}
                        {stops.length > 1 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeStop(stop.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Địa điểm</Label>
                        <div className="flex gap-2">
                          <MapPin className="w-5 h-5 text-muted-foreground mt-2" />
                          <Input 
                            placeholder="Nhập địa điểm..."
                            value={stop.location}
                            onChange={(e) => updateStop(stop.id, 'location', e.target.value)}
                          />
                        </div>
                      </div>

                      {index > 0 && (
                        <div className="space-y-2">
                          <Label>Thời gian đến</Label>
                          <Input 
                            type="time"
                            value={stop.arrivalTime}
                            onChange={(e) => updateStop(stop.id, 'arrivalTime', e.target.value)}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>{index === 0 ? 'Thời gian xuất phát' : 'Thời gian khởi hành'}</Label>
                        <Input 
                          type="time"
                          value={stop.departureTime}
                          onChange={(e) => updateStop(stop.id, 'departureTime', e.target.value)}
                        />
                      </div>

                      {index > 0 && index < stops.length - 1 && (
                        <div className="space-y-2">
                          <Label>Thời gian dừng (phút)</Label>
                          <Input 
                            type="number"
                            placeholder="30"
                            value={stop.duration}
                            onChange={(e) => updateStop(stop.id, 'duration', parseInt(e.target.value))}
                          />
                        </div>
                      )}

                      <div className="col-span-2 space-y-2">
                        <Label>Ghi chú</Label>
                        <Input 
                          placeholder="Ghi chú thêm..."
                          value={stop.notes}
                          onChange={(e) => updateStop(stop.id, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thời gian chờ - Bổ sung tour khác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input 
                  type="checkbox"
                  id="availableForOther"
                  checked={availableForOtherTour}
                  onChange={(e) => setAvailableForOtherTour(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="availableForOther" className="cursor-pointer">
                  Cho phép nhận tour khác trong thời gian chờ
                </Label>
              </div>

              {availableForOtherTour && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <Label>Thời gian chờ từ</Label>
                    <Input 
                      type="datetime-local"
                      value={waitingTimeStart}
                      onChange={(e) => setWaitingTimeStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Đến</Label>
                    <Input 
                      type="datetime-local"
                      value={waitingTimeEnd}
                      onChange={(e) => setWaitingTimeEnd(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Xe có thể nhận booking khác trong khoảng thời gian này
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xác nhận dịch vụ đi kèm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      service.confirmed ? 'bg-green-50 border-green-500' : 'bg-background'
                    }`}
                    onClick={() => toggleServiceConfirmation(service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={service.confirmed}
                          onChange={() => {}}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Số lượng: {service.quantity}
                          </p>
                        </div>
                      </div>
                      {service.confirmed && (
                        <Badge variant="default">✓ Đã cung cấp</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {allServicesConfirmed ? (
                <div className="p-4 bg-green-50 border border-green-500 rounded-lg">
                  <p className="text-green-700 font-medium text-center">
                    ✓ Tất cả dịch vụ đã được xác nhận
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-500 rounded-lg">
                  <p className="text-yellow-700 text-sm text-center">
                    Vui lòng xác nhận tất cả dịch vụ trước khi xuất phát
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt hành trình</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng điểm dừng:</span>
                <span className="font-medium">{stops.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng thời gian dừng:</span>
                <span className="font-medium">
                  {stops.reduce((sum, stop) => sum + (stop.duration || 0), 0)} phút
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dịch vụ đã xác nhận:</span>
                <span className="font-medium">
                  {services.filter(s => s.confirmed).length}/{services.length}
                </span>
              </div>
              {availableForOtherTour && (
                <div className="pt-3 border-t">
                  <Badge variant="secondary" className="w-full justify-center">
                    Có thể nhận tour khác trong thời gian chờ
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            Lưu hành trình
          </Button>
        </div>
      </div>
    </div>
  );
}
