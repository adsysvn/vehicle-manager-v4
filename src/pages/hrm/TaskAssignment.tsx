import React, { useState } from 'react';
import { Plus, Search, Calendar, User, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn cấp';
  status: 'Chưa bắt đầu' | 'Đang thực hiện' | 'Đã hoàn thành' | 'Quá hạn';
  dueDate: string;
  completedDate?: string;
  progress: number;
}

const TaskAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Trung bình',
    dueDate: ''
  });

  const tasks: Task[] = [
    {
      id: 'T001',
      title: 'Kiểm tra hồ sơ xe 29A-12345',
      description: 'Kiểm tra và cập nhật hồ sơ bảo hiểm, đăng kiểm',
      assignedTo: 'Nguyễn Văn A',
      assignedBy: 'Trần Văn B',
      priority: 'Cao',
      status: 'Đang thực hiện',
      dueDate: '2024-01-15',
      progress: 60
    },
    {
      id: 'T002',
      title: 'Báo cáo doanh thu tháng 12',
      description: 'Tổng hợp và lập báo cáo doanh thu chi tiết',
      assignedTo: 'Phạm Thị C',
      assignedBy: 'Trần Văn B',
      priority: 'Khẩn cấp',
      status: 'Đang thực hiện',
      dueDate: '2024-01-10',
      progress: 80
    },
    {
      id: 'T003',
      title: 'Đào tạo lái xe mới',
      description: 'Hướng dẫn quy trình vận hành và an toàn',
      assignedTo: 'Lê Văn D',
      assignedBy: 'Trần Văn B',
      priority: 'Trung bình',
      status: 'Đã hoàn thành',
      dueDate: '2024-01-05',
      completedDate: '2024-01-04',
      progress: 100
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Khẩn cấp':
        return 'bg-red-500';
      case 'Cao':
        return 'bg-orange-500';
      case 'Trung bình':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Đã hoàn thành':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Đang thực hiện':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Quá hạn':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create task:', formData);
    setIsCreateOpen(false);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Trung bình',
      dueDate: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Giao việc</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi công việc được giao</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Giao việc mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Giao việc mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề công việc</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nhập tiêu đề công việc"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả chi tiết</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết công việc"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giao cho</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhân viên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nv1">Nguyễn Văn A</SelectItem>
                      <SelectItem value="nv2">Phạm Thị C</SelectItem>
                      <SelectItem value="nv3">Lê Văn D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Độ ưu tiên</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thấp">Thấp</SelectItem>
                      <SelectItem value="Trung bình">Trung bình</SelectItem>
                      <SelectItem value="Cao">Cao</SelectItem>
                      <SelectItem value="Khẩn cấp">Khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hạn hoàn thành</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Giao việc</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm công việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã CV</TableHead>
              <TableHead>Công việc</TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead>Người giao</TableHead>
              <TableHead>Độ ưu tiên</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Hạn hoàn thành</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {task.assignedTo}
                  </div>
                </TableCell>
                <TableCell>{task.assignedBy}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{task.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {task.dueDate}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className="text-sm">{task.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default TaskAssignment;
