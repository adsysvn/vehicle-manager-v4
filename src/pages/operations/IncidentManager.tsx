import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Clock, MapPin, User, Car, CheckCircle, XCircle, Plus, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel } from '@/lib/exportToExcel';

interface Incident {
  id: string;
  title: string;
  vehicle: string;
  driver: string;
  driverPhone?: string;
  location: string;
  reportTime: string;
  severity: string;
  status: string;
  description: string;
  estimatedCost?: number;
  resolution?: string;
}

const emergencyContacts = [
  { name: 'Cứu hộ 24/7', phone: '1900-xxx-xxx', type: 'Cứu hộ' },
  { name: 'Bảo hiểm Liberty', phone: '1800-xxx-xxx', type: 'Bảo hiểm' },
  { name: 'Cảnh sát giao thông', phone: '113', type: 'Khẩn cấp' },
  { name: 'Cấp cứu', phone: '115', type: 'Y tế' }
];

const severityConfig: Record<string, { label: string; color: string }> = {
  critical: { label: 'Nghiêm trọng', color: 'bg-red-100 text-red-800' },
  high: { label: 'Cao', color: 'bg-orange-100 text-orange-800' },
  medium: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Nhẹ', color: 'bg-blue-100 text-blue-800' }
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  reported: { label: 'Đã báo cáo', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  investigating: { label: 'Đang điều tra', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  resolved: { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

export default function IncidentManager() {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    location: '',
    description: '',
    severity: 'medium',
    incident_datetime: new Date().toISOString().slice(0, 16),
    estimated_cost: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incidentsRes, vehiclesRes, driversRes] = await Promise.all([
        supabase
          .from('incidents')
          .select(`
            *,
            vehicles!incidents_vehicle_id_fkey (license_plate),
            drivers!incidents_driver_id_fkey (
              profiles!drivers_profile_id_fkey (full_name, phone)
            )
          `)
          .order('incident_datetime', { ascending: false }),
        supabase.from('vehicles').select('id, license_plate, brand, model'),
        supabase.from('drivers').select('id, profiles!drivers_profile_id_fkey (full_name, phone)')
      ]);

      if (incidentsRes.error) throw incidentsRes.error;

      const formattedIncidents: Incident[] = (incidentsRes.data || []).map(i => ({
        id: i.id,
        title: i.description.slice(0, 50) + (i.description.length > 50 ? '...' : ''),
        vehicle: i.vehicles?.license_plate || 'N/A',
        driver: i.drivers?.profiles?.full_name || 'N/A',
        driverPhone: i.drivers?.profiles?.phone,
        location: i.location,
        reportTime: i.incident_datetime,
        severity: i.severity,
        status: i.status || 'reported',
        description: i.description,
        estimatedCost: i.estimated_cost,
        resolution: i.resolution
      }));

      setIncidents(formattedIncidents);
      setVehicles(vehiclesRes.data || []);
      setDrivers(driversRes.data || []);
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('incidents')
        .insert({
          vehicle_id: formData.vehicle_id || null,
          driver_id: formData.driver_id || null,
          location: formData.location,
          description: formData.description,
          severity: formData.severity as any,
          incident_datetime: formData.incident_datetime,
          estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
          status: 'reported'
        });

      if (error) throw error;

      toast({ title: 'Thành công', description: 'Đã thêm sự cố mới' });
      setIsDialogOpen(false);
      setFormData({
        vehicle_id: '',
        driver_id: '',
        location: '',
        description: '',
        severity: 'medium',
        incident_datetime: new Date().toISOString().slice(0, 16),
        estimated_cost: ''
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Thành công', description: 'Đã cập nhật trạng thái' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const handleExport = () => {
    const exportData = filteredIncidents.map(i => ({
      'Mô tả': i.title,
      'Xe': i.vehicle,
      'Lái xe': i.driver,
      'Địa điểm': i.location,
      'Thời gian': formatDateTime(i.reportTime),
      'Mức độ': severityConfig[i.severity]?.label || i.severity,
      'Chi phí ước tính': i.estimatedCost || '',
      'Trạng thái': statusConfig[i.status]?.label || i.status
    }));
    exportToExcel(exportData, 'quan-ly-su-co');
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const openIncidents = incidents.filter(i => i.status === 'reported' || i.status === 'investigating');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved' || i.status === 'closed');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Sự cố</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và xử lý các sự cố trong quá trình vận chuyển
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Tạo sự cố mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Báo cáo sự cố mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Xe</Label>
                    <Select value={formData.vehicle_id} onValueChange={(v) => setFormData({...formData, vehicle_id: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn xe" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.license_plate} - {v.brand} {v.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lái xe</Label>
                    <Select value={formData.driver_id} onValueChange={(v) => setFormData({...formData, driver_id: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lái xe" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(d => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.profiles?.full_name || 'N/A'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Thời gian *</Label>
                    <Input 
                      type="datetime-local" 
                      value={formData.incident_datetime}
                      onChange={(e) => setFormData({...formData, incident_datetime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mức độ *</Label>
                    <Select value={formData.severity} onValueChange={(v) => setFormData({...formData, severity: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Nhẹ</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="critical">Nghiêm trọng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Địa điểm *</Label>
                    <Input 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Nhập địa điểm xảy ra sự cố"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Chi phí ước tính (VNĐ)</Label>
                    <Input 
                      type="number"
                      value={formData.estimated_cost}
                      onChange={(e) => setFormData({...formData, estimated_cost: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Mô tả chi tiết *</Label>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Mô tả chi tiết sự cố..."
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Tạo sự cố</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {incidents.filter(i => i.status === 'reported').length}
              </div>
              <div className="text-sm text-muted-foreground">Chưa xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {incidents.filter(i => i.status === 'investigating').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang điều tra</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {resolvedIncidents.length}
              </div>
              <div className="text-sm text-muted-foreground">Đã giải quyết</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{incidents.length}</div>
              <div className="text-sm text-muted-foreground">Tổng sự cố</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Incident List */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách sự cố ({filteredIncidents.length})</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="reported">Đã báo cáo</SelectItem>
                    <SelectItem value="investigating">Đang điều tra</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Đang tải...</div>
              ) : filteredIncidents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Không có sự cố nào
                </div>
              ) : (
                filteredIncidents.map((incident) => {
                  const StatusIcon = statusConfig[incident.status]?.icon || AlertTriangle;
                  return (
                    <div 
                      key={incident.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedIncident === incident.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setSelectedIncident(incident.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-destructive/10">
                              <StatusIcon className="w-5 h-5 text-destructive" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{incident.title}</h4>
                            <p className="text-sm text-muted-foreground">{incident.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={severityConfig[incident.severity]?.color || ''}>
                            {severityConfig[incident.severity]?.label || incident.severity}
                          </Badge>
                          <Badge className={statusConfig[incident.status]?.color || ''}>
                            {statusConfig[incident.status]?.label || incident.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Car className="w-4 h-4 text-muted-foreground" />
                            <span>{incident.vehicle} - {incident.driver}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{incident.location}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{formatDateTime(incident.reportTime)}</span>
                          </div>
                          {incident.estimatedCost && (
                            <div className="text-sm text-muted-foreground">
                              Chi phí: {incident.estimatedCost.toLocaleString('vi-VN')} đ
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {incident.description}
                        </p>
                        {incident.driverPhone && (
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Gọi
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts & Actions */}
        <div className="space-y-6">
          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-destructive" />
                <span>Liên hệ khẩn cấp</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.type}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive">
                      <Phone className="w-4 h-4 mr-1" />
                      {contact.phone}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Car className="w-4 h-4 mr-2" />
                  Điều xe cứu hộ
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Gọi lái xe dự phòng
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Thông báo khách hàng
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Xem vị trí GPS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selected Incident Details */}
          {selectedIncident && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-primary">Chi tiết sự cố</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const incident = incidents.find(i => i.id === selectedIncident);
                  if (!incident) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Xe:</span>
                          <span className="font-medium">{incident.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lái xe:</span>
                          <span className="font-medium">{incident.driver}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Địa điểm:</span>
                          <span className="font-medium">{incident.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời gian:</span>
                          <span className="font-medium">{formatDateTime(incident.reportTime)}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm">{incident.description}</p>
                      </div>
                      {incident.status !== 'closed' && (
                        <div className="flex gap-2 pt-2">
                          {incident.status === 'reported' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(incident.id, 'investigating')}>
                              Bắt đầu điều tra
                            </Button>
                          )}
                          {incident.status === 'investigating' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(incident.id, 'resolved')}>
                              Đánh dấu đã giải quyết
                            </Button>
                          )}
                          {incident.status === 'resolved' && (
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(incident.id, 'closed')}>
                              Đóng sự cố
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
