'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Terminal } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-md border-b border-base-content/10 hidden md:block">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <Terminal className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          <span>HUNI<sup className="text-primary text-xs">2</sup></span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.path ? 'text-primary' : 'text-base-content/70'
              }`}
            >
              {item.name}
            </Link>
          ))}

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
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
