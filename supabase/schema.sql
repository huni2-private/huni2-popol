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

-- ── Site Settings (About + Contact CMS) ─────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "auth_write_settings"
  ON site_settings FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO site_settings (key, value) VALUES
  ('about_bio', '{
    "title_ko": "웹을 위해 구축합니다",
    "title_en": "Building for the Web",
    "desc_ko": "다양한 경험을 가진 풀스택 개발자입니다. 복잡한 문제를 해결하고 아이디어를 기능적이고 아름다운 애플리케이션으로 전환하는 것을 좋아합니다.",
    "desc_en": "A passionate full-stack developer who loves solving complex problems and turning ideas into functional, beautiful applications."
  }'::jsonb),
  ('career_timeline', '[
    {"year":"2024 - Present","title_ko":"시니어 풀스택 개발자","title_en":"Senior Full-stack Developer","company":"Tech Solutions Inc.","desc_ko":"Next.js와 Go를 활용한 마이크로서비스 기반 이커머스 플랫폼 개발 리드.","desc_en":"Leading the development of a microservices-based e-commerce platform using Next.js and Go."},
    {"year":"2021 - 2024","title_ko":"풀스택 개발자","title_en":"Full-stack Developer","company":"Digital Wave","desc_ko":"React와 Node.js를 활용한 다양한 클라이언트 프로젝트 개발 및 유지보수.","desc_en":"Developed and maintained various client projects, focusing on React and Node.js."},
    {"year":"2019 - 2021","title_ko":"주니어 웹 개발자","title_en":"Junior Web Developer","company":"StartUp Lab","desc_ko":"반응형 웹 애플리케이션 구축 및 서드파티 API 통합.","desc_en":"Built responsive web applications and integrated third-party APIs."}
  ]'::jsonb),
  ('tech_stack', '[
    {"name_ko":"프론트엔드","name_en":"Frontend","icon":"Layout","items":["React","Next.js","TypeScript","Tailwind CSS","Framer Motion"]},
    {"name_ko":"백엔드","name_en":"Backend","icon":"Server","items":["Node.js","Express","Go","Python","PostgreSQL"]},
    {"name_ko":"도구","name_en":"Tools","icon":"Database","items":["Git","Docker","AWS","Supabase","Vercel"]}
  ]'::jsonb),
  ('contact_info', '{
    "email": "contact@huni.dev",
    "github": "https://github.com",
    "linkedin": "https://linkedin.com",
    "twitter": "https://twitter.com",
    "resume_pdf": "",
    "greeting_ko": "새로운 기회에 항상 열려 있습니다.",
    "greeting_en": "I''m always open to new opportunities."
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

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
