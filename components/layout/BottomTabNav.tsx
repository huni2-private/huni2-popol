'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Briefcase, BookOpen, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: User },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { name: 'Log', path: '/log', icon: BookOpen },
  { name: 'Contact', path: '/contact', icon: Mail },
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
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-primary' : 'text-base-content/50'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{tab.name}</span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-[1px] w-12 h-[2px] bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
