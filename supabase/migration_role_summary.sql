-- Supabase Dashboard > SQL Editor에서 실행
-- projects 테이블에 프로젝트 상세 상단 요약용 컬럼 추가
-- "기간·팀 규모·내 역할"을 본문(마크다운 설명)을 다 읽기 전에 한 줄로 보여주기 위함.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS role_summary TEXT;
