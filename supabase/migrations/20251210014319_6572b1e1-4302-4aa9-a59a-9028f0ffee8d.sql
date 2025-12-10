-- Fix RLS policy for meeting_room_bookings to allow proper updates
DROP POLICY IF EXISTS "Users can update own pending bookings" ON public.meeting_room_bookings;

-- Allow users to update their own bookings (when still pending)
CREATE POLICY "Users can update own pending bookings" 
ON public.meeting_room_bookings 
FOR UPDATE 
USING (profile_id = auth.uid() AND status = 'pending')
WITH CHECK (profile_id = auth.uid());

-- Allow admins/managers to update any booking (for approval actions)
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.meeting_room_bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.meeting_room_bookings 
FOR ALL 
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));