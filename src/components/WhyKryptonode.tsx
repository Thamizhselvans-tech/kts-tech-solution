import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Layers, 
  Sparkles, 
  Users, 
  Network, 
  ArrowRight 
} from 'lucide-react';

export const WhyKryptonode: React.FC = () => {
  const differentiators = [
    {
      number: '01',
      title: 'CUSTOM',
      heading: 'Built Around Your Needs',
      description: 'We design solutions around your actual business requirements instead of forcing your problem into a fixed template.',
      icon: Sliders
    },
    {
      number: '02',
      title: 'MODERN',
      heading: 'Built With Modern Technology',
      description: 'We use current development technologies and practical engineering approaches to create reliable digital products.',
      icon: Cpu
    },
    {
      number: '03',
      title: 'SCALABLE',
      heading: 'Designed To Grow',
      description: 'Our solutions are structured with future expansion, maintainability and scalability in mind.',
      icon: Layers
    },
    {
      number: '04',
      title: 'INTELLIGENT',
      heading: 'Technology With Purpose',
      description: 'We use AI, automation and intelligent technologies where they genuinely improve the solution.',
      icon: Sparkles
    },
    {
      number: '05',
      title: 'USER-FIRST',
      heading: 'Simple Experiences',
      description: 'We focus on clean interfaces, intuitive workflows and experiences that are easy for users to understand.',
      icon: Users
    },
    {
      number: '06',
      title: 'CONNECTED',
      heading: 'Clear Communication',
      description: 'We keep requirements, development progress and project decisions transparent throughout the development journey.',
      icon: Network
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section id="why-kryptonode" className="py-14 sm:py-16 bg-transparent relative overflow-hidden border-t border-forest-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {/* Small Eyebrow Label */}
            <div className="flex items-center gap-2 text-xs font-mono text-emerald uppercase tracking-widest mb-2 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>[ 06 — WHY KRYPTONODE ]</span>
            </div>

            {/* Large Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tracking-tight font-sans">
              Why Kryptonode?
            </h2>

            {/* Supporting Statement */}
            <p className="mt-2 text-xs sm:text-sm text-charcoal/80 font-sans leading-relaxed">
              We don't just build software. We build digital solutions around real problems.
            </p>
          </motion.div>
        </div>

        {/* 6 Core Differentiators Grid (3x2 Desktop, 2x3 Tablet, 1-col Mobile) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {differentiators.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                variants={itemVariants}
                className="group relative p-4 sm:p-6 rounded-2xl bg-ivory-50/90 hover:bg-emerald-soft/40 backdrop-blur-sm border border-forest-900/10 hover:border-emerald/40 shadow-forest-card hover:shadow-[0_10px_25px_-5px_rgba(46,139,87,0.18)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle emerald corner aura on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald/10 via-transparent to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex-1 flex flex-col">
                  {/* Top Row: Number & Icon aligned on a crisp baseline */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-forest-900/5">
                    <span className="font-mono text-xs font-bold text-emerald-muted group-hover:text-emerald transition-colors tracking-wider">
                      {item.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-forest-900/5 text-forest-900 group-hover:bg-forest-900 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-emerald group-hover:text-emerald-light transition-colors" />
                    </div>
                  </div>

                  {/* Titles & Headings aligned across cards */}
                  <div className="space-y-1">
                    <h3 className="font-mono text-sm sm:text-base font-extrabold text-charcoal tracking-wider uppercase group-hover:text-forest-900 transition-colors">
                      {item.title}
                    </h3>
                    <h4 className="text-xs sm:text-sm font-bold font-sans text-forest-900/90 group-hover:text-forest-900 transition-colors">
                      {item.heading}
                    </h4>
                  </div>

                  {/* Description Paragraph */}
                  <p className="text-xs text-charcoal/75 font-sans leading-relaxed mt-2.5">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Statement & CTA with Exact Alignment */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-forest-900/10 relative">
          {/* Subtle Green Accent Line Indicator Seamlessly Aligned to Border */}
          <div className="absolute -top-[1px] left-0 w-32 h-[2px] bg-gradient-to-r from-emerald via-emerald-light to-transparent" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Bottom Statement */}
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-emerald-light shrink-0 shadow-[0_0_6px_rgba(46,139,87,0.5)]" />
              <p className="text-xs sm:text-sm font-semibold text-charcoal font-sans tracking-tight">
                Different problems. One approach. Build it right.
              </p>
            </div>

            {/* Bottom-Right CTA Button */}
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-forest-900 hover:bg-emerald text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-forest-subtle hover:shadow-forest-card transition-all duration-300 group active:scale-[0.98] shrink-0"
            >
              <span>LET'S BUILD</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-light group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
