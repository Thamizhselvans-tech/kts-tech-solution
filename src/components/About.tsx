import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, RefreshCw, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-14 sm:py-16 bg-transparent relative overflow-hidden border-t border-forest-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald uppercase tracking-widest mb-4 font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>ABOUT KRYPTONODE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Heading & Principles */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight leading-none mb-4 font-sans">
              "Technology With{' '}
              <span className="text-gradient-forest underline decoration-emerald/30 underline-offset-8">
                Purpose."
              </span>
            </h2>

            <p className="text-[11px] font-mono text-emerald-muted uppercase tracking-wider mb-6">
              KRYPTONODE TECH SOLUTIONS PVT LTD
            </p>

            {/* Three Principles */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-ivory-50 border border-forest-900/10 flex items-start gap-3.5 shadow-forest-subtle">
                <div className="p-2 rounded-lg bg-forest-900 text-white shrink-0 font-mono text-xs font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-charcoal font-sans mb-0.5">
                    Think
                  </h4>
                  <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                    Understand the problem before writing code.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-forest-900/10 flex items-start gap-3.5 shadow-forest-subtle">
                <div className="p-2 rounded-lg bg-forest-900 text-white shrink-0 font-mono text-xs font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-charcoal font-sans mb-0.5">
                    Build
                  </h4>
                  <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                    Create practical digital solutions.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-forest-900/10 flex items-start gap-3.5 shadow-forest-subtle">
                <div className="p-2 rounded-lg bg-forest-900 text-white shrink-0 font-mono text-xs font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-charcoal font-sans mb-0.5">
                    Improve
                  </h4>
                  <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                    Keep products evolving after launch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy Paragraphs */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="prose prose-lg text-charcoal font-sans leading-relaxed space-y-4">
              <p className="text-lg sm:text-xl font-medium text-charcoal leading-snug">
                Kryptonode Tech Solutions Pvt Ltd is a technology company focused on turning ideas into practical digital products. We work across web development, mobile applications, AI-powered solutions, business software and startup MVP development.
              </p>
              
              <p className="text-charcoal/80 text-xs sm:text-sm leading-relaxed">
                Our approach combines creative product thinking with hands-on engineering — from understanding the problem and designing the experience to developing, testing and launching the final product.
              </p>
            </div>

            {/* Core Focus Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-forest-900/10 font-mono text-xs text-charcoal">
              <div className="p-3.5 rounded-xl bg-emerald-soft border border-forest-900/10 text-center sm:text-left">
                <div className="font-bold text-forest-900 text-xs">Web & Apps</div>
                <div className="text-[10px] text-emerald-muted mt-0.5">Frontend & Mobile</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-soft border border-forest-900/10 text-center sm:text-left">
                <div className="font-bold text-forest-900 text-xs">AI Integrations</div>
                <div className="text-[10px] text-emerald-muted mt-0.5">Intelligent Solutions</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-soft border border-forest-900/10 text-center sm:text-left">
                <div className="font-bold text-forest-900 text-xs">Startup MVPs</div>
                <div className="text-[10px] text-emerald-muted mt-0.5">Zero-to-One Products</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
