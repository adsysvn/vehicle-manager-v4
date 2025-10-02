import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, Phone, AlertCircle } from 'lucide-react';

interface CTVLocation {
  id: string;
  ctvName: string;
  vehicleType: string;
  phone: string;
  status: 'moving' | 'stopped' | 'idle';
  speed: number;
  location: string;
  lastUpdate: string;
  bookingId?: string;
  route?: string;
}

const mockLocations: CTVLocation[] = [
  { id: 'CTV001', ctvName: 'Nguyễn Văn A', vehicleType: '4 chỗ', phone: '0901234567', status: 'moving', speed: 45, location: 'Đường Láng, Hà Nội', lastUpdate: '2 phút trước', bookingId: 'CTVB001', route: 'Hà Nội - Hải Phòng' },
  { id: 'CTV002', ctvName: 'Trần Văn B', vehicleType: '7 chỗ', phone: '0902345678', status: 'stopped', speed: 0, location: 'Bến xe Giáp Bát', lastUpdate: '5 phút trước', bookingId: 'CTVB002', route: 'Hà Nội - Quảng Ninh' },
  { id: 'CTV003', ctvName: 'Lê Thị C', vehicleType: '16 chỗ', phone: '0903456789', status: 'moving', speed: 60, location: 'Cao tốc Hà Nội - Hải Phòng', lastUpdate: '1 phút trước', bookingId: 'CTVB003', route: 'Hà Nội - Hải Phòng' },
  { id: 'CTV005', ctvName: 'Hoàng Văn E', vehicleType: '4 chỗ', phone: '0905678901', status: 'idle', speed: 0, location: 'Bãi xe Mỹ Đình', lastUpdate: '15 phút trước' },
];

export default function CTVTracking() {
  const [locations] = useState<CTVLocation[]>(mockLocations);
  const [selectedCTV, setSelectedCTV] = useState<CTVLocation | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'bg-green-500/10 text-green-500';
      case 'stopped': return 'bg-yellow-500/10 text-yellow-500';
      case 'idle': return 'bg-gray-500/10 text-gray-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'moving': return 'Đang di chuyển';
      case 'stopped': return 'Đang dừng';
      case 'idle': return 'Không hoạt động';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Theo dõi CTV</h1>
        <p className="text-muted-foreground mt-1">Theo dõi vị trí và trạng thái CTV theo thời gian thực</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold text-foreground">{locations.filter(l => l.status !== 'idle').length}</p>
            </div>
            <Navigation className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang di chuyển</p>
              <p className="text-2xl font-bold text-green-500">{locations.filter(l => l.status === 'moving').length}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
              <Navigation className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang dừng</p>
              <p className="text-2xl font-bold text-yellow-500">{locations.filter(l => l.status === 'stopped').length}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Không hoạt động</p>
              <p className="text-2xl font-bold text-muted-foreground">{locations.filter(l => l.status === 'idle').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Bản đồ GPS - Chức năng đang phát triển</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Danh sách CTV</h3>
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`p-4 cursor-pointer transition-colors ${selectedCTV?.id === location.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedCTV(location)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{location.ctvName}</p>
                    <p className="text-sm text-muted-foreground">{location.id} • {location.vehicleType}</p>
                  </div>
                  <Badge className={getStatusColor(location.status)}>
                    {getStatusText(location.status)}
                  </Badge>
                </div>

                {location.bookingId && (
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Booking: {location.bookingId}</p>
                    <p className="text-sm font-medium text-foreground">{location.route}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{location.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{location.speed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{location.lastUpdate}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  {location.phone}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
