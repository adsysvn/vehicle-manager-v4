import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Printer, Download, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TravelDocumentPrintDialog from '@/components/operations/TravelDocumentPrintDialog';

interface TravelDocument {
  id: string;
  documentNumber: string;
  vehicleId: string;
  vehiclePlate: string;
  driverName: string;
  route: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  purpose: string;
  cargoType: string;
  cargoWeight?: number;
  passengerCount?: number;
  issuedBy: string;
  issuedDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

const mockDocuments: TravelDocument[] = [
  {
    id: 'TD001',
    documentNumber: 'GDĐ-2024-001',
    vehicleId: 'VEH001',
    vehiclePlate: '30A-12345',
    driverName: 'Nguyễn Văn A',
    route: 'Hà Nội - Hải Phòng',
    departure: 'Hà Nội',
    destination: 'Hải Phòng',
    departureDate: '2024-03-20',
    returnDate: '2024-03-20',
    purpose: 'Chở khách du lịch',
    cargoType: 'Hành khách',
    passengerCount: 7,
    issuedBy: 'Phòng Điều hành',
    issuedDate: '2024-03-19',
    status: 'active'
  },
  {
    id: 'TD002',
    documentNumber: 'GDĐ-2024-002',
    vehicleId: 'VEH002',
    vehiclePlate: '30B-67890',
    driverName: 'Trần Văn B',
    route: 'Hà Nội - Quảng Ninh',
    departure: 'Hà Nội',
    destination: 'Quảng Ninh',
    departureDate: '2024-03-21',
    returnDate: '2024-03-22',
    purpose: 'Tour du lịch Hạ Long',
    cargoType: 'Hành khách',
    passengerCount: 16,
    issuedBy: 'Phòng Điều hành',
    issuedDate: '2024-03-20',
    status: 'active'
  }
];

export default function TravelDocuments() {
  const [documents, setDocuments] = useState<TravelDocument[]>(mockDocuments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TravelDocument | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handlePrint = (doc: TravelDocument) => {
    setSelectedDocument(doc);
    setIsPrintDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Giấy đi đường</h1>
          <p className="text-muted-foreground mt-1">Quản lý giấy đi đường cho trung tâm điều hành vận tải</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Cấp giấy đi đường
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cấp giấy đi đường mới</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Số giấy đi đường</Label>
                  <Input id="documentNumber" placeholder="GDĐ-2024-003" required />
                </div>
                <div className="space-y-2">
                  <Label>Xe vận chuyển</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veh001">30A-12345 - 7 chỗ</SelectItem>
                      <SelectItem value="veh002">30B-67890 - 16 chỗ</SelectItem>
                      <SelectItem value="veh003">30C-11111 - 29 chỗ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lái xe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lái xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver1">Nguyễn Văn A</SelectItem>
                      <SelectItem value="driver2">Trần Văn B</SelectItem>
                      <SelectItem value="driver3">Lê Văn C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route">Tuyến đường</Label>
                  <Input id="route" placeholder="Hà Nội - Hải Phòng" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure">Điểm đi</Label>
                  <Input id="departure" placeholder="Hà Nội" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Điểm đến</Label>
                  <Input id="destination" placeholder="Hải Phòng" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Ngày khởi hành</Label>
                  <Input id="departureDate" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Ngày dự kiến về</Label>
                  <Input id="returnDate" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label>Loại hàng hóa/hành khách</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passenger">Hành khách</SelectItem>
                      <SelectItem value="cargo">Hàng hóa</SelectItem>
                      <SelectItem value="mixed">Hỗn hợp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passengerCount">Số hành khách</Label>
                  <Input id="passengerCount" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoWeight">Trọng tải (kg)</Label>
                  <Input id="cargoWeight" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuedBy">Người cấp</Label>
                  <Input id="issuedBy" placeholder="Phòng Điều hành" required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="purpose">Mục đích chuyến đi</Label>
                  <Textarea 
                    id="purpose" 
                    placeholder="Mô tả mục đích và nội dung chuyến đi..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Cấp giấy đi đường</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Tổng giấy đi đường
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tất cả giấy đi đường</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {documents.filter(d => d.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Chuyến đi đang diễn ra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {documents.filter(d => d.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Chuyến đã hoàn tất</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Giấy đi đường mới</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giấy đi đường</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số GDĐ</TableHead>
                <TableHead>Xe</TableHead>
                <TableHead>Lái xe</TableHead>
                <TableHead>Tuyến đường</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Loại hàng</TableHead>
                <TableHead>Người cấp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doc.vehiclePlate}</p>
                      <p className="text-xs text-muted-foreground">{doc.vehicleId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{doc.driverName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doc.route}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.departure} → {doc.destination}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>Đi: {doc.departureDate}</p>
                      <p className="text-muted-foreground">Về: {doc.returnDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <Badge variant="outline">{doc.cargoType}</Badge>
                      {doc.passengerCount && (
                        <p className="text-xs mt-1">{doc.passengerCount} người</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{doc.issuedBy}</p>
                      <p className="text-xs text-muted-foreground">{doc.issuedDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        doc.status === 'active' ? 'default' :
                        doc.status === 'completed' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {doc.status === 'active' ? 'Đang hoạt động' :
                       doc.status === 'completed' ? 'Hoàn thành' :
                       'Đã hủy'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePrint(doc)}
                        title="In giấy đi đường"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TravelDocumentPrintDialog
        document={selectedDocument}
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
      />
    </div>
  );
}
