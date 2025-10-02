import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target } from 'lucide-react';

const CompanyStrategy = () => {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      title: 'Tăng trưởng doanh thu',
      description: 'Tăng doanh thu 30% trong năm 2024',
      perspective: 'Tài chính',
      owner: 'Ban Giám đốc',
      deadline: '2024-12-31',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Mở rộng thị trường',
      description: 'Mở rộng thị trường sang 3 tỉnh miền Trung',
      perspective: 'Khách hàng',
      owner: 'Phòng Kinh doanh',
      deadline: '2024-09-30',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Tối ưu quy trình vận hành',
      description: 'Giảm 20% thời gian xử lý booking',
      perspective: 'Quy trình nội bộ',
      owner: 'Phòng Điều hành',
      deadline: '2024-06-30',
      status: 'completed'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Chiến lược công ty</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm mục tiêu chiến lược
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm mục tiêu chiến lược</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" placeholder="Tăng trưởng doanh thu" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea id="description" placeholder="Mô tả mục tiêu..." rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="perspective">Góc nhìn BSC</Label>
                  <Input id="perspective" placeholder="Tài chính" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Người chịu trách nhiệm</Label>
                  <Input id="owner" placeholder="Ban Giám đốc" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Thời hạn</Label>
                  <Input id="deadline" type="date" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu mục tiêu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tài chính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {strategies.filter(s => s.perspective === 'Tài chính').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">mục tiêu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {strategies.filter(s => s.perspective === 'Khách hàng').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">mục tiêu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quy trình nội bộ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {strategies.filter(s => s.perspective === 'Quy trình nội bộ').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">mục tiêu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Học hỏi & Phát triển</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {strategies.filter(s => s.perspective === 'Học hỏi & Phát triển').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">mục tiêu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <CardTitle>{strategy.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Chi tiết</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Góc nhìn:</span>
                  <p className="font-medium">{strategy.perspective}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Chịu trách nhiệm:</span>
                  <p className="font-medium">{strategy.owner}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Thời hạn:</span>
                  <p className="font-medium">{strategy.deadline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyStrategy;
