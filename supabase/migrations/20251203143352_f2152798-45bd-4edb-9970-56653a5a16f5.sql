-- Add timezone column to mottos table
ALTER TABLE public.mottos 
ADD COLUMN timezone text;