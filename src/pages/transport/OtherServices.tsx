import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const OtherServices = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dịch vụ khác</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm dịch vụ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Quản lý các dịch vụ khác liên quan đến vận tải</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtherServices;
