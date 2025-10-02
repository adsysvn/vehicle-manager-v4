import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Download, Calendar } from 'lucide-react';

export default function FinancialReports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Báo cáo tài chính</h1>
          <p className="text-muted-foreground mt-1">Phân tích và báo cáo tài chính</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Kỳ báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Doanh thu</p>
              <p className="text-2xl font-bold text-foreground">450,000,000 đ</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+12% so với tháng trước</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chi phí</p>
              <p className="text-2xl font-bold text-foreground">320,000,000 đ</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingDown className="w-4 h-4" />
            <span>-5% so với tháng trước</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lợi nhuận</p>
              <p className="text-2xl font-bold text-green-500">130,000,000 đ</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+28% so với tháng trước</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tỷ suất LN</p>
              <p className="text-2xl font-bold text-foreground">28.9%</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+3.2% so với tháng trước</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Doanh thu theo tháng
          </h3>
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Biểu đồ doanh thu - Đang phát triển</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Chi phí theo loại
          </h3>
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Biểu đồ chi phí - Đang phát triển</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Chi tiết doanh thu & chi phí</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Doanh thu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Dịch vụ vận chuyển</p>
                <p className="text-xl font-bold text-foreground">380,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">84.4% tổng doanh thu</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Dịch vụ CTV</p>
                <p className="text-xl font-bold text-foreground">50,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">11.1% tổng doanh thu</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Dịch vụ khác</p>
                <p className="text-xl font-bold text-foreground">20,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">4.5% tổng doanh thu</p>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Chi phí
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Lương nhân viên</p>
                <p className="text-xl font-bold text-foreground">150,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">46.9% tổng chi phí</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Nhiên liệu</p>
                <p className="text-xl font-bold text-foreground">80,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">25.0% tổng chi phí</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Bảo dưỡng</p>
                <p className="text-xl font-bold text-foreground">50,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">15.6% tổng chi phí</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">Chi phí khác</p>
                <p className="text-xl font-bold text-foreground">40,000,000 đ</p>
                <p className="text-xs text-muted-foreground mt-1">12.5% tổng chi phí</p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Báo cáo lưu trữ
        </h3>
        <div className="space-y-2">
          {['Tháng 12/2023', 'Tháng 11/2023', 'Tháng 10/2023'].map((month, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{month}</p>
                <p className="text-sm text-muted-foreground">Báo cáo tài chính tháng</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Tải xuống
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
