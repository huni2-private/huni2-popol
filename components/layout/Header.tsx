'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const navItems = [
    { name: t.nav.home,      path: '/' },
    { name: t.nav.about,     path: '/about' },
    { name: t.nav.portfolio, path: '/portfolio' },
    { name: t.nav.log,       path: '/log' },
    { name: t.nav.contact,   path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-md border-b border-base-content/5 hidden md:block">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-black text-lg tracking-tight">
          HUNI<sup className="text-primary text-[10px] align-super">2</sup>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-base-content/60 hover:text-primary hover:bg-base-content/5'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* 구분선 */}
          <div className="w-px h-4 bg-base-content/10 mx-2" />

          {/* Language Toggle */}
          <div className="flex bg-base-200 rounded-full p-0.5 text-xs font-bold">
            <button
              onClick={() => setLang('ko')}
              className={`px-2.5 py-1 rounded-full transition-all ${lang === 'ko' ? 'bg-base-100 shadow text-primary' : 'text-base-content/40'}`}
            >
              KR
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-base-100 shadow text-primary' : 'text-base-content/40'}`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
