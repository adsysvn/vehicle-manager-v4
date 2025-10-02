import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Employee {
  id: string;
  code: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const EmployeeList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const employees: Employee[] = [
    {
      id: '1',
      code: 'NV001',
      name: 'Nguyễn Văn A',
      position: 'Lái xe',
      department: 'Vận tải',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      code: 'NV002',
      name: 'Trần Thị B',
      position: 'Điều hành',
      department: 'Điều hành',
      phone: '0912345678',
      email: 'tranthib@example.com',
      status: 'active',
      joinDate: '2023-03-20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nhân viên</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin nhân viên trong công ty
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/hrm/employees/create')}>
          <Plus className="w-4 h-4" />
          Thêm nhân viên
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã NV</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Ngày vào</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.code}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status === 'active' ? 'Hoạt động' : 'Nghỉ việc'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
};

export default EmployeeList;
