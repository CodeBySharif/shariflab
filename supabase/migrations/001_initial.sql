-- Sharif Lab initial schema + RLS

CREATE TYPE deploy_platform AS ENUM ('vercel', 'netlify', 'gcp', 'cloudflare', 'other');

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  github_url TEXT,
  deploy_platform deploy_platform,
  description TEXT,
  thumbnail_url TEXT,
  thumbnail_updated_at TIMESTAMPTZ,
  tracking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  site_key TEXT NOT NULL UNIQUE,
  site_secret_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analytics_sessions (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_sec INTEGER,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  is_returning BOOLEAN NOT NULL DEFAULT FALSE,
  page_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES analytics_sessions(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  title TEXT,
  entered_at TIMESTAMPTZ NOT NULL,
  left_at TIMESTAMPTZ,
  dwell_sec INTEGER
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_sessions_project_started ON analytics_sessions(project_id, started_at);
CREATE INDEX idx_sessions_project_visitor ON analytics_sessions(project_id, visitor_id);
CREATE INDEX idx_page_views_project_entered ON page_views(project_id, entered_at);
CREATE INDEX idx_page_views_session ON page_views(session_id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_select ON projects FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY projects_insert ON projects FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY projects_update ON projects FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY projects_delete ON projects FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY sessions_select ON analytics_sessions FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND p.owner_id = auth.uid()));

CREATE POLICY page_views_select ON page_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND p.owner_id = auth.uid()));

-- Storage bucket for thumbnails (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
