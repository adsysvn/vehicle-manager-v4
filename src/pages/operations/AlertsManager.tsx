import { useState, useEffect } from 'react';
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
  User,
  RefreshCw,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel } from '@/lib/exportToExcel';

interface Alert {
  id: string;
  type: string;
  severity: string;
  vehicle: string;
  driver?: string;
  message: string;
  title: string;
  time: string;
  status: string;
  due_date?: string;
}

export default function AlertsManager() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicle_alerts')
        .select(`
          *,
          vehicles!vehicle_alerts_vehicle_id_fkey (license_plate),
          drivers!vehicle_alerts_driver_id_fkey (
            profiles!drivers_profile_id_fkey (full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAlerts: Alert[] = (data || []).map(a => ({
        id: a.id,
        type: a.alert_type,
        severity: a.severity,
        vehicle: a.vehicles?.license_plate || 'N/A',
        driver: a.drivers?.profiles?.full_name,
        message: a.message,
        title: a.title,
        time: formatRelativeTime(a.created_at),
        status: a.status,
        due_date: a.due_date
      }));

      setAlerts(formattedAlerts);
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const handleResolve = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_alerts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Thành công', description: 'Đã xử lý cảnh báo' });
      fetchAlerts();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const generateAlerts = async () => {
    try {
      const { error } = await supabase.rpc('create_vehicle_alerts');
      if (error) throw error;
      toast({ title: 'Thành công', description: 'Đã cập nhật cảnh báo' });
      fetchAlerts();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const handleExport = () => {
    const exportData = alerts.map(a => ({
      'Mã': a.id.slice(0, 8),
      'Tiêu đề': a.title,
      'Loại': getTypeText(a.type),
      'Mức độ': getSeverityText(a.severity),
      'Xe': a.vehicle,
      'Lái xe': a.driver || '',
      'Nội dung': a.message,
      'Hạn': a.due_date || '',
      'Trạng thái': a.status === 'active' ? 'Đang hoạt động' : 'Đã xử lý'
    }));
    exportToExcel(exportData, 'canh-bao-he-thong');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-5 h-5" />;
      case 'insurance': return <FileText className="w-5 h-5" />;
      case 'registration': return <FileText className="w-5 h-5" />;
      case 'oil_change': return <Wrench className="w-5 h-5" />;
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
      case 'maintenance': return 'Bảo dưỡng';
      case 'insurance': return 'Bảo hiểm';
      case 'registration': return 'Đăng kiểm';
      case 'oil_change': return 'Thay dầu';
      default: return type;
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');
  const maintenanceAlerts = activeAlerts.filter(a => a.type === 'maintenance');
  const insuranceAlerts = activeAlerts.filter(a => a.type === 'insurance');
  const registrationAlerts = activeAlerts.filter(a => a.type === 'registration');
  const oilAlerts = activeAlerts.filter(a => a.type === 'oil_change');

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
                <span className="font-semibold text-foreground">{alert.title}</span>
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
            {alert.due_date && (
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Hạn: {alert.due_date}</span>
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Hệ thống cảnh báo
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và xử lý các cảnh báo về bảo dưỡng, bảo hiểm, đăng kiểm
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button variant="outline" onClick={generateAlerts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Cập nhật cảnh báo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-muted-foreground">Bảo dưỡng</p>
                <p className="text-2xl font-bold text-warning">{maintenanceAlerts.length}</p>
              </div>
              <Wrench className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bảo hiểm</p>
                <p className="text-2xl font-bold text-destructive">{insuranceAlerts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đăng kiểm</p>
                <p className="text-2xl font-bold text-orange-500">{registrationAlerts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Thay dầu</p>
                <p className="text-2xl font-bold text-blue-500">{oilAlerts.length}</p>
              </div>
              <Wrench className="w-8 h-8 text-blue-500" />
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
          <TabsTrigger value="maintenance">
            Bảo dưỡng ({maintenanceAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="insurance">
            Bảo hiểm ({insuranceAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="registration">
            Đăng kiểm ({registrationAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="oil">
            Thay dầu ({oilAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Đã xử lý ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có cảnh báo nào
              </CardContent>
            </Card>
          ) : (
            activeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {maintenanceAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có cảnh báo bảo dưỡng
              </CardContent>
            </Card>
          ) : (
            maintenanceAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          {insuranceAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có cảnh báo bảo hiểm
              </CardContent>
            </Card>
          ) : (
            insuranceAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          {registrationAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có cảnh báo đăng kiểm
              </CardContent>
            </Card>
          ) : (
            registrationAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="oil" className="space-y-4">
          {oilAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có cảnh báo thay dầu
              </CardContent>
            </Card>
          ) : (
            oilAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Không có cảnh báo đã xử lý
              </CardContent>
            </Card>
          ) : (
            resolvedAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
