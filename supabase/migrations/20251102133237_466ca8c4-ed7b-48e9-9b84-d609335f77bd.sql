-- Create enum types for requests module
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE transportation_type AS ENUM ('plane', 'train', 'car', 'personal');
CREATE TYPE accommodation_type AS ENUM ('hotel-5', 'hotel-4', 'hotel-3', 'guesthouse');

-- Create meeting_rooms table
CREATE TABLE public.meeting_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  description TEXT,
  equipment TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_trips table
CREATE TABLE public.business_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  destination TEXT NOT NULL,
  purpose TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  transportation transportation_type NOT NULL,
  accommodation accommodation_type,
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  status request_status DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_room_bookings table
CREATE TABLE public.meeting_room_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.meeting_rooms(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  participants INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  equipment TEXT[],
  status request_status DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_requests table
CREATE TABLE public.shopping_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  purpose TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status request_status DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_request_items table
CREATE TABLE public.shopping_request_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.shopping_requests(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.meeting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_request_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meeting_rooms
CREATE POLICY "Everyone can view meeting rooms"
ON public.meeting_rooms FOR SELECT
USING (true);

CREATE POLICY "Admins can manage meeting rooms"
ON public.meeting_rooms FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for business_trips
CREATE POLICY "Users can view own business trips"
ON public.business_trips FOR SELECT
USING (profile_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Users can create business trips"
ON public.business_trips FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own pending trips"
ON public.business_trips FOR UPDATE
USING (profile_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all business trips"
ON public.business_trips FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for meeting_room_bookings
CREATE POLICY "Users can view own bookings"
ON public.meeting_room_bookings FOR SELECT
USING (profile_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Users can create bookings"
ON public.meeting_room_bookings FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own pending bookings"
ON public.meeting_room_bookings FOR UPDATE
USING (profile_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all bookings"
ON public.meeting_room_bookings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for shopping_requests
CREATE POLICY "Users can view own shopping requests"
ON public.shopping_requests FOR SELECT
USING (profile_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Users can create shopping requests"
ON public.shopping_requests FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own pending requests"
ON public.shopping_requests FOR UPDATE
USING (profile_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all shopping requests"
ON public.shopping_requests FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- RLS Policies for shopping_request_items
CREATE POLICY "Users can view items of their requests"
ON public.shopping_request_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_requests
    WHERE id = request_id 
    AND (profile_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage items of their pending requests"
ON public.shopping_request_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_requests
    WHERE id = request_id 
    AND profile_id = auth.uid()
    AND status = 'pending'
  )
);

CREATE POLICY "Admins can manage all items"
ON public.shopping_request_items FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Create updated_at triggers
CREATE TRIGGER update_meeting_rooms_updated_at
  BEFORE UPDATE ON public.meeting_rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_business_trips_updated_at
  BEFORE UPDATE ON public.business_trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_meeting_room_bookings_updated_at
  BEFORE UPDATE ON public.meeting_room_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_shopping_requests_updated_at
  BEFORE UPDATE ON public.shopping_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample meeting rooms
INSERT INTO public.meeting_rooms (name, capacity, description, equipment) VALUES
('Phòng họp A', 20, 'Phòng họp lớn với đầy đủ tiện nghi', ARRAY['Projector', 'Wifi', 'Whiteboard', 'TV', 'Sound System']),
('Phòng họp B', 10, 'Phòng họp nhỏ phù hợp cho nhóm', ARRAY['Wifi', 'TV', 'Whiteboard']),
('Phòng họp C', 30, 'Phòng hội nghị lớn', ARRAY['Projector', 'Wifi', 'Whiteboard', 'Microphone', 'Sound System', 'Video Conference']),
('Phòng họp D', 50, 'Hội trường chính', ARRAY['Projector', 'Wifi', 'Microphone', 'Sound System', 'Video Conference', 'Stage']);