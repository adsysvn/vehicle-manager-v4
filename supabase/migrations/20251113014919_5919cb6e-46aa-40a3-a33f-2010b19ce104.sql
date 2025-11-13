-- Create positions table for managing job titles
CREATE TABLE IF NOT EXISTS public.positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  level TEXT,
  department_id UUID REFERENCES public.departments(id),
  description TEXT,
  min_salary NUMERIC,
  max_salary NUMERIC,
  requirements TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  route_id UUID REFERENCES public.routes(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  cargo_type TEXT,
  weight TEXT,
  distance_km NUMERIC,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  valid_until DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customer_care_notes table
CREATE TABLE IF NOT EXISTS public.customer_care_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  contact_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  note TEXT NOT NULL,
  next_action TEXT,
  next_action_date DATE,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'completed',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_care_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for positions
CREATE POLICY "Everyone can view positions"
ON public.positions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and HR can manage positions"
ON public.positions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr'::app_role));

-- RLS Policies for quotations
CREATE POLICY "Authenticated users can view quotations"
ON public.quotations FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create quotations"
ON public.quotations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage quotations"
ON public.quotations FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for customer_care_notes
CREATE POLICY "Authenticated users can view customer care notes"
ON public.customer_care_notes FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create customer care notes"
ON public.customer_care_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and managers can manage customer care notes"
ON public.customer_care_notes FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Add position_id to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position_id UUID REFERENCES public.positions(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON public.quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_care_notes_customer ON public.customer_care_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_positions_department ON public.positions(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_position ON public.profiles(position_id);