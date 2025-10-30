import { useState } from 'react';
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

interface RouteItem {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number; // km
  estimatedDuration: number; // minutes
  description?: string;
  isActive: boolean;
}

const mockRoutes: RouteItem[] = [
  {
    id: 'RT001',
    name: 'HCM - Vũng Tàu',
    startPoint: 'TP. Hồ Chí Minh',
    endPoint: 'Vũng Tàu',
    distance: 125,
    estimatedDuration: 120,
    description: 'Tuyến đường cao tốc TP.HCM - Long Thành - Dầu Giây',
    isActive: true
  },
  {
    id: 'RT002',
    name: 'HCM - Đà Lạt',
    startPoint: 'TP. Hồ Chí Minh',
    endPoint: 'Đà Lạt',
    distance: 308,
    estimatedDuration: 360,
    description: 'Tuyến đường đi qua Bảo Lộc',
    isActive: true
  },
  {
    id: 'RT003',
    name: 'HCM - Phan Thiết',
    startPoint: 'TP. Hồ Chí Minh',
    endPoint: 'Phan Thiết',
    distance: 200,
    estimatedDuration: 240,
    description: 'Tuyến đường ven biển',
    isActive: true
  },
  {
    id: 'RT004',
    name: 'Hà Nội - Hạ Long',
    startPoint: 'Hà Nội',
    endPoint: 'Hạ Long, Quảng Ninh',
    distance: 165,
    estimatedDuration: 180,
    description: 'Cao tốc Hà Nội - Hạ Long',
    isActive: true
  },
  {
    id: 'RT005',
    name: 'Hà Nội - Sapa',
    startPoint: 'Hà Nội',
    endPoint: 'Sapa, Lào Cai',
    distance: 315,
    estimatedDuration: 360,
    description: 'Tuyến đường qua Lào Cai',
    isActive: true
  }
];

export default function RouteManagement() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<RouteItem[]>(mockRoutes);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoute) {
      // Update existing route
      setRoutes(routes.map(r => 
        r.id === editingRoute.id 
          ? {
              ...r,
              name: formData.name,
              startPoint: formData.startPoint,
              endPoint: formData.endPoint,
              distance: parseFloat(formData.distance),
              estimatedDuration: parseInt(formData.estimatedDuration),
              description: formData.description
            }
          : r
      ));
      toast({
        title: 'Cập nhật thành công',
        description: `Đã cập nhật hành trình ${formData.name}`
      });
    } else {
      // Create new route
      const newRoute: RouteItem = {
        id: `RT${String(routes.length + 1).padStart(3, '0')}`,
        name: formData.name,
        startPoint: formData.startPoint,
        endPoint: formData.endPoint,
        distance: parseFloat(formData.distance),
        estimatedDuration: parseInt(formData.estimatedDuration),
        description: formData.description,
        isActive: true
      };
      setRoutes([...routes, newRoute]);
      toast({
        title: 'Thêm thành công',
        description: `Đã thêm hành trình ${formData.name}`
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (route: RouteItem) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      distance: route.distance.toString(),
      estimatedDuration: route.estimatedDuration.toString(),
      description: route.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    toast({
      title: 'Xóa thành công',
      description: 'Đã xóa hành trình'
    });
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
                {routes.filter(r => r.isActive).length}
              </div>
              <div className="text-sm text-muted-foreground">Đang hoạt động</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(routes.reduce((sum, r) => sum + r.distance, 0) / routes.length)}
              </div>
              <div className="text-sm text-muted-foreground">TB km/hành trình</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {routes.reduce((sum, r) => sum + r.distance, 0).toLocaleString()}
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
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.id}</TableCell>
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
                      <span className="text-sm">{route.startPoint}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-600" />
                      <span className="text-sm">{route.endPoint}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{route.distance} km</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDuration(route.estimatedDuration)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={route.isActive ? 'default' : 'secondary'}>
                      {route.isActive ? 'Hoạt động' : 'Tạm dừng'}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}