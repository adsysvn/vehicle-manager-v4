import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Droplet, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OilChangeRecord {
  id: string;
  vehicle_id: string;
  date: string;
  mileage: number;
  oil_type: string;
  oil_brand: string | null;
  quantity_liters: number;
  filter_changed: boolean;
  cost: number | null;
  next_change_mileage: number | null;
  next_change_date: string | null;
  service_provider: string | null;
  technician_name: string | null;
  notes: string | null;
  vehicles?: {
    license_plate: string;
    brand: string;
    model: string;
  };
}

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  current_mileage: number | null;
}

export default function OilManagement() {
  const [records, setRecords] = useState<OilChangeRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    oil_type: 'synthetic',
    oil_brand: '',
    quantity_liters: '',
    filter_changed: true,
    cost: '',
    next_change_mileage: '',
    next_change_date: '',
    service_provider: '',
    technician_name: '',
    notes: ''
  });

  useEffect(() => {
    fetchRecords();
    fetchVehicles();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('oil_change_records')
        .select(`
          *,
          vehicles (
            license_plate,
            brand,
            model
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, license_plate, brand, model, current_mileage')
        .eq('status', 'available')
        .order('license_plate');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('oil_change_records')
        .insert([{
          vehicle_id: formData.vehicle_id,
          date: formData.date,
          mileage: parseFloat(formData.mileage),
          oil_type: formData.oil_type,
          oil_brand: formData.oil_brand || null,
          quantity_liters: parseFloat(formData.quantity_liters),
          filter_changed: formData.filter_changed,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          next_change_mileage: formData.next_change_mileage ? parseFloat(formData.next_change_mileage) : null,
          next_change_date: formData.next_change_date || null,
          service_provider: formData.service_provider || null,
          technician_name: formData.technician_name || null,
          notes: formData.notes || null
        }]);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã thêm lịch sử thay dầu'
      });

      setIsDialogOpen(false);
      setFormData({
        vehicle_id: '',
        date: new Date().toISOString().split('T')[0],
        mileage: '',
        oil_type: 'synthetic',
        oil_brand: '',
        quantity_liters: '',
        filter_changed: true,
        cost: '',
        next_change_mileage: '',
        next_change_date: '',
        service_provider: '',
        technician_name: '',
        notes: ''
      });
      fetchRecords();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message
      });
    }
  };

  const getStatusColor = (nextChangeDate: string | null) => {
    if (!nextChangeDate) return 'secondary';
    const daysUntil = Math.floor((new Date(nextChangeDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return 'destructive';
    if (daysUntil < 7) return 'warning';
    return 'success';
  };

  const getStatusText = (nextChangeDate: string | null) => {
    if (!nextChangeDate) return 'Chưa đặt lịch';
    const daysUntil = Math.floor((new Date(nextChangeDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return 'Quá hạn';
    if (daysUntil < 7) return `Còn ${daysUntil} ngày`;
    return 'Bình thường';
  };

  // Calculate statistics
  const totalRecords = records.length;
  const upcomingChanges = records.filter(r => {
    if (!r.next_change_date) return false;
    const daysUntil = Math.floor((new Date(r.next_change_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  }).length;
  const overdueChanges = records.filter(r => {
    if (!r.next_change_date) return false;
    return new Date(r.next_change_date) < new Date();
  }).length;
  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Quản lý thay dầu
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi lịch sử và lịch thay dầu định kỳ
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm lịch sử thay dầu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm lịch sử thay dầu</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Xe *</Label>
                  <Select
                    value={formData.vehicle_id}
                    onValueChange={(value) => {
                      const vehicle = vehicles.find(v => v.id === value);
                      setFormData({
                        ...formData,
                        vehicle_id: value,
                        mileage: vehicle?.current_mileage?.toString() || ''
                      });
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn xe" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.license_plate} - {vehicle.brand} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ngày thay dầu *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Số km hiện tại *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Loại dầu *</Label>
                  <Select
                    value={formData.oil_type}
                    onValueChange={(value) => setFormData({ ...formData, oil_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="synthetic">Tổng hợp (Synthetic)</SelectItem>
                      <SelectItem value="semi-synthetic">Bán tổng hợp</SelectItem>
                      <SelectItem value="mineral">Khoáng (Mineral)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Thương hiệu dầu</Label>
                  <Input
                    value={formData.oil_brand}
                    onChange={(e) => setFormData({ ...formData, oil_brand: e.target.value })}
                    placeholder="VD: Castrol, Shell..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Số lít dầu *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.quantity_liters}
                    onChange={(e) => setFormData({ ...formData, quantity_liters: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chi phí (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lọc dầu</Label>
                  <Select
                    value={formData.filter_changed.toString()}
                    onValueChange={(value) => setFormData({ ...formData, filter_changed: value === 'true' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Đã thay</SelectItem>
                      <SelectItem value="false">Chưa thay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Km thay dầu tiếp theo</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.next_change_mileage}
                    onChange={(e) => setFormData({ ...formData, next_change_mileage: e.target.value })}
                    placeholder={formData.mileage ? `VD: ${(parseFloat(formData.mileage) + 5000).toFixed(0)}` : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ngày thay dầu tiếp theo</Label>
                  <Input
                    type="date"
                    value={formData.next_change_date}
                    onChange={(e) => setFormData({ ...formData, next_change_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Đơn vị bảo dưỡng</Label>
                  <Input
                    value={formData.service_provider}
                    onChange={(e) => setFormData({ ...formData, service_provider: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kỹ thuật viên</Label>
                  <Input
                    value={formData.technician_name}
                    onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng lượt thay dầu</p>
                <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
              </div>
              <Droplet className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sắp đến hạn</p>
                <p className="text-2xl font-bold text-warning">{upcomingChanges}</p>
              </div>
              <Calendar className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quá hạn</p>
                <p className="text-2xl font-bold text-destructive">{overdueChanges}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng chi phí</p>
                <p className="text-2xl font-bold text-success">
                  {(totalCost / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thay dầu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Xe</TableHead>
                <TableHead>Ngày thay</TableHead>
                <TableHead>Km</TableHead>
                <TableHead>Loại dầu</TableHead>
                <TableHead>Số lít</TableHead>
                <TableHead>Chi phí</TableHead>
                <TableHead>Lần sau</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Chưa có lịch sử thay dầu
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.vehicles?.license_plate}
                      <div className="text-sm text-muted-foreground">
                        {record.vehicles?.brand} {record.vehicles?.model}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{record.mileage.toLocaleString()} km</TableCell>
                    <TableCell>
                      {record.oil_type === 'synthetic' ? 'Tổng hợp' :
                       record.oil_type === 'semi-synthetic' ? 'Bán tổng hợp' : 'Khoáng'}
                      {record.oil_brand && (
                        <div className="text-sm text-muted-foreground">{record.oil_brand}</div>
                      )}
                    </TableCell>
                    <TableCell>{record.quantity_liters} lít</TableCell>
                    <TableCell>
                      {record.cost ? `${(record.cost / 1000).toLocaleString()}K` : '-'}
                    </TableCell>
                    <TableCell>
                      {record.next_change_date ? (
                        <>
                          {new Date(record.next_change_date).toLocaleDateString('vi-VN')}
                          {record.next_change_mileage && (
                            <div className="text-sm text-muted-foreground">
                              {record.next_change_mileage.toLocaleString()} km
                            </div>
                          )}
                        </>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.next_change_date) as any}>
                        {getStatusText(record.next_change_date)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
