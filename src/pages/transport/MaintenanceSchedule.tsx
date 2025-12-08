import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Search, Plus, Calendar, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

interface Maintenance {
  id: string;
  vehicle_id: string;
  vehicle_plate: string;
  type: string;
  date: string;
  description: string;
  cost: number | null;
  mileage: number | null;
  next_maintenance_date: string | null;
  service_provider: string | null;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
}

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
}

export default function MaintenanceSchedule() {
  const { toast } = useToast();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [vehicleId, setVehicleId] = useState('');
  const [type, setType] = useState<'regular' | 'repair' | 'inspection' | 'emergency'>('regular');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [mileage, setMileage] = useState('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: records, error } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          vehicle:vehicles(license_plate)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      const today = new Date();
      const formattedRecords: Maintenance[] = (records || []).map(r => {
        const maintenanceDate = new Date(r.date);
        let status: 'scheduled' | 'in-progress' | 'completed' | 'overdue' = 'completed';
        
        if (maintenanceDate > today) {
          status = 'scheduled';
        } else if (r.next_maintenance_date) {
          const nextDate = new Date(r.next_maintenance_date);
          if (nextDate < today) {
            status = 'overdue';
          }
        }

        return {
          id: r.id,
          vehicle_id: r.vehicle_id,
          vehicle_plate: r.vehicle?.license_plate || 'N/A',
          type: r.type,
          date: r.date,
          description: r.description,
          cost: r.cost,
          mileage: r.mileage,
          next_maintenance_date: r.next_maintenance_date,
          service_provider: r.service_provider,
          status
        };
      });

      setMaintenances(formattedRecords);

      // Fetch vehicles
      const { data: vehicleData } = await supabase
        .from('vehicles')
        .select('id, license_plate, brand, model');
      setVehicles(vehicleData || []);

    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!vehicleId || !type || !date || !description) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('maintenance_records').insert({
        vehicle_id: vehicleId,
        type,
        date,
        description,
        cost: cost ? parseFloat(cost) : null,
        mileage: mileage ? parseFloat(mileage) : null,
        next_maintenance_date: nextMaintenanceDate || null,
        service_provider: serviceProvider || null
      });

      if (error) throw error;

      // Update vehicle's maintenance dates
      await supabase.from('vehicles').update({
        last_maintenance_date: date,
        next_maintenance_date: nextMaintenanceDate || null
      }).eq('id', vehicleId);

      toast({ title: 'Thành công', description: 'Đã thêm lịch bảo dưỡng' });
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setVehicleId('');
    setType('regular');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setCost('');
    setMileage('');
    setNextMaintenanceDate('');
    setServiceProvider('');
  };

  const filteredMaintenances = maintenances.filter(m =>
    m.vehicle_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.service_provider?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/10 text-blue-500';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'overdue': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'in-progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'overdue': return 'Quá hạn';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'regular': return 'Bảo dưỡng định kỳ';
      case 'repair': return 'Sửa chữa';
      case 'inspection': return 'Kiểm tra';
      case 'emergency': return 'Khẩn cấp';
      default: return type;
    }
  };

  const handleExport = () => {
    const exportData = filteredMaintenances.map(m => ({
      'Biển số': m.vehicle_plate,
      'Loại': getTypeText(m.type),
      'Ngày': m.date,
      'Mô tả': m.description,
      'Chi phí': m.cost || '',
      'Số km': m.mileage || '',
      'Garage': m.service_provider || '',
      'Lịch tiếp': m.next_maintenance_date || '',
      'Trạng thái': getStatusText(m.status)
    }));
    exportToExcel(exportData, 'lich-bao-duong');
  };

  const totalCost = maintenances.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lịch bảo dưỡng</h1>
          <p className="text-muted-foreground mt-1">Quản lý lịch bảo dưỡng và sửa chữa xe</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm lịch bảo dưỡng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm lịch bảo dưỡng</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Biển số xe *</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId}>
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
                  <Label>Loại bảo dưỡng *</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Bảo dưỡng định kỳ</SelectItem>
                      <SelectItem value="repair">Sửa chữa</SelectItem>
                      <SelectItem value="inspection">Kiểm tra định kỳ</SelectItem>
                      <SelectItem value="emergency">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày thực hiện *</Label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Garage</Label>
                  <Input 
                    placeholder="Tên garage" 
                    value={serviceProvider}
                    onChange={(e) => setServiceProvider(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chi phí (VNĐ)</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số km</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Lịch bảo dưỡng tiếp theo</Label>
                  <Input 
                    type="date" 
                    value={nextMaintenanceDate}
                    onChange={(e) => setNextMaintenanceDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả công việc *</Label>
                  <Textarea 
                    placeholder="Nhập mô tả..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleSubmit}>Thêm lịch</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng lịch</p>
              <p className="text-2xl font-bold text-foreground">{maintenances.length}</p>
            </div>
            <Settings className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã lên lịch</p>
              <p className="text-2xl font-bold text-blue-500">{maintenances.filter(m => m.status === 'scheduled').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quá hạn</p>
              <p className="text-2xl font-bold text-red-500">{maintenances.filter(m => m.status === 'overdue').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng chi phí</p>
              <p className="text-2xl font-bold text-foreground">{totalCost.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo biển số, mô tả, garage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Garage</TableHead>
                  <TableHead>Chi phí</TableHead>
                  <TableHead>Lịch tiếp theo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : filteredMaintenances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Không có dữ liệu</TableCell>
                  </TableRow>
                ) : (
                  filteredMaintenances.map((maintenance) => (
                    <TableRow key={maintenance.id}>
                      <TableCell className="font-medium">{maintenance.vehicle_plate}</TableCell>
                      <TableCell>{getTypeText(maintenance.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {maintenance.date}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{maintenance.description}</TableCell>
                      <TableCell>{maintenance.service_provider || '-'}</TableCell>
                      <TableCell className="font-medium">
                        {maintenance.cost ? `${maintenance.cost.toLocaleString('vi-VN')} đ` : '-'}
                      </TableCell>
                      <TableCell>
                        {maintenance.next_maintenance_date ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {maintenance.next_maintenance_date}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(maintenance.status)}>
                          {getStatusText(maintenance.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
