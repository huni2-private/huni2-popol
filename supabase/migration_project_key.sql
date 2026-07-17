-- ============================================================
-- projects.project_key 추가 — logs.project / impact_stats[].project
-- 짧은 코드네임과 매칭하기 위한 키 (projects.title은 카드에 보이는 정식 이름이라 서로 다름)
-- Supabase Dashboard > SQL Editor 에서 1회 실행
-- ============================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_key TEXT;

UPDATE projects SET project_key = '글방' WHERE title = '글방';
UPDATE projects SET project_key = 'SalesPulse' WHERE title = 'SalesPulse(VIP 세일즈 대시보드)';
UPDATE projects SET project_key = 'BLE미들웨어' WHERE title = 'BLE 체크인 미들웨어';
UPDATE projects SET project_key = 'hunipopol' WHERE title = 'HUNI² 포트폴리오 & 개발일지 사이트';
UPDATE projects SET project_key = 'ImagineAX' WHERE title = 'skax-imagineax 행사페이지';
UPDATE projects SET project_key = 'RoundWait' WHERE title = 'RoundWait(대규모 행사 대기열 관리)';
UPDATE projects SET project_key = 'TimeSlot' WHERE title = 'TimeSlot(행사 예약 운영 플랫폼)';
UPDATE projects SET project_key = 'Chatbot' WHERE title = 'CongKong SaaS Chatbot';

-- '블로그형 회사소개페이지', 'MAPS', 'AI Dev Team(...)'은 연결된 로그/임팩트 태그가
-- 아직 없어서 project_key를 비워둠 — 나중에 admin에서 직접 채우면 됨.

-- 로그 태그 오정정: 'CongKong Chatbot 아키텍처' 글이 project: 'CongKong'으로 잘못 붙어 있어
-- Chatbot 프로젝트로 안 묶였던 것을 바로잡음 (CongKong은 회사명, Chatbot이 실제 프로젝트).
UPDATE logs SET project = 'Chatbot' WHERE project = 'CongKong';

-- project_key가 /portfolio/[key] URL로도 쓰이므로, 두 프로젝트가 같은 키를
-- 갖는 실수를 막기 위해 유니크 제약 추가 (NULL은 여러 개 허용됨).
CREATE UNIQUE INDEX IF NOT EXISTS projects_project_key_idx ON projects (project_key) WHERE project_key IS NOT NULL;
