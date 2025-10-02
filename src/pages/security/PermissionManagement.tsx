import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const PermissionManagement = () => {
  const modules = [
    {
      name: 'Kinh doanh',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Điều hành xe',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Quản lý vận tải',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Kế toán',
      permissions: ['view', 'create', 'edit', 'delete']
    },
    {
      name: 'Nhân sự',
      permissions: ['view', 'create', 'edit', 'delete']
    }
  ];

  const roles = ['Admin', 'Quản lý', 'Nhân viên'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phân quyền truy cập</h1>
        <p className="text-muted-foreground mt-1">
          Cấu hình quyền truy cập cho từng vai trò
        </p>
      </div>

      <div className="space-y-6">
        {roles.map((role) => (
          <Card key={role}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {role}
                  <Badge variant="secondary">{modules.length} modules</Badge>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{module.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {module.permissions.map((permission) => (
                        <div key={permission} className="flex items-center justify-between">
                          <label className="text-sm text-muted-foreground">
                            {permission === 'view' ? 'Xem' :
                             permission === 'create' ? 'Tạo mới' :
                             permission === 'edit' ? 'Sửa' :
                             permission === 'delete' ? 'Xóa' : permission}
                          </label>
                          <Switch 
                            defaultChecked={role === 'Admin' || (role === 'Quản lý' && permission !== 'delete')}
                            disabled={role === 'Admin'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PermissionManagement;
