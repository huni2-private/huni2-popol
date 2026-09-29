-- Supabase Dashboard > SQL Editor에서 실행
--
-- 기존 정책은 "auth.uid() IS NOT NULL"(로그인만 되어 있으면 통과)만 확인했다.
-- 즉 회원가입이 열려 있는 상태에서 다른 사람이 계정을 하나 만들면 그 계정으로도
-- projects/logs/site_settings를 마음대로 읽고 쓸 수 있었다. 로그인 여부가 아니라
-- 지정된 관리자 이메일인지로 바꾼다.
--
-- ⚠️ 'powerhch@gmail.com' 부분을 실제 관리자 계정 이메일로 확인 후 실행하세요.
-- ⚠️ Supabase Dashboard > Authentication > Providers에서 이메일/소셜 회원가입(Sign up)이
--    꺼져 있는지도 함께 확인하는 것을 권장합니다 — RLS는 이미 존재하는 계정의 권한을
--    제한할 뿐, 누구나 새 계정을 만들 수 있는 상태 자체를 막지는 않습니다.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = lower('powerhch@gmail.com');
$$;

-- ── projects ──────────────────────────────────────────────
DROP POLICY IF EXISTS "auth_write_projects" ON projects;
CREATE POLICY "admin_write_projects"
  ON projects FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── logs ──────────────────────────────────────────────────
-- 읽기: 미발행(published=false) 글은 관리자만 볼 수 있어야 한다 (이전엔 로그인만 하면 다 보였음)
DROP POLICY IF EXISTS "public_read_logs" ON logs;
CREATE POLICY "public_read_logs"
  ON logs FOR SELECT
  USING (published = true OR is_admin());

DROP POLICY IF EXISTS "auth_write_logs" ON logs;
CREATE POLICY "admin_write_logs"
  ON logs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── site_settings ─────────────────────────────────────────
DROP POLICY IF EXISTS "auth_write_settings" ON site_settings;
CREATE POLICY "admin_write_settings"
  ON site_settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
