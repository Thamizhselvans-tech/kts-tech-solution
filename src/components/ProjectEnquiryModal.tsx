import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Rocket, AlertCircle, Phone, Mail } from 'lucide-react';
import { saveLead } from '../data/portfolioData';

interface ProjectEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectEnquiryModal: React.FC<ProjectEnquiryModalProps> = ({ isOpen, onClose }) => {
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    website_hp: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side validation: Name must only contain alphabets and spaces
    const nameRegex = /^[a-zA-Z\s]{2,100}$/;
    if (!nameRegex.test(formData.name.trim())) {
      setErrorMessage('Full name must contain only alphabetic letters (at least 2 letters).');
      return;
    }

    // Client-side validation: Phone must be exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setErrorMessage('Phone number must be exactly 10 digits.');
      return;
    }

    // Client-side validation: Project Type is compulsory
    if (!formData.projectType || formData.projectType.trim() === '') {
      setErrorMessage('Please select a project type.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/project-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sourcePage: 'Project Enquiry Modal'
        })
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setSubmittedRef(data.leadId || data.referenceId);
      } else {
        setErrorMessage(data?.message || "We couldn't send your enquiry right now. Please try again or contact our team.");
      }
    } catch (err) {
      console.error('[API] Project enquiry submission error:', err);
      setErrorMessage("We couldn't send your enquiry right now. Please try again or contact our team.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    'Website',
    'Web Application',
    'Mobile App',
    'AI Application',
    'Business Software',
    'E-commerce',
    'Startup MVP',
    'Custom Software',
    'Other'
  ];

  const budgetOptions = [
    'Just Exploring',
    'Under ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    '₹1,00,000+',
    'Need Guidance'
  ];

  const timelineOptions = [
    'ASAP',
    '1–2 Months',
    '2–3 Months',
    '3–6 Months',
    'Flexible'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-ivory-100 rounded-3xl border border-forest-900/20 shadow-forest-card overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 bg-forest-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-light text-white">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-sans">Start Your Project with Kryptonode</h3>
                <p className="text-xs text-gray-300 font-mono">We Build Ideas Into Real Products.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submittedRef ? (
            <div className="p-8 sm:p-10 text-center space-y-4 my-auto font-sans">
              <div className="w-16 h-16 rounded-full bg-emerald-soft text-forest-900 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald" />
              </div>
              <h3 className="text-2xl font-extrabold text-charcoal tracking-tight font-sans">
                Thanks for reaching out. 🚀
              </h3>
              <p className="text-sm text-charcoal/80 max-w-md mx-auto font-sans leading-relaxed">
                Your project enquiry has been received successfully. The Kryptonode team will review your requirements and follow up.
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-ivory-200 text-xs font-mono text-forest-900 font-bold border border-forest-900/10">
                Lead ID: {submittedRef}
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmittedRef(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-forest-900 hover:bg-emerald text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto font-sans">
              
              {/* Spam Honeypot */}
              <input
                type="text"
                name="website_hp"
                value={formData.website_hp}
                onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p>{errorMessage}</p>
                    <p className="mt-1 text-[11px]">Or contact our team directly:</p>
                    <div className="mt-1 flex flex-wrap gap-2 font-mono text-[10px] text-red-800">
                      <span>Thamizhprabha: 8668109481</span> • 
                      <span>Danish Kumar: 9361215922</span> • 
                      <span>Sarveshkumar: 9150185160</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, name: filtered });
                    }}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-sm focus:outline-none focus:border-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-sm focus:outline-none focus:border-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Phone / WhatsApp <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: digits });
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-sm focus:outline-none focus:border-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company or Organization"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-sm focus:outline-none focus:border-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Project Type <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <select
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs font-bold"
                  >
                    <option value="" disabled>Select Project Type</option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs font-bold"
                  >
                    <option value="">Select Budget Range</option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs font-bold"
                  >
                    <option value="">Select Timeline</option>
                    {timelineOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                  Project Description <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you want to build, key features, and requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs resize-none focus:outline-none focus:border-emerald"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-forest-900 hover:bg-emerald disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-forest-subtle flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? 'Sending Enquiry...' : 'Submit Project Enquiry →'}
                </button>
              </div>

              <div className="pt-2 border-t border-forest-900/10 text-center">
                <p className="text-[11px] text-charcoal/70 font-mono">
                  Direct Email: <a href="mailto:kryptonodetech@gmail.com" className="text-emerald font-bold underline">kryptonodetech@gmail.com</a>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
