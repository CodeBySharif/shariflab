-- Add tech stack field to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT;
