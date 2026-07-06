// about_bio + career_timeline + tech_stack 시딩
// node --env-file=.env.local scripts/seed_about.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── About Bio ────────────────────────────────────────────────────────────
const bio = {
  title_ko: 'SK-하이닉스 MAPS, 23만 건 로딩을 5s→1s로. 실무 4개 서비스를 설계·배포한 프론트엔드 개발자.',
  title_en: '5s→1s on 230K rows at SK-hynix MAPS. Sole frontend engineer across 4 live services at CongKong.',
  desc_ko: '실무에서 측정된 성과(로딩 80% 단축, 업로드 5× 향상). CongKong에서 Timeslot·SalesPulse·RoundWait·챗봇 4개 상용 서비스 설계·배포. 기능 구현을 넘어 성능과 사용성까지 책임지는 프론트엔드 개발자입니다.',
  desc_en: 'Measured outcomes at work: 80% faster load, 5× upload speed. Designed and shipped 4 live services at CongKong. A frontend developer who owns the outcome, not just the code.',
};

// ── Career Timeline ───────────────────────────────────────────────────────
const career = [
  {
    year: '2026.03 – 2026.07',
    title_ko: '프론트엔드 개발자',
    title_en: 'Frontend Developer',
    company: 'CongKong Friends Inc.',
    desc_ko: 'Next.js 15 + Go 마이크로서비스 기반 이커머스 플랫폼 프론트엔드 개발. 행사 예약(Timeslot)·VIP 영업 대시보드(SalesPulse)·대기열 시스템(RoundWait)·AI챗봇 4개 서비스 설계 및 프로덕션 배포.',
    desc_en: 'Frontend development on Next.js 15 + Go microservices e-commerce platform. Designed and shipped 4 services: Timeslot, SalesPulse, RoundWait, and AI Chatbot.',
  },
  {
    year: '2025.07 – 2026.01',
    title_ko: '풀스택 개발자',
    title_en: 'Fullstack Developer',
    company: '한화시스템 부트캠프',
    desc_ko: 'React·Node.js 기반 웹 애플리케이션 개발. 팀 프로젝트에서 프론트엔드 아키텍처 설계 및 API 연동 구현.',
    desc_en: 'Built web applications with React and Node.js. Designed frontend architecture and API integration in team projects.',
  },
  {
    year: '2025.04 – 2025.07',
    title_ko: '프론트엔드 개발자',
    title_en: 'Frontend Developer',
    company: 'TARS (SK-하이닉스 MAPS)',
    desc_ko: '23만 건 예약 데이터 로딩 5s→1s 단축. React 기반 대규모 예약 관리 대시보드 성능 최적화 및 신규 기능 개발.',
    desc_en: 'Reduced 230K record load time from 5s to 1s. Built and optimized large-scale reservation management dashboard in React.',
  },
];

// ── Tech Stack ────────────────────────────────────────────────────────────
const stack = [
  {
    name_ko: '언어·프레임워크',
    name_en: 'Languages & Frameworks',
    icon: 'Layout',
    items: ['TypeScript', 'React 19', 'Next.js 15/16', 'Vue 3', 'Tailwind CSS v4'],
  },
  {
    name_ko: '상태·빌드·성능',
    name_en: 'State, Build & Performance',
    icon: 'Cpu',
    items: ['Zustand', 'pnpm Workspaces', 'Turbopack', 'Framer Motion', 'k6'],
  },
  {
    name_ko: '백엔드 (보조)',
    name_en: 'Backend (Supporting)',
    icon: 'Server',
    items: ['Go', 'Node.js', 'Supabase', 'Firebase', 'PostgreSQL', 'Redis'],
  },
  {
    name_ko: '도구·인프라',
    name_en: 'Tools & Infra',
    icon: 'GitBranch',
    items: ['Vercel', 'Docker', 'Git', 'Figma'],
  },
];

// ── Upsert ────────────────────────────────────────────────────────────────
const results = await Promise.all([
  supabase.from('site_settings').upsert({ key: 'about_bio',       value: bio    }, { onConflict: 'key' }),
  supabase.from('site_settings').upsert({ key: 'career_timeline', value: career }, { onConflict: 'key' }),
  supabase.from('site_settings').upsert({ key: 'tech_stack',      value: stack  }, { onConflict: 'key' }),
]);

const errors = results.filter(r => r.error);
if (errors.length) {
  errors.forEach(r => console.error('❌', r.error.message));
  process.exit(1);
} else {
  console.log('✅ about_bio 저장:', bio.title_ko);
  console.log('✅ career_timeline 저장:', career.length, '개');
  career.forEach(c => console.log(`   ${c.year}  ${c.company}  ${c.title_ko}`));
  console.log('✅ tech_stack 저장:', stack.length, '개 카테고리');
}
