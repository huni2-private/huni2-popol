'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, BookOpen, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { name: 'Home',      path: '/',          icon: Home },
  { name: 'About',     path: '/about',     icon: User },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { name: 'Log',       path: '/log',       icon: BookOpen },
  { name: 'Contact',   path: '/contact',   icon: Mail },
];

export default function BottomTabNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-lg border-t border-base-content/5 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link key={tab.path} href={tab.path} className="relative flex flex-col items-center justify-center w-full h-full gap-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-base-content/40'
                }`}
              >
                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {tab.name}
                </span>
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1.5 w-6 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
