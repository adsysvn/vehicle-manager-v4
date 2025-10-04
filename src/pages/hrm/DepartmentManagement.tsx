import { Plus, Users, Edit, Trash2, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DepartmentManagement = () => {
  const departments = [
    {
      id: '1',
      name: 'Kinh doanh',
      code: 'SALES',
      manager: 'Nguyễn Văn A',
      employees: 12,
      description: 'Phòng kinh doanh và chăm sóc khách hàng',
      location: 'Tầng 3'
    },
    {
      id: '2',
      name: 'Điều hành',
      code: 'OPS',
      manager: 'Trần Thị B',
      employees: 8,
      description: 'Phòng điều hành xe và GPS',
      location: 'Tầng 2'
    },
    {
      id: '3',
      name: 'Vận tải',
      code: 'TRANSPORT',
      manager: 'Lê Văn C',
      employees: 45,
      description: 'Phòng quản lý xe và lái xe',
      location: 'Bãi xe'
    },
    {
      id: '4',
      name: 'Kế toán',
      code: 'ACC',
      manager: 'Phạm Thị D',
      employees: 6,
      description: 'Phòng kế toán và tài chính',
      location: 'Tầng 3'
    },
    {
      id: '5',
      name: 'Nhân sự',
      code: 'HRM',
      manager: 'Hoàng Văn E',
      employees: 4,
      description: 'Phòng quản lý nhân sự',
      location: 'Tầng 2'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Phòng ban</h1>
          <p className="text-muted-foreground mt-1">
            Cấu trúc tổ chức và phân chia phòng ban
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm phòng ban
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
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
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <CardTitle>{dept.name}</CardTitle>
                  <Badge variant="outline">{dept.code}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {dept.description}
                </p>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Trưởng phòng</p>
                  <p className="font-medium">{dept.manager}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Vị trí</p>
                  <p className="font-medium">{dept.location}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">Nhân viên</span>
                  <span className="text-2xl font-bold">{dept.employees}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;