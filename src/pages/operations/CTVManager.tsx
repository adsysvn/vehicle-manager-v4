import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Phone, Mail, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CTVManager = () => {
  const { toast } = useToast();
  const [ctvVehicles, setCtvVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    telegram_id: "",
    license_plate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    seats: 4,
    vehicle_type: "Sedan",
    status: "available",
    commission_rate: 15,
    notes: ""
  });

  useEffect(() => {
    fetchCTVVehicles();
  }, []);

  const fetchCTVVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ctv_vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCtvVehicles(data || []);
    } catch (error) {
      console.error('Error fetching CTV vehicles:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách xe CTV",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('ctv_vehicles')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Cập nhật thành công",
          description: "Thông tin xe CTV đã được cập nhật",
        });
      } else {
        const { error } = await supabase
          .from('ctv_vehicles')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Thêm thành công",
          description: "Xe CTV mới đã được thêm vào hệ thống",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchCTVVehicles();
    } catch (error) {
      console.error('Error saving CTV vehicle:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin xe CTV",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      owner_name: "",
      owner_phone: "",
      owner_email: "",
      telegram_id: "",
      license_plate: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      seats: 4,
      vehicle_type: "Sedan",
      status: "available",
      commission_rate: 15,
      notes: ""
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      available: { label: 'Sẵn sàng', variant: 'default' as const },
      busy: { label: 'Đang bận', variant: 'secondary' as const },
      inactive: { label: 'Không hoạt động', variant: 'outline' as const },
    };
    const c = config[status as keyof typeof config] || { label: status, variant: 'outline' as const };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý xe CTV</h1>
          <p className="text-muted-foreground mt-2">Quản lý đội xe cộng tác viên</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm xe CTV
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm xe CTV mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên chủ xe</Label>
                  <Input value={formData.owner_name} onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input value={formData.owner_phone} onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Biển số xe</Label>
                  <Input value={formData.license_plate} onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Số chỗ</Label>
                  <Input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Thêm</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách xe CTV</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số</TableHead>
                <TableHead>Chủ xe</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Số chỗ</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ctvVehicles.map((ctv) => (
                <TableRow key={ctv.id}>
                  <TableCell className="font-medium">{ctv.license_plate}</TableCell>
                  <TableCell>{ctv.owner_name}</TableCell>
                  <TableCell>{ctv.owner_phone}</TableCell>
                  <TableCell>{ctv.seats} chỗ</TableCell>
                  <TableCell>{getStatusBadge(ctv.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CTVManager;