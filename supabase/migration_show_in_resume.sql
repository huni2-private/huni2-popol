-- Supabase Dashboard > SQL Editor에서 실행
-- projects 테이블에 이력서 포함 여부 컬럼 추가
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS show_in_resume BOOLEAN NOT NULL DEFAULT true;
