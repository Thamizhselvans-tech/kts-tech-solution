import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Terminal } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScope?: { service: string; budget: string; timeframe: string } | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, initialScope }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    if (initialScope) {
      setFormData((prev) => ({
        ...prev,
        service: initialScope.service || prev.service,
        budget: initialScope.budget || prev.budget,
        message: initialScope.timeframe
          ? `Calculated Scope Estimate: Target timeframe is ${initialScope.timeframe}. Details:`
          : prev.message
      }));
    }
  }, [initialScope]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto bg-navy-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-milk-100 rounded-3xl border border-deepblue/20 shadow-floating overflow-hidden my-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-6 sm:px-8 bg-navy-800 text-milk-100 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-electric flex items-center justify-center">
                <Terminal className="w-4 h-4 text-milk-100" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans tracking-tight">Initiate a Co-Build Project</h3>
                <p className="text-[11px] text-gray-300 font-mono">Response within 24 hours guaranteed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-milk-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-navy-800 font-sans">
                Transmission Received
              </h3>
              <p className="text-muted text-sm max-w-md mx-auto font-sans">
                Thank you, <span className="font-semibold text-deepblue">{formData.name}</span>. Our senior technical leads are reviewing your scope inquiry and will respond within 24h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-navy-800 uppercase tracking-wider mb-1.5 font-bold">
                    Your Name <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, name: filtered });
                    }}
                    placeholder="Elena Voss"
                    className="w-full px-4 py-3 rounded-xl bg-softblue/50 border border-deepblue/15 text-navy-800 text-sm focus:outline-none focus:border-electric focus:ring-2 focus:ring-electric/20 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-navy-800 uppercase tracking-wider mb-1.5 font-bold">
                    Work Email <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-softblue/50 border border-deepblue/15 text-navy-800 text-sm focus:outline-none focus:border-electric focus:ring-2 focus:ring-electric/20 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-navy-800 uppercase tracking-wider mb-1.5 font-bold">
                    Target Discipline
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-softblue/50 border border-deepblue/15 text-navy-800 text-sm focus:outline-none focus:border-electric focus:ring-2 focus:ring-electric/20 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-navy-800 uppercase tracking-wider mb-1.5 font-bold">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-softblue/50 border border-deepblue/15 text-navy-800 text-sm focus:outline-none focus:border-electric focus:ring-2 focus:ring-electric/20 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-navy-800 uppercase tracking-wider mb-1.5 font-bold">
                  Project Scope & Overview <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the problem, timeline, and key technical goals..."
                  className="w-full px-4 py-3 rounded-xl bg-softblue/50 border border-deepblue/15 text-navy-800 text-sm focus:outline-none focus:border-electric focus:ring-2 focus:ring-electric/20 font-sans resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-deepblue hover:bg-electric text-milk-100 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-electric-glow transition-all"
                >
                  Submit Scope Inquiry
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
