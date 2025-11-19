-- Fix function search path security issue
DROP FUNCTION IF EXISTS public.create_vehicle_alerts();

CREATE OR REPLACE FUNCTION public.create_vehicle_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Clear existing auto-generated alerts
  DELETE FROM vehicle_alerts WHERE status = 'active' AND alert_type IN ('maintenance', 'insurance', 'registration', 'oil_change');
  
  -- Create maintenance alerts
  INSERT INTO vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
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
  FROM vehicles v
  WHERE v.next_maintenance_date IS NOT NULL 
    AND v.next_maintenance_date <= CURRENT_DATE + INTERVAL '30 days'
    AND v.status != 'inactive';
  
  -- Create insurance expiry alerts
  INSERT INTO vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
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
  FROM vehicles v
  WHERE v.insurance_expiry IS NOT NULL 
    AND v.insurance_expiry <= CURRENT_DATE + INTERVAL '60 days'
    AND v.status != 'inactive';
  
  -- Create registration expiry alerts
  INSERT INTO vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
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
  FROM vehicles v
  WHERE v.registration_expiry IS NOT NULL 
    AND v.registration_expiry <= CURRENT_DATE + INTERVAL '60 days'
    AND v.status != 'inactive';
  
  -- Create oil change alerts
  INSERT INTO vehicle_alerts (vehicle_id, alert_type, severity, title, message, due_date)
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
    FROM oil_change_records
    WHERE next_change_date IS NOT NULL
    ORDER BY vehicle_id, date DESC
  ) o
  JOIN vehicles v ON v.id = o.vehicle_id
  WHERE o.next_change_date <= CURRENT_DATE + INTERVAL '30 days'
    AND v.status != 'inactive';
END;
$$;