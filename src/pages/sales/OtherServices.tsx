import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const OtherServices = () => {
  const services = [
    { name: 'Dịch vụ vệ sinh xe', orders: 23, revenue: '12.5M' },
    { name: 'Bảo dưỡng định kỳ', orders: 15, revenue: '45.2M' },
    { name: 'Lắp đặt thiết bị', orders: 8, revenue: '18.7M' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dịch vụ khác</h1>
          <p className="text-muted-foreground mt-1">
            Các dịch vụ bổ sung khác
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm dịch vụ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn hàng</span>
                  <span className="font-bold">{service.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doanh thu</span>
                  <span className="font-bold">{service.revenue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OtherServices;
