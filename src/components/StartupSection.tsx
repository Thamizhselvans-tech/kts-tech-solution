import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, Lightbulb, Compass, Code, CheckCircle2 } from 'lucide-react';

interface StartupSectionProps {
  onOpenProjectEnquiry: () => void;
}

export const StartupSection: React.FC<StartupSectionProps> = ({ onOpenProjectEnquiry }) => {
  const steps = [
    { label: 'IDEA', desc: 'Concept' },
    { label: 'UNDERSTAND', desc: 'Discovery' },
    { label: 'PLAN', desc: 'Roadmap' },
    { label: 'DESIGN', desc: 'UI & UX' },
    { label: 'BUILD', desc: 'Engineering' },
    { label: 'TEST', desc: 'Validation' },
    { label: 'LAUNCH', desc: 'Production' },
    { label: 'GROW', desc: 'Iteration' },
  ];

  return (
    <section id="startup-mvp" className="py-14 sm:py-16 bg-forest-900 text-white relative overflow-hidden border-t border-forest-800">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-forest-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-light uppercase tracking-widest mb-3 font-bold">
          <Rocket className="w-3.5 h-3.5 text-emerald-light" />
          <span>STARTUP MVP & IDEA BUILDER</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-10">
          
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none mb-4 font-sans">
              "Have an Idea?{' '}
              <span className="text-emerald-light underline decoration-white/20 underline-offset-8">
                Let's Build It."
              </span>
            </h2>

            <p className="text-base text-gray-200 leading-relaxed font-sans max-w-2xl mb-6">
              You don't need to have everything figured out before approaching us. Tell us what you're thinking. We'll help break the idea into features, user flows, technology requirements and a practical development roadmap.
            </p>

            <button
              onClick={() => onOpenProjectEnquiry()}
              className="px-6 py-3 bg-emerald-light hover:bg-emerald text-white font-bold text-xs sm:text-sm rounded-xl shadow-forest-glow transition-all flex items-center gap-2 group"
            >
              <span>Discuss My Idea</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Process Flow Ribbon */}
          <div className="lg:col-span-5 bg-forest-800/80 p-5 sm:p-6 rounded-2xl border border-white/10 shadow-forest-card">
            <div className="text-[11px] font-mono font-bold text-emerald-light uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
              IDEA TO LAUNCH ROADMAP
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 font-mono text-xs">
              {steps.map((s, idx) => (
                <div key={s.label} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-light text-xs">{s.label}</div>
                    <div className="text-[10px] text-gray-300">{s.desc}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
