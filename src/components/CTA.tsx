import React from 'react';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

interface CTAProps {
  onOpenProjectEnquiry: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenProjectEnquiry }) => {
  return (
    <section className="py-14 sm:py-16 bg-forest-900 text-white relative overflow-hidden border-t border-forest-800">
      {/* Background Grid Canvas */}
      <div className="absolute inset-0 bg-forest-grid opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Small Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-light text-xs font-mono font-bold tracking-widest uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          KRYPTONODE TECH SOLUTIONS PVT LTD
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none mb-4 font-sans">
          "Your Idea Could Be The Next{' '}
          <span className="text-emerald-light underline decoration-white/20 underline-offset-8">
            Thing We Build."
          </span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          Tell us what you're thinking. Let's explore what we can create together.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenProjectEnquiry()}
            className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold tracking-wide text-forest-900 bg-white hover:bg-emerald-soft rounded-xl shadow-forest-card transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4 text-forest-900 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#contact"
            className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-4 h-4 text-emerald-light" />
            <span>Chat With Our Team</span>
          </a>
        </div>

      </div>
    </section>
  );
};
