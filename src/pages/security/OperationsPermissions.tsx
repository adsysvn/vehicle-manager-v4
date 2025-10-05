import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DepartmentPermission {
  id: string;
  departmentName: string;
  departmentCode: string;
  allowedVehicleTypes: string[];
}

const availableVehicleTypes = [
  '4 chỗ',
  '7 chỗ',
  '16 chỗ',
  '29 chỗ',
  '35 chỗ',
  '45 chỗ',
  'Xe tải 5 tấn',
  'Xe tải 10 tấn',
  'Xe container'
];

const mockDepartments: DepartmentPermission[] = [
  {
    id: 'DEP001',
    departmentName: 'Bộ phận điều hành xe du lịch',
    departmentCode: 'OPS-TOUR',
    allowedVehicleTypes: ['7 chỗ', '16 chỗ', '29 chỗ', '35 chỗ', '45 chỗ']
  },
  {
    id: 'DEP002',
    departmentName: 'Bộ phận điều hành xe tải',
    departmentCode: 'OPS-TRUCK',
    allowedVehicleTypes: ['Xe tải 5 tấn', 'Xe tải 10 tấn', 'Xe container']
  },
  {
    id: 'DEP003',
    departmentName: 'Bộ phận điều hành VIP',
    departmentCode: 'OPS-VIP',
    allowedVehicleTypes: ['4 chỗ', '7 chỗ', '16 chỗ']
  }
];

export default function OperationsPermissions() {
  const [departments, setDepartments] = useState<DepartmentPermission[]>(mockDepartments);
  const { toast } = useToast();

  const toggleVehicleType = (departmentId: string, vehicleType: string) => {
    setDepartments(prev => prev.map(dept => {
      if (dept.id !== departmentId) return dept;
      
      const hasType = dept.allowedVehicleTypes.includes(vehicleType);
      return {
        ...dept,
        allowedVehicleTypes: hasType
          ? dept.allowedVehicleTypes.filter(t => t !== vehicleType)
          : [...dept.allowedVehicleTypes, vehicleType]
      };
    }));
  };

  const handleSave = () => {
    toast({
      title: 'Thành công',
      description: 'Đã lưu phân quyền quản lý dòng xe'
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Phân quyền quản lý dòng xe
          </h1>
          <p className="text-muted-foreground mt-1">
            Cấu hình quyền quản lý các dòng xe cho từng bộ phận điều hành
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phân quyền theo bộ phận</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{dept.departmentName}</h3>
                    <Badge variant="outline" className="mt-1">{dept.departmentCode}</Badge>
                  </div>
                  <Badge variant="secondary">
                    {dept.allowedVehicleTypes.length} dòng xe
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-3">Dòng xe được phép quản lý:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableVehicleTypes.map((vehicleType) => (
                      <div key={vehicleType} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${dept.id}-${vehicleType}`}
                          checked={dept.allowedVehicleTypes.includes(vehicleType)}
                          onCheckedChange={() => toggleVehicleType(dept.id, vehicleType)}
                        />
                        <label
                          htmlFor={`${dept.id}-${vehicleType}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {vehicleType}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    📌 Bộ phận này chỉ có thể xem và phân công các xe thuộc dòng đã được chọn
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan phân quyền</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã bộ phận</TableHead>
                <TableHead>Tên bộ phận</TableHead>
                <TableHead>Số dòng xe</TableHead>
                <TableHead>Dòng xe được quản lý</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.departmentCode}</TableCell>
                  <TableCell>{dept.departmentName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{dept.allowedVehicleTypes.length}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {dept.allowedVehicleTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
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
