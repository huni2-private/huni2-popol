'use client';

import { motion } from 'framer-motion';
import { Briefcase, Code, GraduationCap, Server, Layout, Database } from 'lucide-react';

const timeline = [
  {
    year: '2024 - Present',
    title: 'Senior Full-stack Developer',
    company: 'Tech Solutions Inc.',
    description: 'Leading the development of a microservices-based e-commerce platform using Next.js and Go.',
  },
  {
    year: '2021 - 2024',
    title: 'Full-stack Developer',
    company: 'Digital Wave',
    description: 'Developed and maintained various client projects, focusing on React and Node.js.',
  },
  {
    year: '2019 - 2021',
    title: 'Junior Web Developer',
    company: 'StartUp Lab',
    description: 'Built responsive web applications and integrated third-party APIs.',
  },
];

const skills = [
  { name: 'Frontend', icon: Layout, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { name: 'Backend', icon: Server, items: ['Node.js', 'Express', 'Go', 'Python', 'PostgreSQL'] },
  { name: 'Tools', icon: Database, items: ['Git', 'Docker', 'AWS', 'Supabase', 'Vercel'] },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-20">
      {/* Bio Section */}
      <section className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold"
        >
          Building for the <span className="text-primary italic">Web</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-base-content/70 leading-relaxed"
        >
          I'm a passionate developer with over 7 years of experience in creating digital experiences. 
          I love solving complex problems and turning ideas into functional, beautiful applications. 
          My focus is always on performance, accessibility, and user-centric design.
        </motion.p>
      </section>

      {/* Career Timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" /> Career Path
        </h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-base-content/10 before:to-transparent">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-base-content/10 bg-base-100 group-hover:border-primary group-hover:text-primary transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Code className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-base-content/5 bg-base-200/50 backdrop-blur-sm group-hover:border-primary/20 transition-colors">
                <div className="flex flex-col mb-1">
                  <time className="text-xs font-mono text-primary">{item.year}</time>
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="text-sm opacity-60">{item.company}</span>
                </div>
                <p className="text-sm text-base-content/70">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Grid */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code className="w-6 h-6 text-secondary" /> Tech Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card bg-base-200 border border-base-content/5"
            >
              <div className="card-body p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-base-300 text-secondary">
                    <skill.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">{skill.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span key={item} className="badge badge-ghost border-base-content/10 text-xs py-3">{item}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
