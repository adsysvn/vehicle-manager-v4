import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Truck, 
  Car, 
  Calculator,
  UserCog,
  Shield,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Tổng quan',
      description: 'Dashboard và báo cáo tổng hợp',
      icon: BarChart3,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/dashboard',
      items: []
    },
    {
      title: 'Kinh doanh',
      description: 'Quản lý booking, hợp đồng và dịch vụ',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
      path: '/sales/bookings',
      items: [
        { name: 'Danh sách booking', path: '/sales/bookings' },
        { name: 'Quản lý hợp đồng', path: '/sales/contracts' },
        { name: 'Chăm sóc khách hàng', path: '/sales/customer-care' },
        { name: 'Khăn nước', path: '/sales/towel-service' },
        { name: 'Nước lọc', path: '/sales/water-service' },
        { name: 'Dịch vụ khác', path: '/sales/other-services' }
      ]
    },
    {
      title: 'Điều hành xe',
      description: 'Phân xe, GPS và quản lý CTV',
      icon: Truck,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      path: '/operations/vehicle-assignment',
      items: [
        { name: 'Phân xe & lái xe', path: '/operations/vehicle-assignment' },
        { name: 'Giám sát GPS', path: '/operations/gps-monitor' },
        { name: 'Quản lý sự cố', path: '/operations/incidents' }
      ]
    },
    {
      title: 'Quản lý vận tải',
      description: 'Hồ sơ xe, lái xe, bảo dưỡng',
      icon: Car,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      path: '/transport/vehicles',
      items: [
        { name: 'Hồ sơ xe', path: '/transport/vehicles' },
        { name: 'Hồ sơ lái xe', path: '/transport/drivers' },
        { name: 'Lịch bảo dưỡng', path: '/transport/maintenance' }
      ]
    },
    {
      title: 'Kế toán',
      description: 'Công nợ, hóa đơn, báo cáo tài chính',
      icon: Calculator,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      path: '/accounting/debts',
      items: [
        { name: 'Công nợ khách hàng', path: '/accounting/debts' },
        { name: 'Quản lý hóa đơn', path: '/accounting/invoices' },
        { name: 'Báo cáo tài chính', path: '/accounting/reports' }
      ]
    },
    {
      title: 'Quản lý nhân sự',
      description: 'Nhân viên, chấm công, nghỉ phép',
      icon: UserCog,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      path: '/hrm/employees',
      items: [
        { name: 'Quản lý nhân viên', path: '/hrm/employees' },
        { name: 'Chấm công', path: '/hrm/attendance' },
        { name: 'Nghỉ phép', path: '/hrm/leave' }
      ]
    },
    {
      title: 'Phân quyền',
      description: 'Quản lý vai trò và quyền truy cập',
      icon: Shield,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      path: '/security/roles',
      items: [
        { name: 'Vai trò người dùng', path: '/security/roles' },
        { name: 'Phòng ban', path: '/security/departments' },
        { name: 'Quyền truy cập', path: '/security/permissions' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Briefcase className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">
            Hệ thống quản lý vận tải
          </h1>
          <p className="text-xl text-center text-white/90 max-w-2xl mx-auto">
            Giải pháp toàn diện cho doanh nghiệp vận tải, từ điều hành đến kế toán
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card 
              key={module.title}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(module.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4`}>
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              {module.items.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    {module.items.slice(0, 3).map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(item.path);
                        }}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
