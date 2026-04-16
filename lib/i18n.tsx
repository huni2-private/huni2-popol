"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'ko' | 'en';

const translations = {
  ko: {
    nav: { portfolio: "포트폴리오", admin: "관리자" },
    home: {
      hero_badge: "2026 디지털 아카이브",
      hero_title1: "안녕하세요,",
      hero_title2: "개발자 Huni입니다.",
      hero_desc: "기술로 세상을 더 편리하게 만드는 것을 즐깁니다. 현재는 대용량 텍스트 분석과 사용자 경험(UX) 최적화에 집중하고 있습니다.",
      btn_portfolio: "포트폴리오",
      feature_fast: "성능 지향",
      feature_fast_desc: "0.1초의 지연도 허용하지 않는 최적화된 설계",
      feature_secure: "데이터 보안",
      feature_secure_desc: "신뢰할 수 있는 아키텍처와 보안 프로토콜",
      feature_multi: "사용자 중심",
      feature_multi_desc: "어떤 환경에서도 일관된 사용자 경험 제공",
      split_p_title: "My Projects",
      split_p_desc: "실제로 문제를 해결한 프로젝트들을 확인해 보세요.",
      split_p_btn: "전체 프로젝트 보기",
      quote: "미래를 예측하는 가장 좋은 방법은 그것을 직접 만드는 것이다."
    }
  },
  en: {
    nav: { portfolio: "Portfolio", admin: "Admin" },
    home: {
      hero_badge: "2026 Digital Archive",
      hero_title1: "Hello, I'm",
      hero_title2: "Developer Huni.",
      hero_desc: "I love making the world more convenient through technology. Currently focused on large-scale text analysis and UX optimization.",
      btn_portfolio: "Portfolio",
      feature_fast: "Performance",
      feature_fast_desc: "Optimized design without a 0.1s delay.",
      feature_secure: "Security",
      feature_secure_desc: "Robust architecture and security protocols.",
      feature_multi: "User Centric",
      feature_multi_desc: "Consistent experience on any environment.",
      split_p_title: "My Projects",
      split_p_desc: "Check out projects that actually solved problems.",
      split_p_btn: "View All Projects",
      quote: "The best way to predict the future is to create it."
    }
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('pref-lang') as Language;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('pref-lang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useI18n must be used within LanguageProvider");
  return context;
}
