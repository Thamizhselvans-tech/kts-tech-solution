import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES, Service } from '../data/portfolioData';
import { Globe, Layers, Smartphone, Cpu, Briefcase, Rocket, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  onOpenProjectEnquiry: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenProjectEnquiry }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-forest-900" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-forest-900" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-forest-900" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-forest-900" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-forest-900" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-forest-900" />;
      default:
        return <Layers className="w-5 h-5 text-forest-900" />;
    }
  };

  return (
    <section id="services" className="py-14 sm:py-16 bg-transparent relative overflow-hidden border-t border-forest-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald uppercase tracking-widest mb-2 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>SERVICES & CAPABILITIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal tracking-tight font-sans">
              Digital solutions built for{' '}
              <span className="text-gradient-forest underline decoration-emerald/30 underline-offset-4">
                real-world use cases.
              </span>
            </h2>
          </div>
          <p className="mt-2 md:mt-0 text-xs sm:text-sm text-charcoal/80 max-w-md font-sans leading-relaxed">
            We focus on clean product engineering, reliable backend workflows, and intuitive user experiences.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card-ivory p-5 sm:p-6 rounded-2xl flex flex-col justify-between group shadow-forest-subtle"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-emerald">
                    {service.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-emerald-soft group-hover:bg-forest-900 transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-charcoal font-sans mb-2 group-hover:text-forest-900 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-charcoal/80 leading-relaxed font-sans mb-6">
                  {service.description}
                </p>
              </div>

              {/* Action buttons on each service card */}
              <div className="pt-4 border-t border-forest-900/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-mono font-bold text-emerald-muted hover:text-forest-900 flex items-center justify-center sm:justify-start gap-1 py-1 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenProjectEnquiry()}
                  className="px-3.5 py-2.5 bg-forest-900 hover:bg-emerald text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-forest-subtle active:scale-[0.98]"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Detail Modal */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-ivory-100 p-5 sm:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-forest-900/15 shadow-forest-card relative my-auto"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-forest-900/10">
                  <span className="text-xs font-mono font-bold text-emerald uppercase">
                    SERVICE {selectedService.number}
                  </span>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 rounded-xl bg-ivory-200 text-charcoal hover:bg-forest-900 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-charcoal font-sans mb-3">
                  {selectedService.title}
                </h3>

                <p className="text-sm text-charcoal/80 leading-relaxed font-sans mb-6">
                  {selectedService.description}
                </p>

                <div className="p-4 rounded-2xl bg-emerald-soft border border-forest-900/10 mb-6 space-y-2 text-xs font-sans text-charcoal">
                  <div className="font-bold text-forest-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald" />
                    Key Focus & Outcomes
                  </div>
                  <p>• Practical feature architecture & user workflow design</p>
                  <p>• Reliable backend integrations & clean database modeling</p>
                  <p>• Cross-device responsiveness and post-launch support</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedService(null);
                    onOpenProjectEnquiry();
                  }}
                  className="w-full py-3 bg-forest-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-forest-subtle"
                >
                  Discuss Your Project →
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
