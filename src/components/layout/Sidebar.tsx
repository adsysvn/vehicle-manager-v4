import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Truck,
  Car,
  Calculator,
  MapPin,
  AlertTriangle,
  UserCheck,
  FileText,
  CreditCard,
  Fuel,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Shield,
  Droplet,
  Package,
  Building,
  Mail,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: BarChart3,
    color: 'text-blue-500'
  },
  {
    title: 'Kinh doanh',
    icon: Users,
    color: 'text-green-500',
    submenu: [
      { title: 'Danh sách booking', href: '/sales/bookings', icon: FileText },
      { title: 'Quản lý hợp đồng', href: '/sales/contracts', icon: FileText },
      { title: 'Quản lý khách hàng', href: '/sales/customers', icon: Users },
      { title: 'Chăm sóc khách hàng', href: '/sales/customer-care', icon: Users },
      { title: 'Báo cáo KD', href: '/sales/reports', icon: BarChart3 }
    ]
  },
  {
    title: 'Dịch vụ',
    icon: Package,
    color: 'text-teal-500',
    submenu: [
      { title: 'Quản lý dịch vụ', href: '/sales/service-manager', icon: Settings },
      { title: 'Khăn nước', href: '/sales/towel-service', icon: Package },
      { title: 'Nước lọc', href: '/sales/water-service', icon: Droplet }
    ]
  },
  {
    title: 'Điều hành xe',
    icon: Truck,
    color: 'text-orange-500',
    submenu: [
      { title: 'Phân xe & lái xe', href: '/operations/vehicle-assignment', icon: Car },
      // { title: 'Hành trình đa điểm', href: '/operations/multi-stop-booking', icon: MapPin },
      { title: 'Giám sát GPS', href: '/operations/gps-monitor', icon: MapPin },
      { title: 'Quản lý sự cố', href: '/operations/incidents', icon: AlertTriangle },
      { title: 'Quản lý CTV', href: '/operations/ctv-manager', icon: UserCheck },
      { title: 'Đặt xe CTV', href: '/operations/ctv-booking', icon: Car },
      { title: 'Theo dõi CTV', href: '/operations/ctv-tracking', icon: MapPin },
      { title: 'Hệ thống cảnh báo', href: '/operations/alerts', icon: Bell },
      { title: 'Báo cáo ĐH', href: '/operations/reports', icon: BarChart3 }
    ]
  },
  {
    title: 'Quản lý vận tải',
    icon: Car,
    color: 'text-purple-500',
    submenu: [
      { title: 'Hồ sơ xe', href: '/transport/vehicles', icon: Car },
      { title: 'Hồ sơ lái xe', href: '/transport/drivers', icon: Users },
      { title: 'Quản lý lái xe', href: '/transport/driver-management', icon: UserCog },
      { title: 'Bảng giá theo Km', href: '/transport/pricing', icon: CreditCard },
      { title: 'Giấy đi đường', href: '/transport/travel-documents', icon: FileText },
      { title: 'Lịch bảo dưỡng', href: '/transport/maintenance', icon: Settings },
      { title: 'Quản lý nhiên liệu', href: '/transport/fuel', icon: Fuel },
      { title: 'Quản lý đăng kiểm', href: '/transport/registration', icon: FileText },
      { title: 'Quản lý bảo hiểm', href: '/transport/insurance', icon: Shield },
      { title: 'Dịch vụ khác', href: '/transport/other-services', icon: Package },
      { title: 'Báo cáo VT', href: '/transport/reports', icon: BarChart3 }
    ]
  },
  {
    title: 'Kế toán',
    icon: Calculator,
    color: 'text-red-500',
    submenu: [
      { title: 'Công nợ khách hàng', href: '/accounting/debts', icon: CreditCard },
      { title: 'Quản lý hóa đơn', href: '/accounting/invoices', icon: FileText },
      { title: 'Chi phí phát sinh', href: '/accounting/expenses', icon: Calculator },
      { title: 'Đồng bộ HĐ Email', href: '/accounting/invoice-sync', icon: Mail },
      { title: 'Tính lương & chi phí', href: '/accounting/payroll', icon: Calculator },
      { title: 'Báo cáo tài chính', href: '/accounting/reports', icon: BarChart3 }
    ]
  },
  {
    title: 'Quản lý nhân sự',
    icon: UserCog,
    color: 'text-blue-500',
    submenu: [
      { title: 'Quản lý nhân viên', href: '/hrm/employees', icon: Users },
      { title: 'Chấm công', href: '/hrm/attendance', icon: FileText },
      { title: 'Nghỉ phép', href: '/hrm/leave', icon: FileText },
      { title: 'Quản lý phòng ban', href: '/hrm/departments', icon: Building }
    ]
  },
  {
    title: 'BSC/KPI',
    icon: BarChart3,
    color: 'text-amber-500',
    submenu: [
      { title: 'Chiến lược công ty', href: '/kpi/strategy', icon: BarChart3 },
      { title: 'Mục tiêu BSC', href: '/kpi/bsc', icon: BarChart3 },
      { title: 'Quản lý KPI', href: '/kpi/management', icon: FileText },
      { title: 'KPI Phòng ban', href: '/kpi/department', icon: Users },
      { title: 'KPI Cá nhân', href: '/kpi/individual', icon: UserCog },
      { title: 'Dashboard', href: '/kpi/dashboard', icon: BarChart3 }
    ]
  },
  {
    title: 'Phân quyền',
    icon: Shield,
    color: 'text-indigo-500',
    submenu: [
      { title: 'Vai trò người dùng', href: '/security/roles', icon: Shield },
      { title: 'Phòng ban', href: '/security/departments', icon: Users },
      { title: 'Quyền truy cập', href: '/security/permissions', icon: Settings }
    ]
  }
  
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Auto-open submenu if current path matches
    const currentItem = menuItems.find(item => 
      item.submenu?.some(sub => location.pathname === sub.href)
    );
    if (currentItem) {
      setOpenSubmenu(currentItem.title);
    }
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-sidebar-foreground">TransportMS</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <NavLink
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", item.color)} />
                  {!collapsed && <span className="font-medium">{item.title}</span>}
                </NavLink>
              ) : (
                <div>
                  <button
                    onClick={() => setOpenSubmenu(openSubmenu === item.title ? null : item.title)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                      "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", item.color)} />
                    {!collapsed && (
                      <>
                        <span className="font-medium flex-1">{item.title}</span>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform",
                          openSubmenu === item.title && "rotate-90"
                        )} />
                      </>
                    )}
                  </button>
                  
                  {!collapsed && openSubmenu === item.title && item.submenu && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.href}
                          to={subItem.href}
                          className={({ isActive }) => cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                            isActive 
                              ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                          )}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}
