import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, Star, Phone, Car } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  assignmentType: 'dedicated' | 'flexible';
  assignedVehicle?: string;
  status: 'available' | 'driving' | 'rest';
  rating: number;
  experience: string;
}

const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    license: 'B2, C, E',
    assignmentType: 'dedicated',
    assignedVehicle: '30A-123.45 (7 chỗ)',
    status: 'available',
    rating: 4.8,
    experience: '5 năm'
  },
  {
    id: 'D002',
    name: 'Trần Văn B',
    phone: '0987654321',
    license: 'B2, C',
    assignmentType: 'flexible',
    status: 'driving',
    rating: 4.5,
    experience: '3 năm'
  },
  {
    id: 'D003',
    name: 'Lê Văn C',
    phone: '0912345678',
    license: 'B2, C, D, E',
    assignmentType: 'dedicated',
    assignedVehicle: '51B-678.90 (16 chỗ)',
    status: 'rest',
    rating: 4.9,
    experience: '8 năm'
  }
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'dedicated' | 'flexible'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    profile_id: '',
    license_number: '',
    license_type: '',
    license_expiry: '',
    experience_years: '',
    emergency_contact: '',
    emergency_phone: '',
    notes: ''
  });

  useEffect(() => {
    fetchDrivers();
    fetchProfiles();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        profiles:profile_id (
          id,
          full_name,
          phone,
          employee_code
        )
      `);
    
    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách lái xe',
        variant: 'destructive'
      });
      return;
    }

    const statusMap: Record<string, 'available' | 'driving' | 'rest'> = {
      'available': 'available',
      'on_trip': 'driving',
      'off_duty': 'rest',
      'leave': 'rest'
    };

    const mappedDrivers = data?.map(d => ({
      id: d.profiles?.employee_code || d.id,
      name: d.profiles?.full_name || '',
      phone: d.profiles?.phone || '',
      license: `${d.license_type}`,
      assignmentType: 'flexible' as const,
      status: statusMap[d.status] || 'available',
      rating: d.rating || 5.0,
      experience: `${d.experience_years} năm`
    })) || [];

    setDrivers(mappedDrivers);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, employee_code')
      .order('full_name');
    
    if (data) setProfiles(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('drivers')
        .insert({
          profile_id: formData.profile_id,
          license_number: formData.license_number,
          license_type: formData.license_type,
          license_expiry: formData.license_expiry,
          experience_years: parseInt(formData.experience_years),
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone,
          notes: formData.notes,
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã thêm lái xe mới'
      });

      setIsDialogOpen(false);
      setFormData({
        profile_id: '',
        license_number: '',
        license_type: '',
        license_expiry: '',
        experience_years: '',
        emergency_contact: '',
        emergency_phone: '',
        notes: ''
      });
      fetchDrivers();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    filterType === 'all' ? true : d.assignmentType === filterType
  );

  const statusConfig = {
    available: { label: 'Sẵn sàng', color: 'default' },
    driving: { label: 'Đang lái', color: 'secondary' },
    rest: { label: 'Nghỉ ngơi', color: 'outline' }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Lái xe</h1>
          <p className="text-muted-foreground mt-1">Quản lý lái xe cố định và linh hoạt</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm lái xe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm lái xe mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile_id">Nhân viên *</Label>
                  <Select value={formData.profile_id} onValueChange={(value) => setFormData({...formData, profile_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.employee_code} - {profile.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_number">Số bằng lái *</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_type">Hạng bằng lái *</Label>
                  <Input
                    id="license_type"
                    value={formData.license_type}
                    onChange={(e) => setFormData({...formData, license_type: e.target.value})}
                    placeholder="B2, C, D, E"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_expiry">Ngày hết hạn *</Label>
                  <Input
                    id="license_expiry"
                    type="date"
                    value={formData.license_expiry}
                    onChange={(e) => setFormData({...formData, license_expiry: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Số năm kinh nghiệm *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Người liên hệ khẩn cấp</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="emergency_phone">SĐT khẩn cấp</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng lái xe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{drivers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lái xe cố định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {drivers.filter(d => d.assignmentType === 'dedicated').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lái xe linh hoạt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {drivers.filter(d => d.assignmentType === 'flexible').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {drivers.filter(d => d.status === 'driving').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách lái xe</CardTitle>
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="dedicated">Cố định</TabsTrigger>
                <TabsTrigger value="flexible">Linh hoạt</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã LX</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Bằng lái</TableHead>
                <TableHead>Loại phân công</TableHead>
                <TableHead>Xe được gán</TableHead>
                <TableHead>Kinh nghiệm</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{driver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{driver.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{driver.license}</TableCell>
                  <TableCell>
                    <Badge variant={driver.assignmentType === 'dedicated' ? 'default' : 'secondary'}>
                      {driver.assignmentType === 'dedicated' ? 'Cố định' : 'Linh hoạt'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {driver.assignedVehicle ? (
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-primary" />
                        <span className="text-sm">{driver.assignedVehicle}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Chưa gán</span>
                    )}
                  </TableCell>
                  <TableCell>{driver.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{driver.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[driver.status].color as any}>
                      {statusConfig[driver.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}