import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Printer, Download, Calendar, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TravelDocumentPrintDialog from '@/components/operations/TravelDocumentPrintDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel } from '@/lib/exportToExcel';

interface TravelDocument {
  id: string;
  documentNumber: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  route: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  purpose: string;
  cargoType: string;
  cargoWeight?: number;
  passengerCount?: number;
  issuedBy: string;
  issuedDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

export default function TravelDocuments() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<TravelDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TravelDocument | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    documentNumber: '',
    vehicleId: '',
    driverId: '',
    route: '',
    departure: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    purpose: '',
    cargoType: 'Hành khách',
    passengerCount: '',
    cargoWeight: '',
    issuedBy: 'Phòng Điều hành'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch assignments with booking info to create travel documents
      const { data: assignments, error } = await supabase
        .from('vehicle_assignments')
        .select(`
          *,
          bookings!vehicle_assignments_booking_id_fkey (
            id, booking_number, pickup_location, dropoff_location, pickup_datetime, passenger_count, notes,
            customers!bookings_customer_id_fkey (name)
          ),
          vehicles!vehicle_assignments_vehicle_id_fkey (id, license_plate, brand, model),
          drivers!vehicle_assignments_driver_id_fkey (
            id,
            profiles!drivers_profile_id_fkey (full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const docs: TravelDocument[] = (assignments || []).map((a, idx) => {
        const booking = a.bookings;
        const today = new Date();
        const pickupDate = booking?.pickup_datetime ? new Date(booking.pickup_datetime) : today;
        let status: 'active' | 'completed' | 'cancelled' = 'active';
        if (pickupDate < today) status = 'completed';

        return {
          id: a.id,
          documentNumber: `GDĐ-${new Date().getFullYear()}-${String(idx + 1).padStart(3, '0')}`,
          vehicleId: a.vehicle_id,
          vehiclePlate: a.vehicles?.license_plate || 'N/A',
          driverName: a.drivers?.profiles?.full_name || 'N/A',
          route: `${booking?.pickup_location || ''} - ${booking?.dropoff_location || ''}`,
          departure: booking?.pickup_location || '',
          destination: booking?.dropoff_location || '',
          departureDate: booking?.pickup_datetime?.split('T')[0] || '',
          returnDate: booking?.pickup_datetime?.split('T')[0] || '',
          purpose: booking?.notes || 'Vận chuyển hành khách',
          cargoType: 'Hành khách',
          passengerCount: booking?.passenger_count || 0,
          issuedBy: 'Phòng Điều hành',
          issuedDate: a.created_at?.split('T')[0] || '',
          status
        };
      });

      setDocuments(docs);

      // Fetch vehicles and drivers for the form
      const [vehiclesRes, driversRes] = await Promise.all([
        supabase.from('vehicles').select('id, license_plate, brand, model, seats'),
        supabase.from('drivers').select('id, profiles!drivers_profile_id_fkey (full_name)')
      ]);

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
    setIsSubmitting(true);

    try {
      // For now, create a booking and assignment
      const vehicle = vehicles.find(v => v.id === formData.vehicleId);
      const driver = drivers.find(d => d.id === formData.driverId);

      toast({ 
        title: 'Thành công', 
        description: 'Giấy đi đường sẽ được tạo tự động khi phân xe cho booking' 
      });

      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = (doc: TravelDocument) => {
    setSelectedDocument(doc);
    setIsPrintDialogOpen(true);
  };

  const handleExport = () => {
    const exportData = filteredDocuments.map(doc => ({
      'Số GDĐ': doc.documentNumber,
      'Biển số xe': doc.vehiclePlate,
      'Lái xe': doc.driverName,
      'Tuyến đường': doc.route,
      'Điểm đi': doc.departure,
      'Điểm đến': doc.destination,
      'Ngày đi': doc.departureDate,
      'Ngày về': doc.returnDate,
      'Loại hàng': doc.cargoType,
      'Số HK': doc.passengerCount || '',
      'Người cấp': doc.issuedBy,
      'Ngày cấp': doc.issuedDate,
      'Trạng thái': doc.status === 'active' ? 'Đang hoạt động' : doc.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'
    }));
    exportToExcel(exportData, 'giay-di-duong');
  };

  const filteredDocuments = documents.filter(doc =>
    doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayDocs = documents.filter(d => d.issuedDate === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Giấy đi đường</h1>
          <p className="text-muted-foreground mt-1">Quản lý giấy đi đường cho trung tâm điều hành vận tải</p>
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
                Cấp giấy đi đường
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cấp giấy đi đường mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Số giấy đi đường</Label>
                    <Input 
                      id="documentNumber" 
                      placeholder="GDĐ-2024-003" 
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Xe vận chuyển *</Label>
                    <Select value={formData.vehicleId} onValueChange={(v) => setFormData({...formData, vehicleId: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn xe" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.license_plate} - {v.brand} {v.model} ({v.seats} chỗ)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lái xe *</Label>
                    <Select value={formData.driverId} onValueChange={(v) => setFormData({...formData, driverId: v})}>
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
                    <Label htmlFor="route">Tuyến đường</Label>
                    <Input 
                      id="route" 
                      placeholder="Hà Nội - Hải Phòng" 
                      value={formData.route}
                      onChange={(e) => setFormData({...formData, route: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departure">Điểm đi</Label>
                    <Input 
                      id="departure" 
                      placeholder="Hà Nội" 
                      value={formData.departure}
                      onChange={(e) => setFormData({...formData, departure: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Điểm đến</Label>
                    <Input 
                      id="destination" 
                      placeholder="Hải Phòng" 
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Ngày khởi hành</Label>
                    <Input 
                      id="departureDate" 
                      type="datetime-local" 
                      value={formData.departureDate}
                      onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Ngày dự kiến về</Label>
                    <Input 
                      id="returnDate" 
                      type="datetime-local" 
                      value={formData.returnDate}
                      onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loại hàng hóa/hành khách</Label>
                    <Select value={formData.cargoType} onValueChange={(v) => setFormData({...formData, cargoType: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hành khách">Hành khách</SelectItem>
                        <SelectItem value="Hàng hóa">Hàng hóa</SelectItem>
                        <SelectItem value="Hỗn hợp">Hỗn hợp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengerCount">Số hành khách</Label>
                    <Input 
                      id="passengerCount" 
                      type="number" 
                      placeholder="0" 
                      value={formData.passengerCount}
                      onChange={(e) => setFormData({...formData, passengerCount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoWeight">Trọng tải (kg)</Label>
                    <Input 
                      id="cargoWeight" 
                      type="number" 
                      placeholder="0" 
                      value={formData.cargoWeight}
                      onChange={(e) => setFormData({...formData, cargoWeight: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuedBy">Người cấp</Label>
                    <Input 
                      id="issuedBy" 
                      placeholder="Phòng Điều hành" 
                      value={formData.issuedBy}
                      onChange={(e) => setFormData({...formData, issuedBy: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="purpose">Mục đích chuyến đi</Label>
                    <Textarea 
                      id="purpose" 
                      placeholder="Mô tả mục đích và nội dung chuyến đi..."
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Cấp giấy đi đường'}
                  </Button>
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
              <FileText className="w-4 h-4 mr-2" />
              Tổng giấy đi đường
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tất cả giấy đi đường</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {documents.filter(d => d.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Chuyến đi đang diễn ra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {documents.filter(d => d.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Chuyến đã hoàn tất</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Giấy đi đường mới</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách giấy đi đường</CardTitle>
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
                <TableHead>Số GDĐ</TableHead>
                <TableHead>Xe</TableHead>
                <TableHead>Lái xe</TableHead>
                <TableHead>Tuyến đường</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Loại hàng</TableHead>
                <TableHead>Người cấp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Không có giấy đi đường nào</TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.documentNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{doc.vehiclePlate}</p>
                      </div>
                    </TableCell>
                    <TableCell>{doc.driverName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{doc.route}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.departure} → {doc.destination}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Đi: {doc.departureDate}</p>
                        <p className="text-muted-foreground">Về: {doc.returnDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <Badge variant="outline">{doc.cargoType}</Badge>
                        {doc.passengerCount && (
                          <p className="text-xs mt-1">{doc.passengerCount} người</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{doc.issuedBy}</p>
                        <p className="text-xs text-muted-foreground">{doc.issuedDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          doc.status === 'active' ? 'default' :
                          doc.status === 'completed' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {doc.status === 'active' ? 'Đang hoạt động' :
                         doc.status === 'completed' ? 'Hoàn thành' :
                         'Đã hủy'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePrint(doc)}
                          title="In giấy đi đường"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TravelDocumentPrintDialog
        document={selectedDocument}
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
      />
    </div>
  );
}
