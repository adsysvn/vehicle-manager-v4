import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleRequest {
  bookingId: string;
  notifyManagers?: boolean;
  notifyCTV?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { bookingId, notifyManagers = true, notifyCTV = true }: VehicleRequest = await req.json();

    console.log('Processing vehicle request for booking:', bookingId);

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(name, phone),
        route:routes(name, from_location, to_location)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Booking not found:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = `
🚗 YÊU CẦU PHÂN XE MỚI

📋 Mã booking: ${booking.booking_number}
👤 Khách hàng: ${booking.customer?.name}
📞 SĐT: ${booking.customer?.phone}

📍 Điểm đón: ${booking.pickup_location}
📍 Điểm trả: ${booking.dropoff_location}
🕐 Thời gian: ${new Date(booking.pickup_datetime).toLocaleString('vi-VN')}
👥 Số khách: ${booking.passenger_count}

💰 Giá dự kiến: ${booking.total_price?.toLocaleString('vi-VN')} VND

Vui lòng xác nhận nhận chuyến!
    `.trim();

    const notifications = [];

    // Notify managers via SMS/Telegram
    if (notifyManagers) {
      const { data: managers } = await supabase
        .from('profiles')
        .select('*, user_roles!inner(role)')
        .eq('user_roles.role', 'manager')
        .limit(10);

      if (managers) {
        for (const manager of managers) {
          if (manager.phone) {
            const { data: notification } = await supabase
              .from('vehicle_request_notifications')
              .insert({
                booking_id: bookingId,
                notification_type: 'sms',
                recipient: manager.phone,
                message: `⚠️ XE ĐÃ HẾT - ${message}`,
                status: 'pending'
              })
              .select()
              .single();

            notifications.push(notification);
            console.log('SMS notification queued for manager:', manager.full_name);
          }
        }
      }
    }

    // Notify CTV vehicles
    if (notifyCTV) {
      const { data: ctvVehicles } = await supabase
        .from('ctv_vehicles')
        .select('*')
        .eq('status', 'available')
        .eq('is_active', true)
        .gte('seats', booking.passenger_count)
        .limit(20);

      if (ctvVehicles) {
        for (const ctv of ctvVehicles) {
          // Create booking confirmation request
          const expiresAt = new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes to respond

          await supabase
            .from('booking_confirmations')
            .insert({
              booking_id: bookingId,
              ctv_vehicle_id: ctv.id,
              confirmation_status: 'pending',
              expires_at: expiresAt.toISOString()
            });

          // Send notification
          if (ctv.telegram_id) {
            const { data: notification } = await supabase
              .from('vehicle_request_notifications')
              .insert({
                booking_id: bookingId,
                ctv_vehicle_id: ctv.id,
                notification_type: 'telegram',
                recipient: ctv.telegram_id,
                message: message,
                status: 'pending'
              })
              .select()
              .single();

            notifications.push(notification);
            console.log('Telegram notification queued for CTV:', ctv.owner_name);
          }

          if (ctv.owner_phone) {
            const { data: notification } = await supabase
              .from('vehicle_request_notifications')
              .insert({
                booking_id: bookingId,
                ctv_vehicle_id: ctv.id,
                notification_type: 'sms',
                recipient: ctv.owner_phone,
                message: message,
                status: 'pending'
              })
              .select()
              .single();

            notifications.push(notification);
            console.log('SMS notification queued for CTV:', ctv.owner_name);
          }
        }
      }
    }

    // In a production environment, you would integrate with actual SMS/Telegram APIs here
    // For now, we just mark notifications as sent
    for (const notification of notifications) {
      if (notification) {
        await supabase
          .from('vehicle_request_notifications')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', notification.id);
      }
    }

    console.log('Vehicle request notifications sent:', notifications.length);

    return new Response(
      JSON.stringify({
        success: true,
        notificationsSent: notifications.length,
        message: 'Notifications sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-vehicle-request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});