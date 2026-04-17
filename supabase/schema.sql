-- ============================================================
-- HUNI² Portfolio CMS — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Projects ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT        NOT NULL,
  description    TEXT        NOT NULL DEFAULT '',
  type           TEXT        NOT NULL DEFAULT 'personal'
                             CHECK (type IN ('personal', 'company')),
  status         TEXT        NOT NULL DEFAULT 'live'
                             CHECK (status IN ('live', 'wip', 'archived')),
  tags           TEXT[]      DEFAULT '{}',
  image_url      TEXT,
  project_url    TEXT,
  github_url     TEXT,
  pdf_url        TEXT,
  display_order  INT         DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Logs (Blog) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS logs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  excerpt     TEXT        DEFAULT '',
  content     TEXT        NOT NULL DEFAULT '',
  tags        TEXT[]      DEFAULT '{}',
  category    TEXT        NOT NULL DEFAULT 'log'
              CHECK (category IN ('log', 'project', 'note')),
  published   BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER logs_updated_at
  BEFORE UPDATE ON logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs     ENABLE ROW LEVEL SECURITY;

-- Anyone can read projects
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT USING (true);

-- Anyone can read published logs; auth users see all
CREATE POLICY "public_read_logs"
  ON logs FOR SELECT
  USING (published = true OR auth.uid() IS NOT NULL);

-- Only authenticated users can write projects
CREATE POLICY "auth_write_projects"
  ON projects FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can write logs
CREATE POLICY "auth_write_logs"
  ON logs FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── Sample Seed Data (optional, remove if not needed) ────────
INSERT INTO projects (title, description, type, status, tags, image_url, project_url, github_url, display_order)
VALUES
  (
    'Personal Digital Realm',
    'Portfolio hub & blog CMS built with Next.js 16 + Supabase. Features server components, DaisyUI theming, and a custom admin panel.',
    'personal', 'live',
    ARRAY['Next.js', 'Supabase', 'DaisyUI', 'TypeScript'],
    NULL, NULL, NULL, 0
  )
ON CONFLICT DO NOTHING;
