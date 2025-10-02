import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Cog, GraduationCap } from 'lucide-react';

const BSCPerspectives = () => {
  const perspectives = [
    {
      id: 1,
      title: 'Tài chính',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      objectives: [
        { name: 'Tăng doanh thu 30%', target: '15 tỷ', current: '11.5 tỷ', progress: 77 },
        { name: 'Lợi nhuận ròng 15%', target: '15%', current: '12%', progress: 80 },
        { name: 'Giảm chi phí vận hành 10%', target: '-10%', current: '-7%', progress: 70 }
      ]
    },
    {
      id: 2,
      title: 'Khách hàng',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      objectives: [
        { name: 'Mức độ hài lòng KH', target: '90%', current: '87%', progress: 97 },
        { name: 'Tỷ lệ giữ chân KH', target: '85%', current: '82%', progress: 96 },
        { name: 'Số khách hàng mới', target: '50', current: '38', progress: 76 }
      ]
    },
    {
      id: 3,
      title: 'Quy trình nội bộ',
      icon: Cog,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      objectives: [
        { name: 'Thời gian xử lý booking', target: '-20%', current: '-15%', progress: 75 },
        { name: 'Tỷ lệ chuyến đúng giờ', target: '95%', current: '92%', progress: 97 },
        { name: 'Số sự cố vận hành', target: '<5', current: '7', progress: 60 }
      ]
    },
    {
      id: 4,
      title: 'Học hỏi & Phát triển',
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      objectives: [
        { name: 'Giờ đào tạo/nhân viên', target: '40h', current: '32h', progress: 80 },
        { name: 'Tỷ lệ nhân viên được đào tạo', target: '100%', current: '85%', progress: 85 },
        { name: 'Số sáng kiến cải tiến', target: '20', current: '15', progress: 75 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mục tiêu BSC</h1>
        <p className="text-muted-foreground mt-2">
          Balanced Scorecard - 4 góc nhìn chiến lược
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {perspectives.map((perspective) => {
          const Icon = perspective.icon;
          return (
            <Card key={perspective.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${perspective.bgColor}`}>
                    <Icon className={`w-6 h-6 ${perspective.color}`} />
                  </div>
                  <CardTitle>{perspective.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {perspective.objectives.map((obj, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">{obj.name}</span>
                      <Badge variant="outline">{obj.progress}%</Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Hiện tại: {obj.current}</span>
                      <span>Mục tiêu: {obj.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${perspective.color.replace('text-', 'bg-')}`}
                        style={{ width: `${obj.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BSCPerspectives;
