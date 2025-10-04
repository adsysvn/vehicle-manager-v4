import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  Wrench, 
  FileText, 
  CheckCircle,
  Bell,
  Car,
  User
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'speed' | 'inspection' | 'maintenance';
  severity: 'high' | 'medium' | 'low';
  vehicle: string;
  driver?: string;
  message: string;
  time: string;
  status: 'active' | 'resolved';
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT001',
    type: 'speed',
    severity: 'high',
    vehicle: '30A-123.45',
    driver: 'Nguyễn Văn A',
    message: 'Vượt quá tốc độ cho phép 95km/h (giới hạn 80km/h)',
    time: '5 phút trước',
    status: 'active'
  },
  {
    id: 'ALT002',
    type: 'inspection',
    severity: 'medium',
    vehicle: '51B-678.90',
    message: 'Đăng kiểm hết hạn sau 7 ngày (15/04/2025)',
    time: '1 giờ trước',
    status: 'active'
  },
  {
    id: 'ALT003',
    type: 'maintenance',
    severity: 'high',
    vehicle: '92C-111.22',
    driver: 'Lê Văn C',
    message: 'Cần bảo dưỡng định kỳ - đã chạy 9,850km (hạn mức 10,000km)',
    time: '2 giờ trước',
    status: 'active'
  },
  {
    id: 'ALT004',
    type: 'speed',
    severity: 'medium',
    vehicle: '29D-456.78',
    driver: 'Trần Văn B',
    message: 'Vượt quá tốc độ cho phép 87km/h (giới hạn 80km/h)',
    time: '3 giờ trước',
    status: 'resolved'
  },
  {
    id: 'ALT005',
    type: 'inspection',
    severity: 'low',
    vehicle: '43E-789.01',
    message: 'Đăng kiểm hết hạn sau 30 ngày (08/05/2025)',
    time: '1 ngày trước',
    status: 'active'
  },
  {
    id: 'ALT006',
    type: 'maintenance',
    severity: 'medium',
    vehicle: '88F-234.56',
    message: 'Cần thay dầu động cơ - đã chạy 4,800km (hạn mức 5,000km)',
    time: '1 ngày trước',
    status: 'active'
  }
];

export default function AlertsManager() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'speed': return <AlertTriangle className="w-5 h-5" />;
      case 'inspection': return <FileText className="w-5 h-5" />;
      case 'maintenance': return <Wrench className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return '';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'speed': return 'Quá tốc độ';
      case 'inspection': return 'Đăng kiểm';
      case 'maintenance': return 'Bảo trì';
      default: return '';
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');
  const speedAlerts = activeAlerts.filter(a => a.type === 'speed');
  const inspectionAlerts = activeAlerts.filter(a => a.type === 'inspection');
  const maintenanceAlerts = activeAlerts.filter(a => a.type === 'maintenance');

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card className="hover:shadow-md transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              alert.severity === 'high' ? 'bg-destructive/10 text-destructive' :
              alert.severity === 'medium' ? 'bg-warning/10 text-warning' :
              'bg-muted text-muted-foreground'
            }`}>
              {getAlertIcon(alert.type)}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-foreground">{alert.id}</span>
                <Badge variant={getAlertColor(alert.severity) as any}>
                  {getSeverityText(alert.severity)}
                </Badge>
                <Badge variant="outline">
                  {getTypeText(alert.type)}
                </Badge>
              </div>
              <p className="text-sm text-foreground">{alert.message}</p>
            </div>
          </div>
          {alert.status === 'active' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolve(alert.id)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Xử lý
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground pl-14">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Car className="w-4 h-4" />
              <span>{alert.vehicle}</span>
            </span>
            {alert.driver && (
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{alert.driver}</span>
              </span>
            )}
          </div>
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{alert.time}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Hệ thống cảnh báo
        </h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi và xử lý các cảnh báo về tốc độ, đăng kiểm, bảo trì
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng cảnh báo</p>
                <p className="text-2xl font-bold text-foreground">{activeAlerts.length}</p>
              </div>
              <Bell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quá tốc độ</p>
                <p className="text-2xl font-bold text-destructive">{speedAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đăng kiểm</p>
                <p className="text-2xl font-bold text-warning">{inspectionAlerts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bảo trì</p>
                <p className="text-2xl font-bold text-warning">{maintenanceAlerts.length}</p>
              </div>
              <Wrench className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="speed">
            Quá tốc độ ({speedAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="inspection">
            Đăng kiểm ({inspectionAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Bảo trì ({maintenanceAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Đã xử lý ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activeAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="speed" className="space-y-4">
          {speedAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="inspection" className="space-y-4">
          {inspectionAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {maintenanceAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
