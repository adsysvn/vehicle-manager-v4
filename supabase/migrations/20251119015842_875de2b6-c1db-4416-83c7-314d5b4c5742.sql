-- Create vehicle_alerts table for automatic alerts system
CREATE TABLE IF NOT EXISTS public.vehicle_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('maintenance', 'insurance', 'registration', 'license', 'fuel', 'speed', 'oil_change')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  due_date DATE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gps_tracking table for vehicle location tracking
CREATE TABLE IF NOT EXISTS public.gps_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  speed NUMERIC(5, 2),
  heading NUMERIC(5, 2),
  altitude NUMERIC(8, 2),
  accuracy NUMERIC(5, 2),
  address TEXT,
  status TEXT DEFAULT 'moving' CHECK (status IN ('moving', 'stopped', 'idle', 'offline')),
  fuel_level NUMERIC(5, 2),
  mileage NUMERIC(10, 2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create oil_change_records table for oil maintenance tracking
CREATE TABLE IF NOT EXISTS public.oil_change_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mileage NUMERIC(10, 2) NOT NULL,
  oil_type TEXT NOT NULL,
  oil_brand TEXT,
  quantity_liters NUMERIC(5, 2) NOT NULL,
  filter_changed BOOLEAN DEFAULT true,
  cost NUMERIC(12, 2),
  next_change_mileage NUMERIC(10, 2),
  next_change_date DATE,
  service_provider TEXT,
  technician_name TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_records table for debt payment tracking
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'credit_card', 'check', 'other')),
  reference_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicle_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oil_change_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicle_alerts
CREATE POLICY "Authenticated users can view alerts"
  ON public.vehicle_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can manage alerts"
  ON public.vehicle_alerts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for gps_tracking
CREATE POLICY "Authenticated users can view GPS data"
  ON public.gps_tracking FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can manage GPS data"
  ON public.gps_tracking FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for oil_change_records
CREATE POLICY "Authenticated users can view oil records"
  ON public.oil_change_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can create oil records"
  ON public.oil_change_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can manage oil records"
  ON public.oil_change_records FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for payment_records
CREATE POLICY "Authenticated users can view payments"
  ON public.payment_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can create payments"
  ON public.payment_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Accountants can manage payments"
  ON public.payment_records FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'accountant'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_vehicle_id ON public.vehicle_alerts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_status ON public.vehicle_alerts(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_alert_type ON public.vehicle_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_vehicle_alerts_due_date ON public.vehicle_alerts(due_date);

CREATE INDEX IF NOT EXISTS idx_gps_tracking_vehicle_id ON public.gps_tracking(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_gps_tracking_recorded_at ON public.gps_tracking(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_gps_tracking_booking_id ON public.gps_tracking(booking_id);

CREATE INDEX IF NOT EXISTS idx_oil_change_vehicle_id ON public.oil_change_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_oil_change_date ON public.oil_change_records(date DESC);

CREATE INDEX IF NOT EXISTS idx_payment_invoice_id ON public.payment_records(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_customer_id ON public.payment_records(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_date ON public.payment_records(payment_date DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_vehicle_alerts_updated_at
  BEFORE UPDATE ON public.vehicle_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_oil_change_records_updated_at
  BEFORE UPDATE ON public.oil_change_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payment_records_updated_at
  BEFORE UPDATE ON public.payment_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create alerts for vehicles
CREATE OR REPLACE FUNCTION public.create_vehicle_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clear existing auto-generated alerts
  DELETE FROM public.vehicle_alerts WHERE status = 'active' AND alert_type IN ('maintenance', 'insurance', 'registration', 'oil_change');
  
  -- Create maintenance alerts (vehicles needing maintenance based on mileage or date)
  INSERT INTO public.vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
  SELECT 
    v.id,
    'maintenance'::TEXT,
    CASE 
      WHEN v.next_maintenance_date <= CURRENT_DATE THEN 'high'
      WHEN v.next_maintenance_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'medium'
      ELSE 'low'
    END::TEXT,
    'Cần bảo dưỡng: ' || v.license_plate,
    'Xe ' || v.license_plate || ' cần bảo dưỡng định kỳ vào ' || TO_CHAR(v.next_maintenance_date, 'DD/MM/YYYY'),
    v.next_maintenance_date
  FROM public.vehicles v
  WHERE v.next_maintenance_date IS NOT NULL 
    AND v.next_maintenance_date <= CURRENT_DATE + INTERVAL '30 days'
    AND v.status != 'inactive';
  
  -- Create insurance expiry alerts
  INSERT INTO public.vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
  SELECT 
    v.id,
    'insurance'::TEXT,
    CASE 
      WHEN v.insurance_expiry <= CURRENT_DATE THEN 'high'
      WHEN v.insurance_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'high'
      WHEN v.insurance_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 'medium'
      ELSE 'low'
    END::TEXT,
    'Bảo hiểm sắp hết hạn: ' || v.license_plate,
    'Bảo hiểm xe ' || v.license_plate || ' hết hạn vào ' || TO_CHAR(v.insurance_expiry, 'DD/MM/YYYY'),
    v.insurance_expiry
  FROM public.vehicles v
  WHERE v.insurance_expiry IS NOT NULL 
    AND v.insurance_expiry <= CURRENT_DATE + INTERVAL '60 days'
    AND v.status != 'inactive';
  
  -- Create registration expiry alerts
  INSERT INTO public.vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
  SELECT 
    v.id,
    'registration'::TEXT,
    CASE 
      WHEN v.registration_expiry <= CURRENT_DATE THEN 'high'
      WHEN v.registration_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'high'
      WHEN v.registration_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 'medium'
      ELSE 'low'
    END::TEXT,
    'Đăng kiểm sắp hết hạn: ' || v.license_plate,
    'Đăng kiểm xe ' || v.license_plate || ' hết hạn vào ' || TO_CHAR(v.registration_expiry, 'DD/MM/YYYY'),
    v.registration_expiry
  FROM public.vehicles v
  WHERE v.registration_expiry IS NOT NULL 
    AND v.registration_expiry <= CURRENT_DATE + INTERVAL '60 days'
    AND v.status != 'inactive';
  
  -- Create oil change alerts based on last oil change
  INSERT INTO public.vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
  SELECT 
    o.vehicle_id,
    'oil_change'::TEXT,
    CASE 
      WHEN o.next_change_date <= CURRENT_DATE THEN 'high'
      WHEN o.next_change_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'medium'
      ELSE 'low'
    END::TEXT,
    'Cần thay dầu: ' || v.license_plate,
    'Xe ' || v.license_plate || ' cần thay dầu vào ' || TO_CHAR(o.next_change_date, 'DD/MM/YYYY'),
    o.next_change_date
  FROM (
    SELECT DISTINCT ON (vehicle_id) 
      vehicle_id, next_change_date
    FROM public.oil_change_records
    WHERE next_change_date IS NOT NULL
    ORDER BY vehicle_id, date DESC
  ) o
  JOIN public.vehicles v ON v.id = o.vehicle_id
  WHERE o.next_change_date <= CURRENT_DATE + INTERVAL '30 days'
    AND v.status != 'inactive';
    
END;
$$;