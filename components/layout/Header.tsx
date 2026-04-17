'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Log', path: '/log' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-md border-b border-base-content/10 hidden md:block">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <Terminal className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          <span>HUNI<sup className="text-primary text-xs">2</sup></span>
        </Link>

        <nav className="flex items-center gap-8">
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
