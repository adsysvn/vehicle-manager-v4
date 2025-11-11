-- Add priority field to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS priority integer DEFAULT 5;

-- Create CTV vehicles table for collaborator vehicles
CREATE TABLE IF NOT EXISTS ctv_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  telegram_id TEXT,
  license_plate TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  seats INTEGER NOT NULL,
  vehicle_type TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'busy', 'inactive')),
  commission_rate NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicle request notifications table
CREATE TABLE IF NOT EXISTS vehicle_request_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  ctv_vehicle_id UUID REFERENCES ctv_vehicles(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('sms', 'telegram', 'email')),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'read')),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create booking confirmations table
CREATE TABLE IF NOT EXISTS booking_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  ctv_vehicle_id UUID REFERENCES ctv_vehicles(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  confirmation_status TEXT DEFAULT 'pending' CHECK (confirmation_status IN ('pending', 'confirmed', 'rejected', 'expired')),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES profiles(id),
  price_offer NUMERIC,
  notes TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add auto_assigned field to vehicle_assignments
ALTER TABLE vehicle_assignments ADD COLUMN IF NOT EXISTS auto_assigned BOOLEAN DEFAULT false;
ALTER TABLE vehicle_assignments ADD COLUMN IF NOT EXISTS ctv_vehicle_id UUID REFERENCES ctv_vehicles(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ctv_vehicles_status ON ctv_vehicles(status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_vehicle_request_notifications_booking ON vehicle_request_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_confirmations_status ON booking_confirmations(confirmation_status);
CREATE INDEX IF NOT EXISTS idx_vehicles_priority ON vehicles(priority, status);

-- Enable RLS
ALTER TABLE ctv_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_request_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_confirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ctv_vehicles
CREATE POLICY "Admins and managers can manage CTV vehicles"
  ON ctv_vehicles FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Authenticated users can view CTV vehicles"
  ON ctv_vehicles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for vehicle_request_notifications
CREATE POLICY "Admins and managers can manage notifications"
  ON vehicle_request_notifications FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Authenticated users can view notifications"
  ON vehicle_request_notifications FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for booking_confirmations
CREATE POLICY "Admins and managers can manage confirmations"
  ON booking_confirmations FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Authenticated users can view confirmations"
  ON booking_confirmations FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create function to auto-assign vehicles based on priority
CREATE OR REPLACE FUNCTION auto_assign_vehicle_and_driver(p_booking_id UUID)
RETURNS TABLE (
  vehicle_id UUID,
  driver_id UUID,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_vehicle_id UUID;
  v_driver_id UUID;
  v_booking RECORD;
BEGIN
  -- Get booking details
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::UUID, NULL::UUID, false, 'Booking not found';
    RETURN;
  END IF;

  -- Find available vehicle with highest priority
  SELECT v.id INTO v_vehicle_id
  FROM vehicles v
  WHERE v.status = 'available'
    AND v.seats >= v_booking.passenger_count
    AND v.id NOT IN (
      SELECT vehicle_id FROM vehicle_assignments va
      WHERE va.start_time <= v_booking.pickup_datetime + INTERVAL '4 hours'
        AND (va.end_time IS NULL OR va.end_time >= v_booking.pickup_datetime)
    )
  ORDER BY v.priority DESC, v.current_mileage ASC
  LIMIT 1;

  -- Find available driver
  SELECT d.id INTO v_driver_id
  FROM drivers d
  WHERE d.status = 'available'
    AND d.id NOT IN (
      SELECT driver_id FROM vehicle_assignments va
      WHERE va.start_time <= v_booking.pickup_datetime + INTERVAL '4 hours'
        AND (va.end_time IS NULL OR va.end_time >= v_booking.pickup_datetime)
    )
  ORDER BY d.rating DESC, d.experience_years DESC
  LIMIT 1;

  IF v_vehicle_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::UUID, false, 'No available vehicles found';
    RETURN;
  END IF;

  IF v_driver_id IS NULL THEN
    RETURN QUERY SELECT v_vehicle_id, NULL::UUID, false, 'Vehicle found but no available driver';
    RETURN;
  END IF;

  RETURN QUERY SELECT v_vehicle_id, v_driver_id, true, 'Assignment successful';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ctv_vehicles_updated_at
  BEFORE UPDATE ON ctv_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_confirmations_updated_at
  BEFORE UPDATE ON booking_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();