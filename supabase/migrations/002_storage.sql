-- Create thumbnails storage bucket (run in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to thumbnails
CREATE POLICY "Public thumbnail read"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Allow service role to upload (backend uses service role key)
CREATE POLICY "Service role thumbnail upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Service role thumbnail update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thumbnails');

CREATE POLICY "Service role thumbnail delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails');
