import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Car, User, Clock, Phone, CheckCircle2, AlertCircle, Zap, Bell, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VehicleAssignment = () => {
  const { toast } = useToast();
  
  // State for data from database
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [ctvVehicles, setCtvVehicles] = useState<any[]>([]);
  const [pendingConfirmations, setPendingConfirmations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAutoAssign, setProcessingAutoAssign] = useState(false);
  
  // Selection state
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch vehicles with priority ordering
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')
        .order('priority', { ascending: false });

      // Fetch drivers with profiles
      const { data: driversData } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles!drivers_profile_id_fkey(full_name, phone, email)
        `)
        .eq('status', 'available');

      // Fetch pending/confirmed bookings
      const { data: pendingData } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(name, phone),
          route:routes(name, from_location, to_location, distance_km)
        `)
        .in('status', ['pending', 'confirmed'])
        .order('pickup_datetime', { ascending: true });

      // Fetch vehicle assignments
      const { data: assignmentsData } = await supabase
        .from('vehicle_assignments')
        .select(`
          *,
          booking:bookings(*),
          vehicle:vehicles(license_plate, brand, model, seats),
          driver:drivers(*, profile:profiles!drivers_profile_id_fkey(full_name, phone)),
          ctv_vehicle:ctv_vehicles(license_plate, owner_name, owner_phone)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch CTV vehicles
      const { data: ctvData } = await supabase
        .from('ctv_vehicles')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'available')
        .order('rating', { ascending: false });

      // Fetch pending confirmations
      const { data: confirmationsData } = await supabase
        .from('booking_confirmations')
        .select(`
          *,
          booking:bookings(*),
          ctv_vehicle:ctv_vehicles(*)
        `)
        .eq('confirmation_status', 'pending')
        .gte('expires_at', new Date().toISOString());

      setVehicles(vehiclesData || []);
      setDrivers(driversData || []);
      setPendingBookings(pendingData || []);
      setAssignments(assignmentsData || []);
      setCtvVehicles(ctvData || []);
      setPendingConfirmations(confirmationsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async (bookingId: string) => {
    try {
      setProcessingAutoAssign(true);

      // Call the database function for auto-assignment
      const { data, error } = await supabase
        .rpc('auto_assign_vehicle_and_driver', { p_booking_id: bookingId });

      if (error) throw error;

      const result = data[0];

      if (result.success) {
        // Create the assignment
        const { data: user } = await supabase.auth.getUser();
        
        await supabase
          .from('vehicle_assignments')
          .insert({
            booking_id: bookingId,
            vehicle_id: result.vehicle_id,
            driver_id: result.driver_id,
            assigned_by: user.user?.id,
            auto_assigned: true
          });

        // Update booking status
        await supabase
          .from('bookings')
          .update({ status: 'assigned' })
          .eq('id', bookingId);

        toast({
          title: "Phân xe thành công",
          description: "Hệ thống đã tự động phân xe và lái xe dựa trên độ ưu tiên",
        });

        fetchData();
        setSelectedBooking(null);
      } else {
        // No vehicles available - send to CTV
        toast({
          title: "Không có xe khả dụng",
          description: "Đang gửi yêu cầu đến xe cộng tác viên...",
          variant: "destructive",
        });

        // Call edge function to notify CTV vehicles and managers
        const { data: notifData, error: notifError } = await supabase.functions.invoke('send-vehicle-request', {
          body: { bookingId, notifyManagers: true, notifyCTV: true }
        });

        if (notifError) throw notifError;

        toast({
          title: "Đã gửi thông báo",
          description: `Đã gửi ${notifData.notificationsSent} thông báo đến CTV và điều hành`,
        });

        fetchData();
      }
    } catch (error) {
      console.error('Error auto-assigning:', error);
      toast({
        title: "Lỗi phân xe",
        description: "Không thể thực hiện phân xe tự động",
        variant: "destructive"
      });
    } finally {
      setProcessingAutoAssign(false);
    }
  };

  const handleManualAssign = async () => {
    if (!selectedBooking || !selectedVehicleId || !selectedDriverId) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng chọn xe và lái xe",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();

      await supabase
        .from('vehicle_assignments')
        .insert({
          booking_id: selectedBooking.id,
          vehicle_id: selectedVehicleId,
          driver_id: selectedDriverId,
          assigned_by: user.user?.id,
          auto_assigned: false
        });

      await supabase
        .from('bookings')
        .update({ status: 'assigned' })
        .eq('id', selectedBooking.id);

      toast({
        title: "Phân xe thành công",
        description: "Đã phân xe và lái xe cho booking",
      });

      fetchData();
      setSelectedBooking(null);
      setSelectedVehicleId("");
      setSelectedDriverId("");
    } catch (error) {
      console.error('Error manual assign:', error);
      toast({
        title: "Lỗi phân xe",
        description: "Không thể thực hiện phân xe thủ công",
        variant: "destructive"
      });
    }
  };

  const handleSendToCTV = async (bookingId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-vehicle-request', {
        body: { bookingId, notifyManagers: false, notifyCTV: true }
      });

      if (error) throw error;

      toast({
        title: "Đã gửi yêu cầu",
        description: `Đã gửi ${data.notificationsSent} thông báo đến xe CTV`,
      });

      fetchData();
    } catch (error) {
      console.error('Error sending to CTV:', error);
      toast({
        title: "Lỗi gửi thông báo",
        description: "Không thể gửi yêu cầu đến CTV",
        variant: "destructive"
      });
    }
  };

  const filteredBookings = useMemo(() => {
    return pendingBookings.filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.booking_number?.toLowerCase().includes(searchLower) ||
        booking.customer?.name?.toLowerCase().includes(searchLower) ||
        booking.pickup_location?.toLowerCase().includes(searchLower)
      );
    });
  }, [pendingBookings, searchTerm]);

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Chờ xử lý', variant: 'outline' as const },
      confirmed: { label: 'Đã xác nhận', variant: 'secondary' as const },
      assigned: { label: 'Đã phân xe', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'default' as const },
    };
    const c = config[status as keyof typeof config] || { label: status, variant: 'outline' as const };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Phân xe và lái xe</h1>
        <p className="text-muted-foreground mt-2">
          Tự động phân bổ xe và lái xe dựa trên độ ưu tiên hoặc gửi yêu cầu đến CTV
        </p>
      </div>

      {/* Pending CTV Confirmations Alert */}
      {pendingConfirmations.length > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Có {pendingConfirmations.length} yêu cầu CTV đang chờ xác nhận</AlertTitle>
          <AlertDescription>
            Các xe cộng tác viên đang xem xét các booking. Họ sẽ tự động được phân khi xác nhận.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Booking chờ phân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Xe khả dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lái xe khả dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Xe CTV sẵn sàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctvVehicles.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Chờ phân xe</TabsTrigger>
          <TabsTrigger value="assigned">Đã phân xe</TabsTrigger>
          <TabsTrigger value="ctv">Xe CTV</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Booking chờ phân xe</CardTitle>
                  <CardDescription>Sử dụng tự động phân hoặc chọn thủ công</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tìm kiếm booking..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã booking</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Tuyến đường</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Số khách</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Không có booking nào chờ phân xe
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.booking_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.customer?.name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer?.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {booking.pickup_location} → {booking.dropoff_location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(booking.pickup_datetime).toLocaleString('vi-VN')}
                        </TableCell>
                        <TableCell>{booking.passenger_count}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAutoAssign(booking.id)}
                              disabled={processingAutoAssign}
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Tự động
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              Thủ công
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSendToCTV(booking.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              CTV
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Manual Assignment Panel */}
          {selectedBooking && (
            <Card>
              <CardHeader>
                <CardTitle>Phân xe thủ công - {selectedBooking.booking_number}</CardTitle>
                <CardDescription>
                  {selectedBooking.customer?.name} • {selectedBooking.passenger_count} khách
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Chọn xe</Label>
                    <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn xe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.license_plate} - {vehicle.brand} {vehicle.model} ({vehicle.seats} chỗ) - Ưu tiên: {vehicle.priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chọn lái xe</Label>
                    <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lái xe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.profile?.full_name} - {driver.license_type} - ⭐ {driver.rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleManualAssign}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Xác nhận phân xe
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đã phân xe</CardTitle>
              <CardDescription>Các booking đã được phân bổ xe và lái xe</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Xe</TableHead>
                    <TableHead>Lái xe</TableHead>
                    <TableHead>Loại phân</TableHead>
                    <TableHead>Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Chưa có phân xe nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.booking?.booking_number}</TableCell>
                        <TableCell>
                          {assignment.vehicle ? (
                            <div>
                              <div className="font-medium">{assignment.vehicle.license_plate}</div>
                              <div className="text-sm text-muted-foreground">
                                {assignment.vehicle.brand} {assignment.vehicle.model}
                              </div>
                            </div>
                          ) : assignment.ctv_vehicle ? (
                            <div>
                              <Badge variant="secondary" className="mb-1">CTV</Badge>
                              <div className="font-medium">{assignment.ctv_vehicle.license_plate}</div>
                              <div className="text-sm text-muted-foreground">
                                {assignment.ctv_vehicle.owner_name}
                              </div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {assignment.driver?.profile?.full_name || '-'}
                        </TableCell>
                        <TableCell>
                          {assignment.auto_assigned ? (
                            <Badge variant="secondary">
                              <Zap className="h-3 w-3 mr-1" />
                              Tự động
                            </Badge>
                          ) : (
                            <Badge variant="outline">Thủ công</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(assignment.created_at).toLocaleString('vi-VN')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ctv" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Xe CTV khả dụng</CardTitle>
                <CardDescription>{ctvVehicles.length} xe sẵn sàng nhận chuyến</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ctvVehicles.map((ctv) => (
                    <div key={ctv.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{ctv.license_plate}</div>
                        <div className="text-sm text-muted-foreground">
                          {ctv.owner_name} • {ctv.owner_phone}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ctv.brand} {ctv.model} • {ctv.seats} chỗ
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">⭐ {ctv.rating}</div>
                        <div className="text-xs text-muted-foreground">{ctv.total_trips} chuyến</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yêu cầu đang chờ</CardTitle>
                <CardDescription>{pendingConfirmations.length} yêu cầu chờ CTV xác nhận</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingConfirmations.map((conf) => (
                    <div key={conf.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{conf.booking?.booking_number}</div>
                        <div className="text-sm text-muted-foreground">
                          CTV: {conf.ctv_vehicle?.owner_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Hết hạn: {new Date(conf.expires_at).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <Badge variant="secondary">Chờ xác nhận</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleAssignment;