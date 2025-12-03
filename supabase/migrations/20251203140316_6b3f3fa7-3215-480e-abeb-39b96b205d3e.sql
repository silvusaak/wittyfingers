-- Enable RLS on mottos table
ALTER TABLE public.mottos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read all mottos (needed for carousel)
CREATE POLICY "allow_public_read"
ON public.mottos
FOR SELECT
USING (true);

-- Allow anyone to insert new mottos (needed for /submit form)
CREATE POLICY "allow_public_insert"
ON public.mottos
FOR INSERT
WITH CHECK (true);