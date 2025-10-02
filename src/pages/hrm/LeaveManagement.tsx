import { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
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

const LeaveManagement = () => {
  const leaveRequests = [
    {
      id: '1',
      employee: 'Nguyễn Văn A',
      type: 'Nghỉ phép năm',
      fromDate: '2024-01-15',
      toDate: '2024-01-17',
      days: 3,
      status: 'approved',
      reason: 'Về quê'
    },
    {
      id: '2',
      employee: 'Trần Thị B',
      type: 'Nghỉ ốm',
      fromDate: '2024-01-20',
      toDate: '2024-01-22',
      days: 3,
      status: 'pending',
      reason: 'Bị cảm'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý nghỉ phép</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý đơn xin nghỉ của nhân viên
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo đơn nghỉ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Đơn xin nghỉ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Đơn trong tháng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Đơn trong tháng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nghỉ hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Nhân viên</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn nghỉ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Loại nghỉ</TableHead>
                <TableHead>Từ ngày</TableHead>
                <TableHead>Đến ngày</TableHead>
                <TableHead>Số ngày</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.fromDate}</TableCell>
                  <TableCell>{request.toDate}</TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {request.status === 'approved' ? 'Đã duyệt' : 
                       request.status === 'pending' ? 'Chờ duyệt' : 
                       'Từ chối'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="default">Duyệt</Button>
                        <Button size="sm" variant="outline">Từ chối</Button>
                      </div>
                    )}
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

export default LeaveManagement;
