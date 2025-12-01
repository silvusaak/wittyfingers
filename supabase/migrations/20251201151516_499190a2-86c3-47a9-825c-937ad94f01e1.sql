CREATE TABLE public.mottos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number SERIAL,
  nickname TEXT,
  motto_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);