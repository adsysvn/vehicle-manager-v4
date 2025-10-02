import React, { useState } from 'react';
import { AlertTriangle, Phone, Clock, MapPin, User, Car, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const incidents = [
  {
    id: 'SC001',
    title: 'Xe bị hỏng động cơ',
    vehicle: '30A-123.45',
    driver: 'Nguyễn Văn A',
    driverPhone: '0901234567',
    location: 'Km 15 QL1A, Bình Dương',
    coordinates: { lat: 10.9804, lng: 106.6519 },
    reportTime: '2024-01-15 13:30',
    severity: 'high',
    status: 'open',
    category: 'Cơ khí',
    description: 'Xe đột ngột tắt máy, không thể khởi động lại. Có tiếng động bất thường từ động cơ.',
    reporter: 'Lái xe',
    assignedTo: 'Đội sửa chữa 1',
    estimatedRepairTime: '3-4 giờ',
    affectedBooking: 'BK001',
    customerImpact: 'Chậm giao hàng 4-5 giờ',
    actionsTaken: [
      'Liên hệ đội sửa chữa',
      'Thông báo khách hàng',
      'Chuẩn bị xe dự phòng'
    ],
    nextActions: [
      'Đội sửa chữa đến hiện trường',
      'Đánh giá mức độ hỏng hóc',
      'Quyết định sửa chữa hoặc thay xe'
    ]
  },
  {
    id: 'SC002',
    title: 'Tai nạn giao thông nhẹ',
    vehicle: '51B-678.90',
    driver: 'Trần Văn B',
    driverPhone: '0987654321',
    location: 'Ngã tư Hàng Xanh, TP.HCM',
    coordinates: { lat: 10.7993, lng: 106.7028 },
    reportTime: '2024-01-15 10:15',
    severity: 'medium',
    status: 'in_progress',
    category: 'Tai nạn',
    description: 'Va chạm nhẹ với xe máy. Xe tải bị trầy xước, xe máy bị ngã.',
    reporter: 'Lái xe',
    assignedTo: 'Phòng bảo hiểm',
    estimatedRepairTime: '1-2 ngày',
    affectedBooking: 'BK002',
    customerImpact: 'Không ảnh hưởng nghiêm trọng',
    actionsTaken: [
      'Gọi cảnh sát giao thông',
      'Chụp ảnh hiện trường',
      'Trao đổi thông tin bảo hiểm',
      'Báo cáo công ty bảo hiểm'
    ],
    nextActions: [
      'Chờ kết luận của cảnh sát',
      'Đưa xe đi sửa chữa',
      'Theo dõi chi phí bảo hiểm'
    ]
  },
  {
    id: 'SC003',
    title: 'Lốp xe bị thủng',
    vehicle: '92C-111.22',
    driver: 'Lê Văn C',
    driverPhone: '0912345678',
    location: 'Trạm dừng chân Km 45, Cao tốc HN-HP',
    coordinates: { lat: 20.9622, lng: 105.8988 },
    reportTime: '2024-01-15 08:45',
    severity: 'low',
    status: 'resolved',
    category: 'Cơ khí',
    description: 'Lốp trước bên phải bị thủng do đinh. Đã thay lốp dự phòng.',
    reporter: 'Lái xe',
    assignedTo: 'Lái xe tự xử lý',
    estimatedRepairTime: '30 phút',
    affectedBooking: 'BK003',
    customerImpact: 'Chậm 30 phút',
    actionsTaken: [
      'Dừng xe an toàn',
      'Thay lốp dự phòng',
      'Thông báo điều hành',
      'Tiếp tục hành trình'
    ],
    nextActions: [
      'Mua lốp mới thay thế',
      'Kiểm tra lốp còn lại'
    ]
  }
];

const emergencyContacts = [
  { name: 'Cứu hộ 24/7', phone: '1900-xxx-xxx', type: 'Cứu hộ' },
  { name: 'Bảo hiểm Liberty', phone: '1800-xxx-xxx', type: 'Bảo hiểm' },
  { name: 'Cảnh sát giao thông', phone: '113', type: 'Khẩn cấp' },
  { name: 'Cấp cứu', phone: '115', type: 'Y tế' }
];

const severityConfig = {
  high: { label: 'Nghiêm trọng', color: 'bg-red-100 text-red-800' },
  medium: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  low: { label: 'Nhẹ', color: 'bg-blue-100 text-blue-800' }
};

const statusConfig = {
  open: { label: 'Đang xử lý', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  in_progress: { label: 'Đang giải quyết', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  resolved: { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

export default function IncidentManager() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newUpdate, setNewUpdate] = useState('');

  const filteredIncidents = incidents.filter(incident => 
    statusFilter === 'all' || incident.status === statusFilter
  );

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Sự cố</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và xử lý các sự cố trong quá trình vận chuyển
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-destructive border-destructive">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Báo cáo sự cố
          </Button>
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tạo sự cố mới
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {incidents.filter(i => i.status === 'open').length}
              </div>
              <div className="text-sm text-muted-foreground">Chưa xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {incidents.filter(i => i.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">Đang xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {incidents.filter(i => i.status === 'resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">Đã giải quyết</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{incidents.length}</div>
              <div className="text-sm text-muted-foreground">Tổng sự cố</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Incident List */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách sự cố ({filteredIncidents.length})</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="open">Chưa xử lý</SelectItem>
                  <SelectItem value="in_progress">Đang xử lý</SelectItem>
                  <SelectItem value="resolved">Đã giải quyết</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIncidents.map((incident) => {
                const StatusIcon = statusConfig[incident.status as keyof typeof statusConfig].icon;
                return (
                  <div 
                    key={incident.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedIncident === incident.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setSelectedIncident(incident.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-destructive/10">
                            <StatusIcon className="w-5 h-5 text-destructive" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{incident.title}</h4>
                          <p className="text-sm text-muted-foreground">{incident.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={severityConfig[incident.severity as keyof typeof severityConfig].color}>
                          {severityConfig[incident.severity as keyof typeof severityConfig].label}
                        </Badge>
                        <Badge className={statusConfig[incident.status as keyof typeof statusConfig].color}>
                          {statusConfig[incident.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span>{incident.vehicle} - {incident.driver}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{incident.location}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDateTime(incident.reportTime)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>Phụ trách: {incident.assignedTo}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {incident.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Ảnh hưởng: {incident.customerImpact}
                      </span>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Gọi lái xe
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts & Actions */}
        <div className="space-y-6">
          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-destructive" />
                <span>Liên hệ khẩn cấp</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.type}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive">
                      <Phone className="w-4 h-4 mr-1" />
                      {contact.phone}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Car className="w-4 h-4 mr-2" />
                  Điều xe cứu hộ
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Gọi lái xe dự phòng
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Thông báo khách hàng
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Xem vị trí GPS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Incident Details */}
      {selectedIncident && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">
              Chi tiết sự cố {selectedIncident}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const incident = incidents.find(i => i.id === selectedIncident);
              if (!incident) return null;
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="font-medium">Thông tin cơ bản</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tiêu đề:</span>
                          <span className="font-medium">{incident.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Xe:</span>
                          <span className="font-medium">{incident.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lái xe:</span>
                          <span className="font-medium">{incident.driver}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Danh mục:</span>
                          <span className="font-medium">{incident.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời gian báo cáo:</span>
                          <span className="font-medium">{formatDateTime(incident.reportTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="font-medium">Tình trạng xử lý</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trạng thái:</span>
                          <Badge className={statusConfig[incident.status as keyof typeof statusConfig].color}>
                            {statusConfig[incident.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mức độ:</span>
                          <Badge className={severityConfig[incident.severity as keyof typeof severityConfig].color}>
                            {severityConfig[incident.severity as keyof typeof severityConfig].label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phụ trách:</span>
                          <span className="font-medium">{incident.assignedTo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời gian sửa chữa:</span>
                          <span className="font-medium">{incident.estimatedRepairTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Mô tả sự cố</h5>
                    <p className="text-sm p-3 bg-muted/30 rounded">{incident.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Hành động đã thực hiện</h5>
                      <ul className="space-y-1">
                        {incident.actionsTaken.map((action, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Hành động tiếp theo</h5>
                      <ul className="space-y-1">
                        {incident.nextActions.map((action, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-warning" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Thêm cập nhật</h5>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Nhập cập nhật mới về tình trạng sự cố..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Cập nhật trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Đang xử lý</SelectItem>
                            <SelectItem value="in_progress">Đang giải quyết</SelectItem>
                            <SelectItem value="resolved">Đã giải quyết</SelectItem>
                            <SelectItem value="closed">Đã đóng</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex space-x-2">
                          <Button variant="outline">Hủy</Button>
                          <Button>Lưu cập nhật</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}