"use client";

import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Sparkles, Moon, Sun, Briefcase, User, Home, GitFork, Link2, Mail } from "lucide-react";
import { LanguageProvider, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const NAV_LINKS = [
  { label_key: 'portfolio', href: '/portfolio' },
];

function Header() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 md:py-8 pointer-events-none">
      <div className="container mx-auto max-w-6xl">
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] px-6 md:px-10 py-4 flex items-center justify-between pointer-events-auto transition-all group/nav">
          
          {/* Brand Identity */}
          <Link href="/" className="group flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-[15deg] transition-all duration-500">
              <span className="font-black text-xl md:text-2xl">H²</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg md:text-xl tracking-tighter text-slate-900 dark:text-white leading-none">HUNI²</span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-[0.2em] uppercase mt-1">Creative Lab</span>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={t.nav[link.label_key as keyof typeof t.nav]} />
            ))}
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2"></div>
            <StatusBadge />
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
              <SocialIcon icon={<GitFork className="w-4 h-4" />} href="https://github.com" />
              <SocialIcon icon={<Link2 className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Mail className="w-4 h-4" />} href="#" />
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-500 transition-all active:scale-90"
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
              
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button onClick={() => setLang('ko')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'ko' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>KR</button>
                <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>EN</button>
              </div>
            </div>
          </div>

          {/* Mobile Action (Always visible) */}
          <div className="md:hidden flex items-center space-x-2 pointer-events-auto">
            <button onClick={toggleTheme} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function StatusBadge() {
  return (
    <div className="px-4 py-1.5 flex items-center space-x-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Available for hire</span>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
      {icon}
    </a>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
      {label}
    </Link>
  );
}

function MobileTabBar() {
  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] px-6 py-4 flex items-center justify-around shadow-2xl pointer-events-auto">
      <TabItem href="/" icon={<Home className="w-5 h-5" />} />
      <TabItem href="/portfolio" icon={<Briefcase className="w-5 h-5" />} />
      <TabItem href="/admin" icon={<User className="w-5 h-5" />} />
    </nav>
  );
}

function TabItem({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="p-3 text-white/50 hover:text-white transition-colors active:scale-90">
      {icon}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="light" className={`h-full scroll-smooth ${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('pref-theme');if(s==='light'||s==='dark'){document.documentElement.setAttribute('data-theme',s);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}})();` }} />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
        <LanguageProvider>
          <Header />
          <MobileTabBar />

          <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 dark:bg-violet-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          </div>

          <main className="flex-1 pt-28 md:pt-40 pb-32 container mx-auto px-6 max-w-6xl">
            {children}
          </main>

          <footer className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 py-16 hidden md:block">
            <div className="container mx-auto px-6 max-w-5xl text-center space-y-4">
              <div className="flex justify-center items-center space-x-2 grayscale opacity-50">
                <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded-md flex items-center justify-center text-white dark:text-slate-900 text-[10px] font-black">H²</div>
                <span className="font-black text-sm tracking-tighter">HUNI²</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                © 2026 HUNI² DIGITAL REALM. ALL RIGHTS RESERVED.
              </p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
