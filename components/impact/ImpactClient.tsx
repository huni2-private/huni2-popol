'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface ImpactStat {
  id: string;
  metric: string;
  title: string;
  context: string;
}

export default function ImpactClient({ stats }: { stats: ImpactStat[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          Impact
        </h1>
        <p className="text-base-content/60 leading-relaxed">
          숫자로 남긴 것들. 실제로 측정하거나 직접 확인한 수치만 적었다.
        </p>
      </motion.div>

      {stats.length === 0 ? (
        <p className="text-base-content/40 italic">등록된 수치가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card bg-base-200 border border-base-content/5 hover:border-primary/30 transition-colors"
            >
              <div className="card-body p-8 gap-3">
                <p className="text-7xl font-black font-mono text-primary leading-none">
                  {stat.metric}
                </p>
                <p className="text-xl font-bold">{stat.title}</p>
                {stat.context && (
                  <p className="text-sm text-base-content/50 font-mono leading-relaxed">
                    {stat.context}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
