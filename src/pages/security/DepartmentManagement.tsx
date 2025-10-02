import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DepartmentManagement = () => {
  const departments = [
    {
      id: '1',
      name: 'Kinh doanh',
      manager: 'Nguyễn Văn A',
      employees: 12,
      description: 'Phòng kinh doanh và chăm sóc khách hàng'
    },
    {
      id: '2',
      name: 'Điều hành',
      manager: 'Trần Thị B',
      employees: 8,
      description: 'Phòng điều hành xe và GPS'
    },
    {
      id: '3',
      name: 'Vận tải',
      manager: 'Lê Văn C',
      employees: 45,
      description: 'Phòng quản lý xe và lái xe'
    },
    {
      id: '4',
      name: 'Kế toán',
      manager: 'Phạm Thị D',
      employees: 6,
      description: 'Phòng kế toán và tài chính'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý phòng ban</h1>
          <p className="text-muted-foreground mt-1">
            Cấu trúc tổ chức và phân chia phòng ban
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm phòng ban
        </Button>
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
