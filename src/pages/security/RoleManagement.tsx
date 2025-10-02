import { useState } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const RoleManagement = () => {
  const roles = [
    {
      id: '1',
      name: 'Admin',
      description: 'Quản trị viên hệ thống',
      users: 2,
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Quản lý',
      description: 'Quản lý phòng ban',
      users: 5,
      permissions: ['view', 'edit', 'create']
    },
    {
      id: '3',
      name: 'Nhân viên',
      description: 'Nhân viên thường',
      users: 25,
      permissions: ['view']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý vai trò</h1>
          <p className="text-muted-foreground mt-1">
            Cấu hình vai trò và quyền truy cập hệ thống
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm vai trò
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Số người dùng</p>
                  <p className="text-2xl font-bold">{role.users}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Quyền hạn</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary">
                        {permission === 'all' ? 'Toàn quyền' :
                         permission === 'view' ? 'Xem' :
                         permission === 'edit' ? 'Sửa' :
                         permission === 'create' ? 'Tạo' : permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Sửa
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng theo vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Nguyễn Văn A</TableCell>
                <TableCell>admin@example.com</TableCell>
                <TableCell>
                  <Badge>Admin</Badge>
                </TableCell>
                <TableCell>IT</TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
