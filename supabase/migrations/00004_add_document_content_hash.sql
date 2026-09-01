ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64);
