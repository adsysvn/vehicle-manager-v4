import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingData {
  id: string;
  booking_number: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  passenger_count: number;
  special_requests: string | null;
  notes: string | null;
  total_price: number | null;
  customers: {
    name: string;
    phone: string;
    email: string | null;
    company_name: string | null;
    customer_type: string | null;
    contact_person: string | null;
  } | null;
  vehicle_assignments: Array<{
    vehicles: { license_plate: string; brand: string; model: string; seats: number } | null;
    drivers: {
      profiles: { full_name: string; phone: string | null } | null;
    } | null;
  }>;
  routes: {
    name: string;
    from_location: string;
    to_location: string;
  } | null;
}

export default function PrintBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy danh sách booking IDs từ query params (cho in hàng loạt) hoặc từ URL param
  const bookingIds = searchParams.get('ids')?.split(',') || (id ? [id] : []);

  useEffect(() => {
    fetchBookings();
  }, [id, searchParams]);

  const fetchBookings = async () => {
    if (bookingIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers!bookings_customer_id_fkey (
            name, phone, email, company_name, customer_type, contact_person
          ),
          vehicle_assignments (
            vehicles!vehicle_assignments_vehicle_id_fkey (license_plate, brand, model, seats),
            drivers!vehicle_assignments_driver_id_fkey (
              profiles!drivers_profile_id_fkey (full_name, phone)
            )
          ),
          routes!bookings_route_id_fkey (name, from_location, to_location)
        `)
        .in('id', bookingIds);

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (bookings.length > 0) {
      const codes = bookings.map(b => b.booking_number).join(', ');
      document.title = `Booking ${codes}`;
    }
  }, [bookings]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Đang tải...
      </div>
    );
  }

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
        {bookings.map((booking, bookingIndex) => (
          <div key={booking.id} className={bookingIndex > 0 ? 'page-break' : ''}>
            <div className="print-page">
              <div className="max-w-[210mm] mx-auto space-y-6 p-6">
                {/* Header Section */}
                <div className="header-section">
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
                      PHIẾU ĐẶT XE
                    </h2>
                    <div className="inline-block bg-primary/10 px-4 py-2 rounded">
                      <p className="text-lg font-bold text-primary">
                        Mã booking: {booking.booking_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Information Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <div className="info-row">
                      <span className="font-semibold text-sm">Ngày đón:</span>
                      <span className="ml-2">{formatDate(booking.pickup_datetime)}</span>
                    </div>
                    <div className="info-row">
                      <span className="font-semibold text-sm">Giờ đón:</span>
                      <span className="ml-2 font-bold text-primary">{formatTime(booking.pickup_datetime)}</span>
                    </div>
                    <div className="info-row">
                      <span className="font-semibold text-sm">Khách hàng:</span>
                      <span className="ml-2 font-medium">{booking.customers?.name}</span>
                    </div>
                    {booking.customers?.company_name && (
                      <div className="info-row">
                        <span className="font-semibold text-sm">Công ty:</span>
                        <span className="ml-2">{booking.customers.company_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="info-row">
                      <span className="font-semibold text-sm">Người liên hệ:</span>
                      <span className="ml-2">{booking.customers?.contact_person || booking.customers?.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="font-semibold text-sm">Điện thoại:</span>
                      <span className="ml-2">{booking.customers?.phone}</span>
                    </div>
                    {booking.customers?.email && (
                      <div className="info-row">
                        <span className="font-semibold text-sm">Email:</span>
                        <span className="ml-2">{booking.customers.email}</span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="font-semibold text-sm">Loại KH:</span>
                      <span className="ml-2">
                        {booking.customers?.customer_type === 'corporate' ? 'Doanh nghiệp' : 'Cá nhân'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                      THÔNG TIN HÀNH TRÌNH
                    </h3>
                    <div className="space-y-1.5">
                      <div className="info-row">
                        <span className="font-semibold text-sm">Điểm đón:</span>
                        <span className="ml-2">{booking.pickup_location}</span>
                      </div>
                      <div className="info-row">
                        <span className="font-semibold text-sm">Điểm đến:</span>
                        <span className="ml-2">{booking.dropoff_location}</span>
                      </div>
                      {booking.routes && (
                        <div className="info-row">
                          <span className="font-semibold text-sm">Tuyến đường:</span>
                          <span className="ml-2">{booking.routes.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                      THÔNG TIN ĐOÀN KHÁCH
                    </h3>
                    <div className="space-y-1.5">
                      <div className="info-row">
                        <span className="font-semibold text-sm">Số khách:</span>
                        <span className="ml-2 text-lg font-bold text-primary">
                          {booking.passenger_count || 1} người
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="font-semibold text-sm">Giá trị:</span>
                        <span className="ml-2 font-bold text-green-600">
                          {formatCurrency(booking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="mb-6 p-4 border rounded-lg bg-blue-50/50">
                  <h3 className="font-bold text-sm mb-3 text-primary border-b pb-2">
                    PHƯƠNG TIỆN VẬN CHUYỂN
                  </h3>
                  <div className="space-y-2">
                    {booking.vehicle_assignments && booking.vehicle_assignments.length > 0 ? (
                      booking.vehicle_assignments.map((assignment, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-2 bg-white rounded">
                          <span className="font-bold text-primary">Xe {idx + 1}:</span>
                          <span className="font-medium">
                            {assignment.vehicles?.brand} {assignment.vehicles?.model} ({assignment.vehicles?.seats} chỗ)
                          </span>
                          <span className="text-muted-foreground">|</span>
                          <span>BKS: <strong>{assignment.vehicles?.license_plate}</strong></span>
                          <span className="text-muted-foreground">|</span>
                          <span>Lái xe: <strong>{assignment.drivers?.profiles?.full_name || 'Chưa phân'}</strong></span>
                          {assignment.drivers?.profiles?.phone && (
                            <>
                              <span className="text-muted-foreground">|</span>
                              <span>SĐT: {assignment.drivers.profiles.phone}</span>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">Chưa phân xe</p>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <div className="mb-6 p-4 border rounded-lg bg-amber-50/50">
                    <h3 className="font-bold text-sm mb-2 text-primary">
                      YÊU CẦU ĐẶC BIỆT
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {booking.special_requests}
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
                      <p className="font-bold text-sm mb-1">LÁI XE</p>
                      <p className="text-xs text-muted-foreground mb-8">(Ký và ghi rõ họ tên)</p>
                    </div>
                  </div>
                  
                  <div className="text-center text-xs text-muted-foreground mt-4">
                    <p>Ngày in: {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-container {
            width: 100%;
          }
          
          .print-page {
            page-break-after: always;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        @page {
          size: A4;
          margin: 10mm;
        }
      `}</style>
    </>
  );
}
