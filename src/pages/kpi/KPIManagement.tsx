import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const KPIManagement = () => {
  const [kpis, setKpis] = useState([
    {
      id: 1,
      name: 'Doanh thu tháng',
      type: 'Định lượng',
      unit: 'VNĐ',
      weight: 30,
      target: '1,250,000,000',
      actual: '1,150,000,000',
      score: 92,
      department: 'Kinh doanh'
    },
    {
      id: 2,
      name: 'Tỷ lệ chuyến đúng giờ',
      type: 'Định lượng',
      unit: '%',
      weight: 25,
      target: '95',
      actual: '92',
      score: 97,
      department: 'Điều hành'
    },
    {
      id: 3,
      name: 'Mức độ hài lòng KH',
      type: 'Định tính',
      unit: 'Điểm',
      weight: 20,
      target: '4.5',
      actual: '4.3',
      score: 96,
      department: 'Kinh doanh'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý KPI</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm KPI mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm KPI mới</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="kpiName">Tên KPI</Label>
                  <Input id="kpiName" placeholder="Doanh thu tháng" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại KPI</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quantitative">Định lượng</SelectItem>
                      <SelectItem value="qualitative">Định tính</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Đơn vị</Label>
                  <Input id="unit" placeholder="VNĐ, %, Điểm..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Trọng số (%)</Label>
                  <Input id="weight" type="number" min="0" max="100" placeholder="30" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Chỉ tiêu</Label>
                  <Input id="target" placeholder="1,250,000,000" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Kinh doanh</SelectItem>
                      <SelectItem value="operations">Điều hành</SelectItem>
                      <SelectItem value="transport">Vận tải</SelectItem>
                      <SelectItem value="accounting">Kế toán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu KPI</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách KPI</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên KPI</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Trọng số</TableHead>
                <TableHead>Chỉ tiêu</TableHead>
                <TableHead>Thực tế</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi) => (
                <TableRow key={kpi.id}>
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell>{kpi.type}</TableCell>
                  <TableCell>{kpi.unit}</TableCell>
                  <TableCell>{kpi.weight}%</TableCell>
                  <TableCell>{kpi.target}</TableCell>
                  <TableCell>{kpi.actual}</TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">{kpi.score}</span>
                  </TableCell>
                  <TableCell>{kpi.department}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Cập nhật</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIManagement;
