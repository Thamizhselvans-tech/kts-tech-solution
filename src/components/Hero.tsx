import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { TechNodeAnimation } from './TechNodeAnimation';

interface HeroProps {
  onOpenProjectEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenProjectEnquiry }) => {
  return (
    <section id="home" className="relative pt-24 pb-14 md:pt-32 md:pb-16 overflow-hidden bg-transparent">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-soft/60 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-forest-900/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Prominent First-Sight Brand Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-forest-950/5 border border-forest-900/15 text-forest-950 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase mb-5 shadow-forest-subtle">
              <img
                src="/kts-logo.png"
                alt="Kryptonode"
                className="w-5 h-5 rounded-full object-contain p-0.5 bg-black border border-emerald/50 shadow-sm"
              />
              <span className="font-extrabold text-forest-900 font-sans tracking-tight">Kryptonode</span>
              <span className="text-emerald font-mono text-[11px] font-bold">• Tech Solutions Pvt Ltd</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight leading-[1.1] mb-4 font-sans">
              "We Build Ideas Into{' '}
              <span className="text-gradient-forest underline decoration-emerald/30 underline-offset-8">
                Real Products."
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-normal mb-6 max-w-2xl font-sans">
              Kryptonode Tech Solutions helps startups, businesses and creators turn ideas into modern websites, mobile applications, AI-powered solutions and scalable digital products.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-6">
              <button
                onClick={() => onOpenProjectEnquiry()}
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold tracking-wide text-white bg-forest-900 hover:bg-emerald rounded-xl shadow-forest-subtle hover:shadow-forest-glow transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#projects"
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide text-charcoal bg-ivory-100 hover:bg-emerald-soft border border-forest-900/15 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Explore Our Work</span>
                <ChevronRight className="w-4 h-4 text-emerald-muted group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Sub-line */}
            <div className="pt-4 border-t border-forest-900/10 text-xs font-mono font-semibold text-emerald-muted tracking-wide uppercase">
              Websites • Apps • AI • Business Systems • Startup Solutions
            </div>
          </motion.div>

          {/* Right Hero Interactive Animated Tech Node Visual (60fps Emerald Tech Video) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full flex justify-center"
          >
            <TechNodeAnimation />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
