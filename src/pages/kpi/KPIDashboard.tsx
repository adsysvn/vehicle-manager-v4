import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

const KPIDashboard = () => {
  const monthlyData = [
    { month: 'T1', target: 1200, actual: 1150, score: 96 },
    { month: 'T2', target: 1200, actual: 1180, score: 98 },
    { month: 'T3', target: 1250, actual: 1150, score: 92 },
    { month: 'T4', target: 1250, actual: 1300, score: 104 },
    { month: 'T5', target: 1300, actual: 1280, score: 98 },
    { month: 'T6', target: 1300, actual: 1250, score: 96 }
  ];

  const departmentScores = [
    { department: 'Kinh doanh', score: 91 },
    { department: 'Điều hành', score: 88 },
    { department: 'Vận tải', score: 91 },
    { department: 'Kế toán', score: 93 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard KPI</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Điểm TB công ty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">91.5</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3.2% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Award className="w-4 h-4 mr-2" />
              KPI đạt mục tiêu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">87%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              26/30 KPI
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Phòng ban xuất sắc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Kế toán</div>
            <div className="text-xs text-muted-foreground mt-1">93 điểm</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nhân viên xuất sắc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Trần Thị B</div>
            <div className="text-xs text-muted-foreground mt-1">102 điểm</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng KPI theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="target" stroke="#8884d8" name="Mục tiêu" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Thực tế" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Điểm KPI theo phòng ban</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8884d8" name="Điểm KPI" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 KPI cần cải thiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Số sự cố vận hành', current: '7', target: '<5', gap: '40%' },
              { name: 'Chi phí nhiên liệu/km', current: '3,700đ', target: '3,500đ', gap: '11%' },
              { name: 'Số km chạy không tải', current: '12%', target: '<10%', gap: '17%' },
              { name: 'Số khách hàng mới', current: '17', target: '20', gap: '15%' },
              { name: 'Tỷ lệ chốt hợp đồng', current: '55%', target: '60%', gap: '8%' }
            ].map((kpi, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{kpi.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Hiện tại: {kpi.current} / Mục tiêu: {kpi.target}
                  </p>
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="font-bold">{kpi.gap}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIDashboard;
