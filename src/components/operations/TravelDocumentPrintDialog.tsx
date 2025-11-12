import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

interface TravelDocumentPrintDialogProps {
  document: TravelDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TravelDocumentPrintDialog({ 
  document, 
  open, 
  onOpenChange 
}: TravelDocumentPrintDialogProps) {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'tháng' MM 'năm' yyyy", { locale: vi });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto print:max-w-full">
        <div className="flex justify-end gap-2 print:hidden mb-4">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            In
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Tải xuống PDF
          </Button>
          <Button onClick={() => onOpenChange(false)} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="print:p-8 bg-background text-foreground text-sm">
          {/* Header with Company Info */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="text-xs">
              <div className="font-bold text-sm mb-2">CÔNG TY TNHH DỊCH VỤ MINH - VIỆT</div>
              <div className="font-semibold mb-2">PHÒNG ĐIỀU HÀNH</div>
              <div>Địa chỉ: Số 50 Hoàng Cầu, Đống Đa, Hà Nội</div>
              <div>Telephone: 04.39716002 / 04.39084988</div>
              <div>Fax: 04.39716103</div>
              <div>Mã số thuế: 0100987897</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg mb-2">LỆNH ĐIỀU ĐỘNG XE</div>
              <div className="mb-1">Số: {document.documentNumber}</div>
              <div className="mb-2">Ngày {formatDate(document.issuedDate)}</div>
              <div>Họ và tên lái xe: {document.driverName}</div>
              <div>Hiệu xe: {document.cargoType}</div>
              <div>Số đăng ký: {document.vehiclePlate}</div>
            </div>
          </div>

          {/* Client and Route Information */}
          <div className="space-y-1 mb-4 text-xs">
            <div>Cơ quan thuê xe: <span className="font-semibold">{document.purpose}</span></div>
            <div>Mã đoàn: {document.vehicleId}</div>
            <div>Tuyến đường: <span className="font-semibold">{document.route}</span></div>
            <div>Từ ngày: {formatDateTime(document.departureDate)} đến ngày: {formatDateTime(document.returnDate)}</div>
            <div>Tên hướng dẫn (Tên khách): {document.driverName} - Điện thoại: ______________</div>
            <div>Ngày, giờ, địa điểm đón khách: lúc {format(new Date(document.departureDate), 'HH:mm', { locale: vi })} tại ______________</div>
            <div className="italic">Ghi chú - Cao tốc 2 chiếu: ______________</div>
          </div>

          {/* Route Table */}
          <div className="mb-4">
            <table className="w-full border-collapse border border-foreground text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-foreground p-2 w-12">N/T</th>
                  <th className="border border-foreground p-2">Tuyến đường</th>
                  <th className="border border-foreground p-2 w-24">
                    <div>Giờ</div>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div className="text-center">Đi</div>
                      <div className="text-center">Về</div>
                    </div>
                  </th>
                  <th className="border border-foreground p-2 w-24">Tổng số Km</th>
                  <th className="border border-foreground p-2 w-24">Ngoại giờ</th>
                  <th className="border border-foreground p-2 w-24">Thành tiền</th>
                  <th className="border border-foreground p-2 w-32">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-foreground p-2 text-center">1</td>
                  <td className="border border-foreground p-2">{document.departure} - {document.destination}</td>
                  <td className="border border-foreground p-2">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-center">{format(new Date(document.departureDate), 'HH:mm')}</div>
                      <div className="text-center">{format(new Date(document.returnDate), 'HH:mm')}</div>
                    </div>
                  </td>
                  <td className="border border-foreground p-2"></td>
                  <td className="border border-foreground p-2"></td>
                  <td className="border border-foreground p-2"></td>
                  <td className="border border-foreground p-2"></td>
                </tr>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="border border-foreground p-2 h-10"></td>
                    <td className="border border-foreground p-2"></td>
                    <td className="border border-foreground p-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div></div>
                        <div></div>
                      </div>
                    </td>
                    <td className="border border-foreground p-2"></td>
                    <td className="border border-foreground p-2"></td>
                    <td className="border border-foreground p-2"></td>
                    <td className="border border-foreground p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Services */}
          <div className="mb-4 space-y-2 text-xs">
            <div className="font-semibold underline">Dịch vụ kèm theo:</div>
            <div className="grid grid-cols-3 gap-2">
              <div>Khăn: ☐</div>
              <div>Wifi: ☐</div>
              <div>Vé rối nước: ☐</div>
              <div>Bia: ☐</div>
              <div>Nón: ☐</div>
              <div>Nước: ___ Nước Aqua</div>
              <div>Thẻ BA4: ☐</div>
              <div>Vé tàu, máy bay: ☐</div>
              <div>Nước ngọt: ☐</div>
              <div>Phát sinh:</div>
              <div>Công tác phí: Không</div>
              <div>Dầu giò: ☐</div>
            </div>
          </div>

          {/* Customer Feedback Section */}
          <div className="mb-4 text-xs">
            <div className="font-semibold text-center mb-2">Ý KIẾN VÀ XÁC NHẬN CỦA KHÁCH HÀNG:</div>
            <div className="border-t border-foreground pt-8 pb-8"></div>
          </div>

          {/* Footer Notes */}
          <div className="text-xs space-y-1 mb-4">
            <div>1/ Các dịch vụ đi kèm vui lòng nhấn (√) TTVT-Cty Minh Việt (ngõ 144 An Dương Vương), số điện thoại: 024.37558369-0987804031</div>
            <div>2/ Phiếu này là cơ sở để làm thanh toán với Cty Minh Việt. Lái xe phải tự phê điều xe theo mẫu của Cty Minh Việt với khách hàng.</div>
            <div>3/ Yêu cầu nộp lệnh điều xe chậm nhất 48 giờ sau khi kết thúc chương trình. Mọi phát sinh ngoài chương trình để nghị lái xe thông báo cho Điều hành</div>
            <div>Cty Minh Việt và chỉ thực hiện sau khi được sự đồng ý của Điều hành Cty Minh Việt.</div>
            <div>4/ Cty Minh Việt không chịu trách nhiệm thanh toán phát sinh không được thông báo, không có lệnh điều xe hoặc không có xác nhận của khách hàng.</div>
          </div>

          {/* Vehicle Fee Section */}
          <div className="mb-6 text-xs">
            <div className="font-semibold underline mb-2">CHI PHÍ XE:</div>
            <div className="border-t border-foreground pt-2 pb-16"></div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-16 text-xs text-center">
            <div>
              <div className="font-semibold mb-16">NGƯỜI ĐIỀU LỆNH</div>
              <div className="font-semibold">{document.issuedBy}</div>
            </div>
            <div>
              <div className="font-semibold mb-2">Ngày ____ tháng ____ năm 20___</div>
              <div className="font-semibold mb-14">LÁI XE</div>
              <div className="font-semibold">{document.driverName}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
