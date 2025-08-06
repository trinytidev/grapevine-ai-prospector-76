-- Add source_url column to leads table for storing scraped lead URLs
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS source_url TEXT;