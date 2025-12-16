import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, AlertCircle, CheckCircle, Download, Search, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel } from '@/lib/exportToExcel';

interface Insurance {
  id: string;
  vehicle_id: string;
  vehicle_plate: string;
  policy_number: string;
  provider: string;
  start_date: string;
  expiry_date: string;
  premium: number | null;
  coverage_details: string | null;
  status: 'active' | 'expiring' | 'expired';
}

export default function VehicleInsurance() {
  const { toast } = useToast();
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    vehicle_id: '',
    policy_number: '',
    provider: '',
    start_date: '',
    expiry_date: '',
    premium: '',
    coverage_details: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [insuranceRes, vehicleRes] = await Promise.all([
        supabase
          .from('insurance_records')
          .select(`
            *,
            vehicles!insurance_records_vehicle_id_fkey (license_plate)
          `)
          .order('expiry_date', { ascending: true }),
        supabase.from('vehicles').select('id, license_plate, brand, model')
      ]);

      if (insuranceRes.error) throw insuranceRes.error;

      const today = new Date();
      const formattedInsurances: Insurance[] = (insuranceRes.data || []).map(i => {
        const expiryDate = new Date(i.expiry_date);
        const daysUntil = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: 'active' | 'expiring' | 'expired' = 'active';
        if (daysUntil < 0) status = 'expired';
        else if (daysUntil <= 30) status = 'expiring';

        return {
          id: i.id,
          vehicle_id: i.vehicle_id,
          vehicle_plate: i.vehicles?.license_plate || 'N/A',
          policy_number: i.policy_number,
          provider: i.provider,
          start_date: i.start_date,
          expiry_date: i.expiry_date,
          premium: i.premium,
          coverage_details: i.coverage_details,
          status
        };
      });

      setInsurances(formattedInsurances);
      setVehicles(vehicleRes.data || []);
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
        .from('insurance_records')
        .insert({
          vehicle_id: formData.vehicle_id,
          policy_number: formData.policy_number,
          provider: formData.provider,
          start_date: formData.start_date,
          expiry_date: formData.expiry_date,
          premium: formData.premium ? parseFloat(formData.premium) : null,
          coverage_details: formData.coverage_details || null
        });

      if (error) throw error;

      // Also update vehicle's insurance_expiry
      await supabase
        .from('vehicles')
        .update({ insurance_expiry: formData.expiry_date })
        .eq('id', formData.vehicle_id);

      toast({ title: 'Thành công', description: 'Đã thêm hợp đồng bảo hiểm' });
      setIsDialogOpen(false);
      setFormData({
        vehicle_id: '',
        policy_number: '',
        provider: '',
        start_date: '',
        expiry_date: '',
        premium: '',
        coverage_details: ''
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Đang hiệu lực</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-500/10 text-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Sắp hết hạn</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/10 text-red-500"><AlertCircle className="w-3 h-3 mr-1" />Hết hạn</Badge>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    const exportData = filteredInsurances.map(i => ({
      'Biển số': i.vehicle_plate,
      'Số HĐ': i.policy_number,
      'Công ty BH': i.provider,
      'Ngày bắt đầu': i.start_date,
      'Ngày hết hạn': i.expiry_date,
      'Phí BH': i.premium || '',
      'Trạng thái': i.status === 'active' ? 'Đang hiệu lực' : i.status === 'expiring' ? 'Sắp hết hạn' : 'Hết hạn'
    }));
    exportToExcel(exportData, 'quan-ly-bao-hiem');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredInsurances = insurances.filter(i =>
    i.vehicle_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = insurances.filter(i => i.status === 'active').length;
  const expiringCount = insurances.filter(i => i.status === 'expiring').length;
  const expiredCount = insurances.filter(i => i.status === 'expired').length;
  const totalPremium = insurances.reduce((sum, i) => sum + (i.premium || 0), 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bảo hiểm</h1>
          <p className="text-muted-foreground mt-1">Theo dõi hợp đồng bảo hiểm xe</p>
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
                Thêm bảo hiểm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm hợp đồng bảo hiểm</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Xe *</Label>
                    <Select value={formData.vehicle_id} onValueChange={(v) => setFormData({...formData, vehicle_id: v})} required>
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
                    <Label>Số hợp đồng *</Label>
                    <Input
                      value={formData.policy_number}
                      onChange={(e) => setFormData({...formData, policy_number: e.target.value})}
                      placeholder="BH-2024-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Công ty bảo hiểm *</Label>
                    <Input
                      value={formData.provider}
                      onChange={(e) => setFormData({...formData, provider: e.target.value})}
                      placeholder="Bảo Việt, PTI, Bảo Minh..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phí bảo hiểm (VNĐ)</Label>
                    <Input
                      type="number"
                      value={formData.premium}
                      onChange={(e) => setFormData({...formData, premium: e.target.value})}
                      placeholder="5000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày bắt đầu *</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày kết thúc *</Label>
                    <Input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Chi tiết bảo hiểm</Label>
                    <Textarea
                      value={formData.coverage_details}
                      onChange={(e) => setFormData({...formData, coverage_details: e.target.value})}
                      placeholder="Mô tả phạm vi bảo hiểm..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">Lưu thông tin</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Tổng hợp đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{insurances.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đang hiệu lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sắp hết hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{expiringCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng phí/năm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalPremium)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách hợp đồng bảo hiểm</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Số HĐ</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Phí BH</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : filteredInsurances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                filteredInsurances.map((insurance) => (
                  <TableRow key={insurance.id}>
                    <TableCell className="font-medium">{insurance.vehicle_plate}</TableCell>
                    <TableCell>{insurance.policy_number}</TableCell>
                    <TableCell>{insurance.provider}</TableCell>
                    <TableCell>{insurance.start_date}</TableCell>
                    <TableCell>{insurance.expiry_date}</TableCell>
                    <TableCell>{insurance.premium ? formatCurrency(insurance.premium) : '-'}</TableCell>
                    <TableCell>{getStatusBadge(insurance.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Chi tiết</Button>
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
