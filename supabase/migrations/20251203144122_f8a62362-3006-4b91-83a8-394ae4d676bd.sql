-- Remove the public insert policy since inserts now go through the edge function
DROP POLICY IF EXISTS "allow_public_insert" ON public.mottos;