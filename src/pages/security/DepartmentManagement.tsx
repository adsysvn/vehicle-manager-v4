import { useState, useEffect } from 'react';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    manager_id: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchProfiles();
  }, []);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        manager:manager_id (
          id,
          full_name
        ),
        profiles!profiles_department_id_fkey (count)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách phòng ban',
        variant: 'destructive'
      });
      return;
    }

    setDepartments(data || []);
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
        .from('departments')
        .insert({
          code: formData.code,
          name: formData.name,
          description: formData.description,
          manager_id: formData.manager_id || null
        });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đã thêm phòng ban mới'
      });

      setIsDialogOpen(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        manager_id: ''
      });
      fetchDepartments();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý phòng ban</h1>
          <p className="text-muted-foreground mt-1">
            Cấu trúc tổ chức và phân chia phòng ban
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm phòng ban
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm phòng ban mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã phòng ban *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="VD: KD, HC, KT..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Tên phòng ban *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="manager_id">Trưởng phòng</Label>
                  <Select value={formData.manager_id} onValueChange={(value) => setFormData({...formData, manager_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trưởng phòng" />
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

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
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
              <CardTitle className="mt-4">{dept.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{dept.code}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {dept.description}
                </p>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Trưởng phòng</p>
                  <p className="font-medium">{dept.manager?.full_name || 'Chưa có'}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">Nhân viên</span>
                  <span className="text-2xl font-bold">{dept.profiles?.[0]?.count || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Chưa có phòng ban nào. Nhấn "Thêm phòng ban" để bắt đầu.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DepartmentManagement;
