import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Route } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RouteItem {
  id: string;
  name: string;
  from_location: string;
  to_location: string;
  distance_km: number;
  estimated_duration: number;
  description?: string;
  is_active: boolean;
}

export default function RouteManagement() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    estimatedDuration: '',
    description: ''
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRoute) {
        const { error } = await supabase
          .from('routes')
          .update({
            name: formData.name,
            from_location: formData.startPoint,
            to_location: formData.endPoint,
            distance_km: parseFloat(formData.distance),
            estimated_duration: parseInt(formData.estimatedDuration),
            description: formData.description
          })
          .eq('id', editingRoute.id);

        if (error) throw error;
        
        toast({
          title: 'Cập nhật thành công',
          description: `Đã cập nhật hành trình ${formData.name}`
        });
      } else {
        const { error } = await supabase
          .from('routes')
          .insert([{
            name: formData.name,
            from_location: formData.startPoint,
            to_location: formData.endPoint,
            distance_km: parseFloat(formData.distance),
            estimated_duration: parseInt(formData.estimatedDuration),
            description: formData.description,
            is_active: true
          }]);

        if (error) throw error;
        
        toast({
          title: 'Thêm thành công',
          description: `Đã thêm hành trình ${formData.name}`
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRoutes();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (route: RouteItem) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      startPoint: route.from_location,
      endPoint: route.to_location,
      distance: route.distance_km.toString(),
      estimatedDuration: route.estimated_duration.toString(),
      description: route.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Xóa thành công',
        description: 'Đã xóa hành trình'
      });
      fetchRoutes();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startPoint: '',
      endPoint: '',
      distance: '',
      estimatedDuration: '',
      description: ''
    });
    setEditingRoute(null);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Hành trình</h1>
          <p className="text-muted-foreground mt-2">
            Định nghĩa các tuyến đường và khoảng cách cho booking
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm hành trình
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? 'Chỉnh sửa hành trình' : 'Thêm hành trình mới'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Tên hành trình *</Label>
                  <Input
                    id="name"
                    placeholder="VD: HCM - Vũng Tàu"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startPoint">Điểm đi *</Label>
                  <Input
                    id="startPoint"
                    placeholder="TP. Hồ Chí Minh"
                    value={formData.startPoint}
                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endPoint">Điểm đến *</Label>
                  <Input
                    id="endPoint"
                    placeholder="Vũng Tàu"
                    value={formData.endPoint}
                    onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Số km *</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="125"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Thời gian ước tính (phút) *</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    placeholder="120"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input
                    id="description"
                    placeholder="Thông tin bổ sung về tuyến đường..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingRoute ? 'Cập nhật' : 'Thêm'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{routes.length}</div>
              <div className="text-sm text-muted-foreground">Tổng hành trình</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {routes.filter(r => r.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Đang hoạt động</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + r.distance_km, 0) / routes.length) : 0}
              </div>
              <div className="text-sm text-muted-foreground">TB km/hành trình</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {routes.reduce((sum, r) => sum + r.distance_km, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Tổng km</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Danh sách hành trình
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HT</TableHead>
                <TableHead>Tên hành trình</TableHead>
                <TableHead>Điểm đi</TableHead>
                <TableHead>Điểm đến</TableHead>
                <TableHead>Số km</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : routes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Chưa có hành trình nào</TableCell>
                </TableRow>
              ) : (
                routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.name.split('-')[0]}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{route.name}</p>
                        {route.description && (
                          <p className="text-xs text-muted-foreground">{route.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-green-600" />
                        <span className="text-sm">{route.from_location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span className="text-sm">{route.to_location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{route.distance_km} km</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDuration(route.estimated_duration)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={route.is_active ? 'default' : 'secondary'}>
                        {route.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(route)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}