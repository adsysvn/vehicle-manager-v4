import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const PositionManagement = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    level: '',
    department_id: '',
    description: '',
    min_salary: '',
    max_salary: ''
  });

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, []);

  const fetchPositions = async () => {
    const { data, error } = await supabase
      .from('positions')
      .select(`
        *,
        departments!positions_department_id_fkey (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách chức vụ',
        variant: 'destructive'
      });
      return;
    }

    setPositions(data || []);
  };

  const fetchDepartments = async () => {
    const { data } = await supabase
      .from('departments')
      .select('id, name, code')
      .order('name');
    
    if (data) setDepartments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('positions')
        .insert({
          code: formData.code,
          name: formData.name,
          level: formData.level || null,
          department_id: formData.department_id || null,
          description: formData.description || null,
          min_salary: formData.min_salary ? parseFloat(formData.min_salary) : null,
          max_salary: formData.max_salary ? parseFloat(formData.max_salary) : null
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã thêm chức vụ mới'
      });

      setIsDialogOpen(false);
      setFormData({
        code: '',
        name: '',
        level: '',
        department_id: '',
        description: '',
        min_salary: '',
        max_salary: ''
      });
      fetchPositions();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý chức vụ</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các vị trí và chức danh trong công ty
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm chức vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm chức vụ mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã chức vụ *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="VD: TP, PTP, NV..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Tên chức vụ *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="VD: Trưởng phòng, Nhân viên..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Cấp bậc</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp bậc" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lãnh đạo">Lãnh đạo</SelectItem>
                      <SelectItem value="Quản lý">Quản lý</SelectItem>
                      <SelectItem value="Chuyên viên">Chuyên viên</SelectItem>
                      <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department_id">Phòng ban</Label>
                  <Select value={formData.department_id} onValueChange={(value) => setFormData({...formData, department_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_salary">Lương tối thiểu (VNĐ)</Label>
                  <Input
                    id="min_salary"
                    type="number"
                    value={formData.min_salary}
                    onChange={(e) => setFormData({...formData, min_salary: e.target.value})}
                    placeholder="10000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_salary">Lương tối đa (VNĐ)</Label>
                  <Input
                    id="max_salary"
                    type="number"
                    value={formData.max_salary}
                    onChange={(e) => setFormData({...formData, max_salary: e.target.value})}
                    placeholder="20000000"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Mô tả công việc</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.map((pos) => (
          <Card key={pos.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-4">{pos.name}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{pos.code}</Badge>
                {pos.level && <Badge variant="secondary">{pos.level}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pos.description && (
                  <p className="text-sm text-muted-foreground">
                    {pos.description}
                  </p>
                )}
                {pos.departments && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Phòng ban</p>
                    <p className="font-medium">{pos.departments.name}</p>
                  </div>
                )}
                {(pos.min_salary || pos.max_salary) && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Khung lương</p>
                    <p className="font-medium text-success">
                      {pos.min_salary ? formatCurrency(pos.min_salary) : 'N/A'} - {pos.max_salary ? formatCurrency(pos.max_salary) : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {positions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Chưa có chức vụ nào. Nhấn "Thêm chức vụ" để bắt đầu.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PositionManagement;
