import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const IndividualKPI = () => {
  const employees = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      position: 'Nhân viên kinh doanh',
      department: 'Kinh doanh',
      avatar: 'NVA',
      kpis: [
        { name: 'Doanh thu cá nhân', target: '300tr', actual: '285tr', progress: 95 },
        { name: 'Số hợp đồng mới', target: '8', actual: '7', progress: 88 },
        { name: 'Chăm sóc khách hàng', target: '50', actual: '48', progress: 96 }
      ],
      overallScore: 93,
      rank: 2
    },
    {
      id: 2,
      name: 'Trần Thị B',
      position: 'Điều hành viên',
      department: 'Điều hành',
      avatar: 'TTB',
      kpis: [
        { name: 'Chuyến xe xử lý', target: '100', actual: '105', progress: 105 },
        { name: 'Tỷ lệ đúng giờ', target: '95%', actual: '97%', progress: 102 },
        { name: 'Xử lý sự cố', target: '<3', actual: '2', progress: 100 }
      ],
      overallScore: 102,
      rank: 1
    },
    {
      id: 3,
      name: 'Lê Văn C',
      position: 'Kế toán viên',
      department: 'Kế toán',
      avatar: 'LVC',
      kpis: [
        { name: 'Hóa đơn xử lý', target: '200', actual: '195', progress: 98 },
        { name: 'Độ chính xác', target: '100%', actual: '99%', progress: 99 },
        { name: 'Thu hồi công nợ', target: '50tr', actual: '48tr', progress: 96 }
      ],
      overallScore: 98,
      rank: 3
    }
  ];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500">🥇 Top 1</Badge>;
      case 2:
        return <Badge className="bg-gray-400">🥈 Top 2</Badge>;
      case 3:
        return <Badge className="bg-orange-600">🥉 Top 3</Badge>;
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">KPI Cá nhân</h1>

      <div className="grid grid-cols-1 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{employee.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{employee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {employee.position} - {employee.department}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  {getRankBadge(employee.rank)}
                  <div className="text-2xl font-bold text-primary">{employee.overallScore} điểm</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {employee.kpis.map((kpi, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{kpi.name}</span>
                      <span className="text-xs text-muted-foreground">{kpi.progress}%</span>
                    </div>
                    <Progress value={Math.min(kpi.progress, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Thực tế: {kpi.actual}</span>
                      <span>Mục tiêu: {kpi.target}</span>
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

export default IndividualKPI;
