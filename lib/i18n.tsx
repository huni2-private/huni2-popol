"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'ko' | 'en';

const translations = {
  ko: {
    nav: {
      home: '홈', about: '소개', portfolio: '포트폴리오',
      log: '로그', contact: '연락', admin: '관리자',
    },
    home: {
      hero_title: '디지털 세계를\n정밀하게 구축합니다.',
      hero_desc: '고성능 웹 애플리케이션과 직관적인 사용자 경험을 전문으로 하는 풀스택 개발자입니다.',
      btn_portfolio: '포트폴리오 보기',
      btn_contact: '연락하기',
      latest_log: '최신 로그',
      recent_work: '최근 작업',
    },
    about: {
      page_title: '소개',
      career_title: '커리어',
      stack_title: '기술 스택',
    },
    contact: {
      page_title: "연결하기",
      page_desc: '새로운 기회에 항상 열려 있습니다.',
      details_title: '연락처',
      social_title: '소셜',
      form_title: '빠른 메시지',
      name_placeholder: '이름',
      email_placeholder: '이메일',
      message_placeholder: '어떻게 도와드릴까요?',
      send_btn: '보내기',
      resume_btn: '이력서 다운로드',
    },
    portfolio: {
      page_title: '작업물',
      page_desc: '개인 실험부터 엔터프라이즈 솔루션까지 다양한 프로젝트를 소개합니다.',
      filter_all: '전체', filter_personal: '개인', filter_company: '기업',
    },
    log: {
      page_title: '로그',
      page_desc: '인사이트, 튜토리얼, 트러블슈팅 노트.',
      search_placeholder: '로그 검색...',
      read_more: '더 보기',
    },
    common: {
      back: '뒤로',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      edit: '편집',
      add: '추가',
    },
  },
  en: {
    nav: {
      home: 'Home', about: 'About', portfolio: 'Portfolio',
      log: 'Log', contact: 'Contact', admin: 'Admin',
    },
    home: {
      hero_title: 'Crafting Digital Realms\nwith Precision.',
      hero_desc: 'Senior Full-stack Developer specializing in high-performance web applications and intuitive user experiences.',
      btn_portfolio: 'Explore Portfolio',
      btn_contact: 'Get in Touch',
      latest_log: 'Latest Log',
      recent_work: 'Recent Work',
    },
    about: {
      page_title: 'About',
      career_title: 'Career Path',
      stack_title: 'Tech Stack',
    },
    contact: {
      page_title: "Let's Connect",
      page_desc: "Have a project in mind or just want to say hi? I'm always open to new opportunities.",
      details_title: 'Contact Details',
      social_title: 'Social Presence',
      form_title: 'Send a Quick Message',
      name_placeholder: 'Your name',
      email_placeholder: 'Your email',
      message_placeholder: 'How can I help you?',
      send_btn: 'Send Message',
      resume_btn: 'Download Resume (PDF)',
    },
    portfolio: {
      page_title: 'Curated Works',
      page_desc: 'A showcase of projects ranging from personal experiments to enterprise solutions.',
      filter_all: 'All', filter_personal: 'Personal', filter_company: 'Company',
    },
    log: {
      page_title: 'Tech Logs',
      page_desc: 'Insights, tutorials, and troubleshooting notes.',
      search_placeholder: 'Search logs...',
      read_more: 'Read Article',
    },
    common: {
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
    },
  },
};

export type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('pref-lang') as Language;
    if (saved === 'ko' || saved === 'en') setLang(saved);
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('pref-lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}
