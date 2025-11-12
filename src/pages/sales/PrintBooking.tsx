import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { useEffect } from 'react';

// Mock bookings data - giống như trong BookingList
const bookingsData = [
  {
    id: 'BK001',
    code: 'FLT-2025-00057',
    customer: 'Công ty TNHH ABC',
    customerType: 'corporate' as const,
    companyCode: 'DN001',
    contact: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'contact@abc.com',
    passengerCount: 16,
    childrenCount: 2,
    tourGuideName: 'MS NGOC ANH',
    tourGuidePhone: '0912053324',
    reference: 'REF123',
    routePoints: [
      { location: 'HCM', datetime: '2024-01-15 08:00' },
      { location: 'Bình Dương', datetime: '2024-01-15 10:00' },
      { location: 'Hà Nội', datetime: '2024-01-15 18:00' }
    ],
    vehicles: [
      { type: '16 chỗ', licensePlate: '29H98349', driver: 'Le Quang Minh' },
    ],
    additionalServices: 'Cao Toc Ninh Binh x2 Chieu +354K',
    notes: 'Khách VIP, cần chăm sóc đặc biệt',
    status: 'confirmed',
    value: 15000000,
    created: '2024-01-10'
  },
  {
    id: 'BK002',
    code: 'FLT-2025-00058',
    customer: 'Lê Thị C',
    customerType: 'individual' as const,
    contact: 'Lê Thị C',
    phone: '0987654321',
    email: 'lethic@email.com',
    passengerCount: 4,
    childrenCount: 0,
    tourGuideName: 'Trần Văn D',
    tourGuidePhone: '0909123456',
    routePoints: [
      { location: 'Đà Nẵng', datetime: '2024-01-16 14:30' },
      { location: 'HCM', datetime: '2024-01-16 20:00' }
    ],
    vehicles: [
      { type: '7 chỗ', licensePlate: '51B-678.90', driver: 'Hoàng Văn E' }
    ],
    status: 'pending',
    value: 8500000,
    created: '2024-01-11'
  },
  {
    id: 'BK003',
    code: 'FLT-2025-00059',
    customer: 'Công ty DEF',
    customerType: 'corporate' as const,
    companyCode: 'DN002',
    contact: 'Phạm Văn D',
    phone: '0912345678',
    passengerCount: 20,
    childrenCount: 5,
    tourGuideName: 'Nguyễn Thị E',
    tourGuidePhone: '0908765432',
    routePoints: [
      { location: 'Hà Nội', datetime: '2024-01-17 10:00' },
      { location: 'Hải Phòng', datetime: '2024-01-17 12:30' }
    ],
    vehicles: [
      { type: '16 chỗ', licensePlate: '51B-678.90', driver: 'Hoàng Văn E' }
    ],
    status: 'in_progress',
    value: 5200000,
    created: '2024-01-12'
  },
  {
    id: 'BK004',
    code: 'FLT-2025-00060',
    customer: 'Công ty GHI',
    customerType: 'corporate' as const,
    companyCode: 'DN003',
    contact: 'Võ Thị F',
    phone: '0923456789',
    passengerCount: 8,
    childrenCount: 1,
    tourGuideName: 'Lê Văn F',
    tourGuidePhone: '0907654321',
    routePoints: [
      { location: 'Cần Thơ', datetime: '2024-01-14 16:00' },
      { location: 'HCM', datetime: '2024-01-14 19:00' }
    ],
    vehicles: [
      { type: '7 chỗ', licensePlate: '92C-111.22', driver: 'Nguyễn Văn G' }
    ],
    status: 'completed',
    value: 3200000,
    created: '2024-01-09'
  }
];

export default function PrintBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Lấy danh sách booking IDs từ query params (cho in hàng loạt)
  const bookingIds = searchParams.get('ids')?.split(',') || (id ? [id] : []);
  
  // Lấy dữ liệu booking(s) dựa trên IDs
  const bookings = bookingsData.filter(b => bookingIds.includes(b.id));

  const formatBookingForPrint = (booking: typeof bookingsData[0]) => {
    // Tạo danh sách hành khách giả (có thể mở rộng sau)
    const passengers = Array.from({ length: Math.min(booking.passengerCount, 10) }, (_, i) => ({
      no: i + 1,
      name: `KHÁCH ${i + 1}`
    }));

    // Định dạng lịch trình
    const scheduleText = booking.routePoints.map((point, idx) => {
      const date = new Date(point.datetime);
      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('vi-VN');
      const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      return `${idx === 0 ? dayName.charAt(0).toUpperCase() + dayName.slice(1) : ''} ngày ${dateStr}\nXE ${booking.vehicles[0]?.type}: HDV ${booking.tourGuideName} ${booking.tourGuidePhone} - ${point.location} ${timeStr}`;
    }).join('\n');

    return {
      ...booking,
      passengers,
      schedule: [
        {
          time: '',
          sk: 'SK',
          program: scheduleText + (booking.additionalServices ? `\n\n${booking.additionalServices}` : '') + '\n\nKết thúc chương trình'
        }
      ],
      startDate: booking.routePoints[0] ? new Date(booking.routePoints[0].datetime).toLocaleDateString('vi-VN') : '',
      endDate: booking.routePoints[booking.routePoints.length - 1] ? new Date(booking.routePoints[booking.routePoints.length - 1].datetime).toLocaleDateString('vi-VN') : '',
      vehicleInfo: booking.vehicles.map(v => `${v.driver} - ${v.licensePlate} (${v.type})`).join(', ')
    };
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Set title for print
    const codes = bookings.map(b => b.code).join(', ');
    document.title = `Booking ${codes}`;
  }, [bookings]);

  if (bookings.length === 0) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/sales/bookings')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div className="mt-4 text-center text-muted-foreground">
          Không tìm thấy booking
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print buttons - hidden when printing */}
      <div className="no-print p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sales/bookings')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {bookings.length} booking
            </span>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              In tất cả
            </Button>
          </div>
        </div>
      </div>

      {/* Print content - multiple bookings */}
      <div className="print-container bg-background">
        {bookings.map((booking, bookingIndex) => {
          const printData = formatBookingForPrint(booking);
          
          return (
            <div key={booking.id} className={bookingIndex > 0 ? 'page-break' : ''}>
              <div className="print-page">
                <div className="max-w-[210mm] mx-auto space-y-6">
                  {/* Header Section */}
                  <div className="header-section">
                    <div className="company-header">
                      <div className="text-center mb-6 pb-4 border-b-2 border-primary">
                        <h1 className="text-2xl font-bold text-primary mb-1">
                          CÔNG TY VẬN TẢI DU LỊCH
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          Địa chỉ: 123 Đường ABC, Quận XYZ | ☎ Hotline: 1900-xxxx | Email: info@company.com
                        </p>
                      </div>
                      
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold uppercase mb-2">
                          CHƯƠNG TRÌNH TOUR CỦA ĐOÀN
                        </h2>
                        <div className="inline-block bg-primary/10 px-4 py-2 rounded">
                          <p className="text-lg font-bold text-primary">
                            Mã booking: {booking.code}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking Information Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <div className="info-row">
                          <span className="font-semibold text-sm">Ngày bắt đầu:</span>
                          <span className="ml-2">{printData.startDate}</span>
                        </div>
                        <div className="info-row">
                          <span className="font-semibold text-sm">Ngày kết thúc:</span>
                          <span className="ml-2">{printData.endDate}</span>
                        </div>
                        <div className="info-row">
                          <span className="font-semibold text-sm">Khách hàng:</span>
                          <span className="ml-2 font-medium">{booking.customer}</span>
                        </div>
                        {booking.companyCode && (
                          <div className="info-row">
                            <span className="font-semibold text-sm">Mã DN:</span>
                            <span className="ml-2">{booking.companyCode}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="info-row">
                          <span className="font-semibold text-sm">Người liên hệ:</span>
                          <span className="ml-2">{booking.contact}</span>
                        </div>
                        <div className="info-row">
                          <span className="font-semibold text-sm">Điện thoại:</span>
                          <span className="ml-2">{booking.phone}</span>
                        </div>
                        {booking.email && (
                          <div className="info-row">
                            <span className="font-semibold text-sm">Email:</span>
                            <span className="ml-2">{booking.email}</span>
                          </div>
                        )}
                        {booking.reference && (
                          <div className="info-row">
                            <span className="font-semibold text-sm">Reference:</span>
                            <span className="ml-2">{booking.reference}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tour Guide & Passenger Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                        THÔNG TIN HƯỚNG DẪN VIÊN
                      </h3>
                      <div className="space-y-1.5">
                        <div className="info-row">
                          <span className="font-semibold text-sm">Họ tên HDV:</span>
                          <span className="ml-2">{booking.tourGuideName}</span>
                        </div>
                        <div className="info-row">
                          <span className="font-semibold text-sm">Điện thoại:</span>
                          <span className="ml-2">{booking.tourGuidePhone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                        THÔNG TIN ĐOÀN KHÁCH
                      </h3>
                      <div className="space-y-1.5">
                        <div className="info-row">
                          <span className="font-semibold text-sm">Số khách:</span>
                          <span className="ml-2 text-lg font-bold text-primary">{booking.passengerCount} người</span>
                        </div>
                        {booking.childrenCount > 0 && (
                          <div className="info-row">
                            <span className="font-semibold text-sm">Trẻ em:</span>
                            <span className="ml-2 text-lg font-bold text-orange-600">{booking.childrenCount} em</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="mb-6 p-4 border rounded-lg bg-blue-50/50">
                    <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                      PHƯƠNG TIỆN VẬN CHUYỂN
                    </h3>
                    <div className="space-y-2">
                      {booking.vehicles.map((vehicle, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-2 bg-white rounded">
                          <span className="font-bold text-primary">Xe {idx + 1}:</span>
                          <span className="font-medium">{vehicle.type}</span>
                          <span className="text-muted-foreground">|</span>
                          <span>BKS: <strong>{vehicle.licensePlate}</strong></span>
                          <span className="text-muted-foreground">|</span>
                          <span>Lái xe: <strong>{vehicle.driver}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
{/* Schedule Table */}
                  <div className="mb-6">
                    <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                      CHƯƠNG TRÌNH TOUR CHI TIẾT
                    </h3>
                    <table className="w-full border-collapse schedule-table">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="border border-primary/20 p-3 text-left w-20 font-semibold">Giờ</th>
                          <th className="border border-primary/20 p-3 text-left w-24 font-semibold">Số khách</th>
                          <th className="border border-primary/20 p-3 text-left font-semibold">Nội dung chương trình</th>
                        </tr>
                      </thead>
                      <tbody>
                        {printData.schedule.map((item, index) => (
                          <tr key={index} className="hover:bg-muted/20">
                            <td className="border border-foreground/20 p-3 align-top">{item.time}</td>
                            <td className="border border-foreground/20 p-3 align-top font-medium">{item.sk}</td>
                            <td className="border border-foreground/20 p-3 whitespace-pre-wrap leading-relaxed">
                              {item.program}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Passenger List */}
                  <div className="mb-6">
                    <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                      DANH SÁCH KHÁCH (DSK)
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                      {printData.passengers.map((passenger) => (
                        <div key={passenger.no} className="flex items-center gap-3 p-1.5 hover:bg-muted/20 rounded">
                          <span className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-bold">
                            {passenger.no}
                          </span>
                          <span className="font-medium">{passenger.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  

                  {/* Additional Services */}
                  {booking.additionalServices && (
                    <div className="mb-6 p-4 border rounded-lg bg-amber-50/50">
                      <h3 className="font-bold text-sm mb-2 text-primary">
                        DỊCH VỤ BỔ SUNG
                      </h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {booking.additionalServices}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mb-6 p-4 border rounded-lg bg-red-50/50">
                      <h3 className="font-bold text-sm mb-2 text-red-700">
                        ⚠️ GHI CHÚ QUAN TRỌNG
                      </h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t-2 border-primary/30">
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <p className="font-bold text-sm mb-1">NGƯỜI LẬP PHIẾU</p>
                        <p className="text-xs text-muted-foreground mb-8">(Ký và ghi rõ họ tên)</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-1">TRƯỞNG PHÒNG</p>
                        <p className="text-xs text-muted-foreground mb-8">(Ký và ghi rõ họ tên)</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-1">GIÁM ĐỐC</p>
                        <p className="text-xs text-muted-foreground mb-8">(Ký và ghi rõ họ tên)</p>
                      </div>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-4">
                      <p>Ngày in: {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
          .print-page {
            padding: 1.5cm;
            background: white !important;
            color: black !important;
          }
          .bg-muted, .bg-blue-50, .bg-amber-50, .bg-red-50 {
            background: #f5f5f5 !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .text-primary {
            color: #0066cc !important;
          }
          .bg-primary {
            background: #0066cc !important;
            color: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .border-primary {
            border-color: #0066cc !important;
          }
          .schedule-table {
            border: 1px solid #333 !important;
          }
          .schedule-table th,
          .schedule-table td {
            border: 1px solid #666 !important;
          }
          @page {
            size: A4;
            margin: 0.8cm;
          }
        }
        
        @media screen {
          .print-container {
            min-height: 100vh;
            background: #f8f9fa;
            padding: 2rem;
          }
          .print-page {
            padding: 2rem;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
          }
          .page-break {
            margin-top: 3rem;
            padding-top: 3rem;
            border-top: 2px dashed hsl(var(--border));
          }
          .info-row {
            display: flex;
            align-items: baseline;
          }
          .schedule-table {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </>
  );
}
