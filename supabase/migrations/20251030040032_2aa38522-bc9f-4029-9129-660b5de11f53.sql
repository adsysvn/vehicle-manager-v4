-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff', 'driver', 'accountant', 'hr');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.vehicle_status AS ENUM ('available', 'in_use', 'maintenance', 'inactive');
CREATE TYPE public.driver_status AS ENUM ('available', 'on_trip', 'off_duty', 'leave');
CREATE TYPE public.contract_status AS ENUM ('draft', 'active', 'expired', 'terminated');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue');
CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.maintenance_type AS ENUM ('regular', 'repair', 'inspection', 'emergency');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  manager_id UUID,
  parent_id UUID REFERENCES public.departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  department_id UUID REFERENCES public.departments(id),
  employee_code TEXT UNIQUE,
  date_of_birth DATE,
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Update departments manager foreign key
ALTER TABLE public.departments ADD CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES public.profiles(id);

-- Vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  seats INTEGER NOT NULL,
  color TEXT,
  vin TEXT UNIQUE,
  status vehicle_status DEFAULT 'available',
  fuel_type TEXT,
  current_mileage DECIMAL(10,2) DEFAULT 0,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  insurance_expiry DATE,
  registration_expiry DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE NOT NULL,
  license_type TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  status driver_status DEFAULT 'available',
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  experience_years INTEGER,
  emergency_contact TEXT,
  emergency_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  company_name TEXT,
  tax_code TEXT,
  contact_person TEXT,
  customer_type TEXT DEFAULT 'individual',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Routes table
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  distance_km DECIMAL(10,2),
  estimated_duration INTEGER,
  base_price DECIMAL(12,2),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  unit TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status contract_status DEFAULT 'draft',
  total_amount DECIMAL(12,2),
  terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  route_id UUID REFERENCES public.routes(id),
  contract_id UUID REFERENCES public.contracts(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_datetime TIMESTAMPTZ NOT NULL,
  estimated_duration INTEGER,
  passenger_count INTEGER DEFAULT 1,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  distance_km DECIMAL(10,2),
  base_price DECIMAL(12,2),
  total_price DECIMAL(12,2),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Vehicle assignments table
CREATE TABLE public.vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  start_mileage DECIMAL(10,2),
  end_mileage DECIMAL(10,2),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicle_assignments ENABLE ROW LEVEL SECURITY;

-- Fuel management table
CREATE TABLE public.fuel_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  liters DECIMAL(10,2) NOT NULL,
  price_per_liter DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(12,2) NOT NULL,
  mileage DECIMAL(10,2),
  station_name TEXT,
  receipt_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;

-- Maintenance records table
CREATE TABLE public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  type maintenance_type NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(12,2),
  mileage DECIMAL(10,2),
  next_maintenance_date DATE,
  service_provider TEXT,
  invoice_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- Insurance records table
CREATE TABLE public.insurance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  policy_number TEXT NOT NULL,
  provider TEXT NOT NULL,
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  premium DECIMAL(12,2),
  coverage_details TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.insurance_records ENABLE ROW LEVEL SECURITY;

-- Incidents table
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),
  incident_datetime TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  severity incident_severity NOT NULL,
  description TEXT NOT NULL,
  damage_assessment TEXT,
  estimated_cost DECIMAL(12,2),
  insurance_claim_number TEXT,
  status TEXT DEFAULT 'reported',
  resolution TEXT,
  photos TEXT[],
  reported_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  working_hours DECIMAL(5,2),
  overtime_hours DECIMAL(5,2),
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Leave requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status leave_status DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  contract_id UUID REFERENCES public.contracts(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  payment_status payment_status DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  booking_id UUID REFERENCES public.bookings(id),
  receipt_number TEXT,
  payment_method TEXT,
  vendor TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- KPI metrics table
CREATE TABLE public.kpi_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  unit TEXT,
  target_value DECIMAL(12,2),
  weight DECIMAL(5,2),
  calculation_formula TEXT,
  department_id UUID REFERENCES public.departments(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kpi_metrics ENABLE ROW LEVEL SECURITY;

-- KPI records table
CREATE TABLE public.kpi_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id UUID REFERENCES public.kpi_metrics(id) NOT NULL,
  profile_id UUID REFERENCES public.profiles(id),
  department_id UUID REFERENCES public.departments(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  actual_value DECIMAL(12,2) NOT NULL,
  target_value DECIMAL(12,2),
  achievement_rate DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kpi_records ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vehicle_assignments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.maintenance_records FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.insurance_records FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.kpi_metrics FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- RLS Policies

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Departments policies
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins and managers can manage departments" ON public.departments FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins and HR can manage profiles" ON public.profiles FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));

-- Vehicles policies
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage vehicles" ON public.vehicles FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Drivers policies
CREATE POLICY "Authenticated users can view drivers" ON public.drivers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Drivers can view own profile" ON public.drivers FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Admins and managers can manage drivers" ON public.drivers FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Customers policies
CREATE POLICY "Authenticated users can view customers" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage customers" ON public.customers FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Routes policies
CREATE POLICY "Authenticated users can view routes" ON public.routes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage routes" ON public.routes FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Services policies
CREATE POLICY "Authenticated users can view services" ON public.services FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage services" ON public.services FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Contracts policies
CREATE POLICY "Authenticated users can view contracts" ON public.contracts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage contracts" ON public.contracts FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Bookings policies
CREATE POLICY "Authenticated users can view bookings" ON public.bookings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage bookings" ON public.bookings FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Vehicle assignments policies
CREATE POLICY "Authenticated users can view assignments" ON public.vehicle_assignments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage assignments" ON public.vehicle_assignments FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Fuel records policies
CREATE POLICY "Authenticated users can view fuel records" ON public.fuel_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create fuel records" ON public.fuel_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage fuel records" ON public.fuel_records FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Maintenance records policies
CREATE POLICY "Authenticated users can view maintenance" ON public.maintenance_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create maintenance records" ON public.maintenance_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage maintenance" ON public.maintenance_records FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Insurance records policies
CREATE POLICY "Authenticated users can view insurance" ON public.insurance_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage insurance" ON public.insurance_records FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Incidents policies
CREATE POLICY "Authenticated users can view incidents" ON public.incidents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can report incidents" ON public.incidents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage incidents" ON public.incidents FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Attendance policies
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "HR and admins can view all attendance" ON public.attendance FOR SELECT USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
CREATE POLICY "Staff can create attendance" ON public.attendance FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Admins and HR can manage attendance" ON public.attendance FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));

-- Leave requests policies
CREATE POLICY "Users can view own leave requests" ON public.leave_requests FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Managers can view department leave requests" ON public.leave_requests FOR SELECT USING (has_role(auth.uid(), 'manager'));
CREATE POLICY "Users can create leave requests" ON public.leave_requests FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Admins and managers can manage leave requests" ON public.leave_requests FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Invoices policies
CREATE POLICY "Authenticated users can view invoices" ON public.invoices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and accountants can manage invoices" ON public.invoices FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'accountant'));

-- Expenses policies
CREATE POLICY "Authenticated users can view expenses" ON public.expenses FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can create expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and accountants can manage expenses" ON public.expenses FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'accountant'));

-- KPI metrics policies
CREATE POLICY "Authenticated users can view KPI metrics" ON public.kpi_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and managers can manage KPI metrics" ON public.kpi_metrics FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- KPI records policies
CREATE POLICY "Users can view own KPI records" ON public.kpi_records FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Managers can view department KPI records" ON public.kpi_records FOR SELECT USING (has_role(auth.uid(), 'manager'));
CREATE POLICY "Admins can view all KPI records" ON public.kpi_records FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins and managers can manage KPI records" ON public.kpi_records FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));