import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmRequest {
  confirmationId: string;
  action: 'confirm' | 'reject';
  priceOffer?: number;
  notes?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { confirmationId, action, priceOffer, notes }: ConfirmRequest = await req.json();

    console.log('Processing confirmation:', confirmationId, action);

    // Get confirmation details
    const { data: confirmation, error: confirmError } = await supabase
      .from('booking_confirmations')
      .select(`
        *,
        booking:bookings(*),
        ctv_vehicle:ctv_vehicles(*)
      `)
      .eq('id', confirmationId)
      .single();

    if (confirmError || !confirmation) {
      return new Response(
        JSON.stringify({ error: 'Confirmation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (confirmation.confirmation_status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'Confirmation already processed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    if (new Date(confirmation.expires_at) < new Date()) {
      await supabase
        .from('booking_confirmations')
        .update({ confirmation_status: 'expired' })
        .eq('id', confirmationId);

      return new Response(
        JSON.stringify({ error: 'Confirmation has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'confirm') {
      // Update confirmation status
      await supabase
        .from('booking_confirmations')
        .update({
          confirmation_status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          price_offer: priceOffer,
          notes: notes
        })
        .eq('id', confirmationId);

      // Create vehicle assignment
      await supabase
        .from('vehicle_assignments')
        .insert({
          booking_id: confirmation.booking_id,
          ctv_vehicle_id: confirmation.ctv_vehicle_id,
          assigned_by: confirmation.confirmed_by,
          start_time: confirmation.booking.pickup_datetime,
          auto_assigned: false
        });

      // Update booking status
      await supabase
        .from('bookings')
        .update({ status: 'assigned' })
        .eq('id', confirmation.booking_id);

      // Update CTV vehicle status
      await supabase
        .from('ctv_vehicles')
        .update({ 
          status: 'busy',
          total_trips: confirmation.ctv_vehicle.total_trips + 1
        })
        .eq('id', confirmation.ctv_vehicle_id);

      // Reject other pending confirmations for this booking
      await supabase
        .from('booking_confirmations')
        .update({ confirmation_status: 'rejected' })
        .eq('booking_id', confirmation.booking_id)
        .eq('confirmation_status', 'pending')
        .neq('id', confirmationId);

      console.log('Booking confirmed and assigned to CTV vehicle');

    } else {
      // Reject confirmation
      await supabase
        .from('booking_confirmations')
        .update({
          confirmation_status: 'rejected',
          notes: notes
        })
        .eq('id', confirmationId);

      console.log('Booking confirmation rejected');
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: action,
        message: `Confirmation ${action}ed successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in confirm-booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});