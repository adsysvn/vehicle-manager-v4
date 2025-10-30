-- Create admin function to create users and profiles
CREATE OR REPLACE FUNCTION create_user_with_profile(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_department_id UUID,
  p_employee_code TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', p_full_name),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO v_user_id;

  -- Create profile
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    department_id,
    employee_code,
    hire_date
  ) VALUES (
    v_user_id,
    p_full_name,
    p_email,
    p_phone,
    p_department_id,
    p_employee_code,
    CURRENT_DATE
  );

  RETURN v_user_id;
END;
$$;

-- Create function to seed sample data
CREATE OR REPLACE FUNCTION seed_sample_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dept_kd_id UUID;
  dept_vh_id UUID;
  dept_kt_id UUID;
  dept_ns_id UUID;
  dept_acc_id UUID;
  dept_lx_id UUID;
  dept_bgd_id UUID;
  v_user_id UUID;
  v_customer_id UUID;
  v_route_id UUID;
  v_contract_id UUID;
  v_booking_id UUID;
  v_vehicle_id UUID;
  v_driver_id UUID;
  i INTEGER;
BEGIN
  -- Get department IDs
  SELECT id INTO dept_bgd_id FROM departments WHERE code = 'BGD';
  SELECT id INTO dept_kd_id FROM departments WHERE code = 'KD';
  SELECT id INTO dept_vh_id FROM departments WHERE code = 'VH';
  SELECT id INTO dept_kt_id FROM departments WHERE code = 'KYTHUAT';
  SELECT id INTO dept_ns_id FROM departments WHERE code = 'NS';
  SELECT id INTO dept_acc_id FROM departments WHERE code = 'KETOAN';
  SELECT id INTO dept_lx_id FROM departments WHERE code = 'LX';

  -- Create admin user
  v_user_id := create_user_with_profile(
    'admin@company.vn',
    'Admin@123',
    'Nguyễn Văn Admin',
    '0901234567',
    dept_bgd_id,
    'ADMIN001'
  );
  INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'admin');

  -- Create Kinh Doanh staff (1-15)
  FOR i IN 1..15 LOOP
    v_user_id := create_user_with_profile(
      'kinhdoanh' || i || '@company.vn',
      'KD' || i || '@123',
      'Nhân viên Kinh Doanh ' || i,
      '090' || LPAD(i::TEXT, 7, '0'),
      dept_kd_id,
      'KD' || LPAD(i::TEXT, 3, '0')
    );
    INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'staff');
  END LOOP;

  -- Create Điều Hành staff (1-7)
  FOR i IN 1..7 LOOP
    v_user_id := create_user_with_profile(
      'dieuhanh' || i || '@company.vn',
      'DH' || i || '@123',
      'Nhân viên Điều Hành ' || i,
      '091' || LPAD(i::TEXT, 7, '0'),
      dept_vh_id,
      'DH' || LPAD(i::TEXT, 3, '0')
    );
    INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'manager');
  END LOOP;

  -- Create Kỹ Thuật staff (1-5)
  FOR i IN 1..5 LOOP
    v_user_id := create_user_with_profile(
      'kythuat' || i || '@company.vn',
      'KT' || i || '@123',
      'Nhân viên Kỹ Thuật ' || i,
      '092' || LPAD(i::TEXT, 7, '0'),
      dept_kt_id,
      'KT' || LPAD(i::TEXT, 3, '0')
    );
    INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'staff');
  END LOOP;

  -- Create Nhân Sự staff (1-3)
  FOR i IN 1..3 LOOP
    v_user_id := create_user_with_profile(
      'nhansu' || i || '@company.vn',
      'NS' || i || '@123',
      'Nhân viên Nhân Sự ' || i,
      '093' || LPAD(i::TEXT, 7, '0'),
      dept_ns_id,
      'NS' || LPAD(i::TEXT, 3, '0')
    );
    INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'hr');
  END LOOP;

  -- Create Kế Toán staff (1-4)
  FOR i IN 1..4 LOOP
    v_user_id := create_user_with_profile(
      'ketoan' || i || '@company.vn',
      'KTC' || i || '@123',
      'Nhân viên Kế Toán ' || i,
      '094' || LPAD(i::TEXT, 7, '0'),
      dept_acc_id,
      'KTC' || LPAD(i::TEXT, 3, '0')
    );
    INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'accountant');
  END LOOP;

  -- Create Drivers (1-12)
  FOR i IN 1..12 LOOP
    v_user_id := create_user_with_profile(
      'laixe' || i || '@company.vn',
      'LX' || i || '@123',
      'Lái xe ' || i,
      '095' || LPAD(i::TEXT, 7, '0'),
      dept_lx_id,
      'LX' || LPAD(i::TEXT, 3, '0')
    );
    INSERT INTO user_roles (user_id, role) VALUES (v_user_id, 'driver');
    
    -- Create driver profile
    INSERT INTO drivers (
      profile_id,
      license_number,
      license_type,
      license_expiry,
      status,
      rating,
      experience_years
    ) VALUES (
      v_user_id,
      'B2-' || LPAD(i::TEXT, 6, '0'),
      'B2',
      CURRENT_DATE + INTERVAL '2 years',
      'available',
      4.5 + (random() * 0.5),
      3 + i
    );
  END LOOP;

  -- Create sample contracts
  SELECT id INTO v_customer_id FROM customers WHERE name = 'Công ty TNHH Du Lịch Việt';
  SELECT id INTO v_user_id FROM profiles WHERE employee_code = 'KD001';
  
  INSERT INTO contracts (
    contract_number,
    customer_id,
    title,
    start_date,
    end_date,
    status,
    total_amount,
    created_by
  ) VALUES (
    'HD-2024-001',
    v_customer_id,
    'Hợp đồng thuê xe du lịch năm 2024',
    '2024-01-01',
    '2024-12-31',
    'active',
    50000000,
    v_user_id
  ) RETURNING id INTO v_contract_id;

  -- Create sample bookings
  SELECT id INTO v_route_id FROM routes WHERE name = 'HN - HP' LIMIT 1;
  
  FOR i IN 1..20 LOOP
    INSERT INTO bookings (
      booking_number,
      customer_id,
      route_id,
      contract_id,
      pickup_location,
      dropoff_location,
      pickup_datetime,
      estimated_duration,
      passenger_count,
      status,
      distance_km,
      base_price,
      total_price,
      created_by
    ) VALUES (
      'BK-2024-' || LPAD(i::TEXT, 4, '0'),
      v_customer_id,
      v_route_id,
      CASE WHEN i <= 10 THEN v_contract_id ELSE NULL END,
      'Hà Nội',
      'Hải Phòng',
      CURRENT_DATE + (i || ' days')::INTERVAL,
      120,
      10 + (i % 15),
      CASE 
        WHEN i <= 5 THEN 'completed'
        WHEN i <= 10 THEN 'assigned'
        WHEN i <= 15 THEN 'confirmed'
        ELSE 'pending'
      END,
      120,
      1500000,
      1500000 + (i * 50000),
      v_user_id
    ) RETURNING id INTO v_booking_id;

    -- Assign vehicles and drivers to some bookings
    IF i <= 10 THEN
      SELECT id INTO v_vehicle_id FROM vehicles ORDER BY random() LIMIT 1;
      SELECT id INTO v_driver_id FROM drivers ORDER BY random() LIMIT 1;
      
      INSERT INTO vehicle_assignments (
        booking_id,
        vehicle_id,
        driver_id,
        assigned_by,
        start_mileage,
        start_time
      ) VALUES (
        v_booking_id,
        v_vehicle_id,
        v_driver_id,
        v_user_id,
        25000 + (i * 100),
        CURRENT_DATE + (i || ' days')::INTERVAL
      );
    END IF;
  END LOOP;

  -- Create sample invoices
  FOR i IN 1..10 LOOP
    SELECT id INTO v_booking_id FROM bookings WHERE status = 'completed' ORDER BY random() LIMIT 1;
    
    INSERT INTO invoices (
      invoice_number,
      customer_id,
      booking_id,
      issue_date,
      due_date,
      subtotal,
      tax_amount,
      total_amount,
      paid_amount,
      payment_status,
      created_by
    ) VALUES (
      'INV-2024-' || LPAD(i::TEXT, 4, '0'),
      v_customer_id,
      v_booking_id,
      CURRENT_DATE - (i || ' days')::INTERVAL,
      CURRENT_DATE - (i || ' days')::INTERVAL + INTERVAL '30 days',
      1500000,
      150000,
      1650000,
      CASE WHEN i <= 5 THEN 1650000 ELSE 0 END,
      CASE WHEN i <= 5 THEN 'paid' ELSE 'pending' END,
      v_user_id
    );
  END LOOP;

  -- Create sample fuel records
  FOR i IN 1..15 LOOP
    SELECT id INTO v_vehicle_id FROM vehicles ORDER BY random() LIMIT 1;
    SELECT id INTO v_driver_id FROM drivers ORDER BY random() LIMIT 1;
    
    INSERT INTO fuel_records (
      vehicle_id,
      driver_id,
      date,
      liters,
      price_per_liter,
      total_cost,
      mileage,
      station_name,
      created_by
    ) VALUES (
      v_vehicle_id,
      v_driver_id,
      CURRENT_DATE - (i || ' days')::INTERVAL,
      30 + (i * 2),
      23000,
      (30 + i * 2) * 23000,
      25000 + (i * 200),
      'Petrolimex số ' || i,
      v_user_id
    );
  END LOOP;

  -- Create sample maintenance records
  FOR i IN 1..8 LOOP
    SELECT id INTO v_vehicle_id FROM vehicles ORDER BY random() LIMIT 1;
    
    INSERT INTO maintenance_records (
      vehicle_id,
      type,
      date,
      description,
      cost,
      mileage,
      next_maintenance_date,
      service_provider,
      created_by
    ) VALUES (
      v_vehicle_id,
      CASE WHEN i % 3 = 0 THEN 'regular' WHEN i % 3 = 1 THEN 'repair' ELSE 'inspection' END,
      CURRENT_DATE - (i * 7 || ' days')::INTERVAL,
      'Bảo dưỡng định kỳ ' || i,
      500000 + (i * 100000),
      25000 + (i * 1000),
      CURRENT_DATE + (30 || ' days')::INTERVAL,
      'Garage Toyota ' || i,
      v_user_id
    );
  END LOOP;

  -- Create sample expenses
  FOR i IN 1..12 LOOP
    INSERT INTO expenses (
      category,
      description,
      amount,
      date,
      payment_method,
      vendor,
      created_by
    ) VALUES (
      CASE WHEN i % 4 = 0 THEN 'Nhiên liệu' WHEN i % 4 = 1 THEN 'Bảo trì' WHEN i % 4 = 2 THEN 'Văn phòng' ELSE 'Khác' END,
      'Chi phí ' || CASE WHEN i % 4 = 0 THEN 'nhiên liệu' WHEN i % 4 = 1 THEN 'sửa chữa' WHEN i % 4 = 2 THEN 'văn phòng phẩm' ELSE 'khác' END || ' tháng ' || i,
      200000 + (i * 50000),
      CURRENT_DATE - (i || ' days')::INTERVAL,
      CASE WHEN i % 2 = 0 THEN 'Tiền mặt' ELSE 'Chuyển khoản' END,
      'Nhà cung cấp ' || i,
      v_user_id
    );
  END LOOP;

  -- Create sample leave requests
  FOR i IN 1..10 LOOP
    SELECT id INTO v_user_id FROM profiles WHERE employee_code LIKE 'KD%' ORDER BY random() LIMIT 1;
    
    INSERT INTO leave_requests (
      profile_id,
      leave_type,
      start_date,
      end_date,
      total_days,
      reason,
      status
    ) VALUES (
      v_user_id,
      CASE WHEN i % 3 = 0 THEN 'Nghỉ phép' WHEN i % 3 = 1 THEN 'Nghỉ ốm' ELSE 'Nghỉ việc riêng' END,
      CURRENT_DATE + (i || ' days')::INTERVAL,
      CURRENT_DATE + ((i + 2) || ' days')::INTERVAL,
      3,
      'Lý do nghỉ ' || i,
      CASE WHEN i <= 5 THEN 'approved' WHEN i <= 8 THEN 'pending' ELSE 'rejected' END
    );
  END LOOP;

END;
$$;