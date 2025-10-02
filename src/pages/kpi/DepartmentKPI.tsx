import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DepartmentKPI = () => {
  const departments = [
    {
      name: 'Kinh doanh',
      kpis: [
        { name: 'Doanh thu tháng', target: '1.25 tỷ', actual: '1.15 tỷ', progress: 92 },
        { name: 'Tỷ lệ chốt hợp đồng', target: '60%', actual: '55%', progress: 92 },
        { name: 'Số khách hàng mới', target: '20', actual: '17', progress: 85 },
        { name: 'Mức độ hài lòng KH', target: '4.5/5', actual: '4.3/5', progress: 96 }
      ],
      overallScore: 91
    },
    {
      name: 'Điều hành xe',
      kpis: [
        { name: 'Tỷ lệ chuyến đúng giờ', target: '95%', actual: '92%', progress: 97 },
        { name: 'Số sự cố vận hành', target: '<5', actual: '7', progress: 60 },
        { name: 'Tỷ lệ tối ưu sử dụng xe', target: '85%', actual: '82%', progress: 96 },
        { name: 'Thời gian phản hồi booking', target: '<30 phút', actual: '25 phút', progress: 100 }
      ],
      overallScore: 88
    },
    {
      name: 'Vận tải',
      kpis: [
        { name: 'Tỷ lệ tuân thủ an toàn', target: '100%', actual: '98%', progress: 98 },
        { name: 'Chi phí nhiên liệu/km', target: '3,500đ', actual: '3,700đ', progress: 89 },
        { name: 'Số km chạy không tải', target: '<10%', actual: '12%', progress: 83 },
        { name: 'Tỷ lệ bảo dưỡng đúng hạn', target: '100%', actual: '95%', progress: 95 }
      ],
      overallScore: 91
    },
    {
      name: 'Kế toán',
      kpis: [
        { name: 'Thời gian xử lý hóa đơn', target: '<2 ngày', actual: '1.5 ngày', progress: 100 },
        { name: 'Độ chính xác báo cáo', target: '100%', actual: '99%', progress: 99 },
        { name: 'Chu kỳ công nợ TB', target: '<30 ngày', actual: '28 ngày', progress: 93 },
        { name: 'Hiệu quả quản lý chi phí', target: '-5%', actual: '-4%', progress: 80 }
      ],
      overallScore: 93
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">KPI Phòng ban</h1>

      <Tabs defaultValue="Kinh doanh" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {departments.map((dept) => (
            <TabsTrigger key={dept.name} value={dept.name}>
              {dept.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {departments.map((dept) => (
          <TabsContent key={dept.name} value={dept.name} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Tổng quan phòng {dept.name}</span>
                  <span className="text-2xl font-bold text-primary">{dept.overallScore} điểm</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dept.kpis.map((kpi, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{kpi.name}</span>
                        <span className="text-sm text-muted-foreground">{kpi.progress}%</span>
                      </div>
                      <Progress value={kpi.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Thực tế: {kpi.actual}</span>
                        <span>Mục tiêu: {kpi.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DepartmentKPI;
