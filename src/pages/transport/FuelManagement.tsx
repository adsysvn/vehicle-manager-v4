import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fuel, Search, Plus, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

interface FuelRecord {
  id: string;
  vehicle_id: string;
  vehicle_plate: string;
  driver_name: string | null;
  date: string;
  liters: number;
  price_per_liter: number;
  total_cost: number;
  mileage: number | null;
  station_name: string | null;
}

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
}

interface Driver {
  id: string;
  profile: { full_name: string } | null;
}

export default function FuelManagement() {
  const { toast } = useToast();
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('23000');
  const [mileage, setMileage] = useState('');
  const [stationName, setStationName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch fuel records
      const { data: records, error: recError } = await supabase
        .from('fuel_records')
        .select(`
          *,
          vehicle:vehicles(license_plate),
          driver:drivers(profile:profiles(full_name))
        `)
        .order('date', { ascending: false });

      if (recError) throw recError;

      const formattedRecords: FuelRecord[] = (records || []).map(r => ({
        id: r.id,
        vehicle_id: r.vehicle_id,
        vehicle_plate: r.vehicle?.license_plate || 'N/A',
        driver_name: r.driver?.profile?.full_name || null,
        date: r.date?.split('T')[0] || '',
        liters: r.liters,
        price_per_liter: r.price_per_liter,
        total_cost: r.total_cost,
        mileage: r.mileage,
        station_name: r.station_name
      }));

      setFuelRecords(formattedRecords);

      // Fetch vehicles
      const { data: vehicleData } = await supabase
        .from('vehicles')
        .select('id, license_plate, brand, model')
        .eq('status', 'available');
      setVehicles(vehicleData || []);

      // Fetch drivers
      const { data: driverData } = await supabase
        .from('drivers')
        .select('id, profile:profiles(full_name)');
      setDrivers(driverData || []);

    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!vehicleId || !liters || !pricePerLiter) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin', variant: 'destructive' });
      return;
    }

    const totalCost = parseFloat(liters) * parseFloat(pricePerLiter);

    try {
      const { error } = await supabase.from('fuel_records').insert({
        vehicle_id: vehicleId,
        driver_id: driverId || null,
        date,
        liters: parseFloat(liters),
        price_per_liter: parseFloat(pricePerLiter),
        total_cost: totalCost,
        mileage: mileage ? parseFloat(mileage) : null,
        station_name: stationName || null
      });

      if (error) throw error;

      toast({ title: 'Thành công', description: 'Đã thêm phiếu nhiên liệu' });
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setVehicleId('');
    setDriverId('');
    setDate(new Date().toISOString().split('T')[0]);
    setLiters('');
    setPricePerLiter('23000');
    setMileage('');
    setStationName('');
  };

  const filteredRecords = fuelRecords.filter(record =>
    record.vehicle_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.driver_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (record.station_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalLiters = fuelRecords.reduce((sum, r) => sum + r.liters, 0);
  const totalCost = fuelRecords.reduce((sum, r) => sum + r.total_cost, 0);
  const avgPricePerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;

  const handleExport = () => {
    const exportData = filteredRecords.map(r => ({
      'Ngày': r.date,
      'Biển số': r.vehicle_plate,
      'Lái xe': r.driver_name || '',
      'Số lít': r.liters,
      'Giá/lít': r.price_per_liter,
      'Tổng tiền': r.total_cost,
      'Số km': r.mileage || '',
      'Cửa hàng': r.station_name || ''
    }));
    exportToExcel(exportData, 'quan-ly-nhien-lieu');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nhiên liệu</h1>
          <p className="text-muted-foreground mt-1">Theo dõi chi phí nhiên liệu và hiệu suất</p>
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
                Thêm phiếu nhiên liệu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm phiếu nhiên liệu</DialogTitle>
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
                  <Label>Lái xe</Label>
                  <Select value={driverId} onValueChange={setDriverId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lái xe" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.profile?.full_name || 'N/A'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày *</Label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số lít *</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={liters}
                      onChange={(e) => setLiters(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Giá/lít (VNĐ) *</Label>
                    <Input 
                      type="number" 
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Số km hiện tại</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cửa hàng xăng</Label>
                  <Input 
                    placeholder="Tên cửa hàng" 
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                  />
                </div>
                {liters && pricePerLiter && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Tổng tiền:</p>
                    <p className="text-xl font-bold text-primary">
                      {(parseFloat(liters) * parseFloat(pricePerLiter)).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                )}
                <Button className="w-full" onClick={handleSubmit}>Thêm phiếu</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng chi phí</p>
              <p className="text-2xl font-bold text-foreground">{totalCost.toLocaleString('vi-VN')} đ</p>
            </div>
            <Fuel className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingDown className="w-4 h-4" />
            <span>So với tháng trước</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng số lít</p>
              <p className="text-2xl font-bold text-foreground">{totalLiters.toLocaleString('vi-VN')} L</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Giá TB/lít</p>
              <p className="text-2xl font-bold text-foreground">{avgPricePerLiter.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
            <TrendingUp className="w-4 h-4" />
            <span>Giá xăng tăng</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Số lần đổ xăng</p>
              <p className="text-2xl font-bold text-foreground">{fuelRecords.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo biển số, lái xe, cửa hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Lái xe</TableHead>
                  <TableHead>Số lít</TableHead>
                  <TableHead>Giá/lít</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Số km</TableHead>
                  <TableHead>Cửa hàng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Không có dữ liệu</TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="font-medium">{record.vehicle_plate}</TableCell>
                      <TableCell>{record.driver_name || '-'}</TableCell>
                      <TableCell>{record.liters} L</TableCell>
                      <TableCell>{record.price_per_liter.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell className="font-medium">{record.total_cost.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell>{record.mileage?.toLocaleString('vi-VN') || '-'} km</TableCell>
                      <TableCell>{record.station_name || '-'}</TableCell>
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
