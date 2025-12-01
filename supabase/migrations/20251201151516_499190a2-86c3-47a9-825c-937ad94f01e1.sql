CREATE TABLE public.mottos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number SERIAL,
  nickname TEXT,
  motto_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow anyone to read all mottos (needed for carousel)
CREATE POLICY allow_public_read
ON public.mottos
FOR SELECT
USING (true);

-- Allow anyone to insert new mottos (needed for /submit form)
CREATE POLICY allow_public_insert
ON public.mottos
FOR INSERT
WITH CHECK (true);