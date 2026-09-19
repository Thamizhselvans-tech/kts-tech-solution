import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { INTERNSHIP_TRACKS, saveInternshipApplication } from '../data/portfolioData';

interface InternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrack?: string;
}

export const InternshipModal: React.FC<InternshipModalProps> = ({ isOpen, onClose, preselectedTrack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    department: '',
    academicYear: '',
    internshipTrack: '',
    existingSkills: '',
    githubUrl: '',
    portfolioUrl: '',
    whyJoin: '',
    resumeUrl: '',
    website_hp: ''
  });

  // Body scroll lock & ESC key navigation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  // Sync preselected track when opening or track prop changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (preselectedTrack && INTERNSHIP_TRACKS.includes(preselectedTrack)) {
        setFormData(prev => ({ ...prev, internshipTrack: preselectedTrack }));
      }
    }
  }, [isOpen, preselectedTrack]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setAppId(data.applicationId || data.referenceId);
        setSubmitted(true);
      } else {
        setErrorMessage(data?.message || "We couldn't submit your application right now. Please try again.");
      }
    } catch (err) {
      console.error('[API] Internship submission error:', err);
      setErrorMessage("We couldn't submit your application right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-charcoal/70 backdrop-blur-md"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-ivory-100 rounded-3xl border border-forest-900/20 shadow-forest-card overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 bg-forest-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-light text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-sans">Kryptonode Online Internship Application</h3>
                <p className="text-xs text-gray-300 font-mono">Learn • Build • Experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-8 sm:p-10 text-center space-y-4 my-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-soft text-forest-900 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal font-sans">
                Application Submitted Successfully! 🚀
              </h3>
              <p className="text-xs sm:text-sm text-charcoal/80 max-w-md mx-auto font-sans leading-relaxed">
                Thank you for applying to the Kryptonode Online Internship Program. Student <span className="font-bold text-forest-900">{formData.fullName}</span> for the <span className="font-bold text-emerald">{formData.internshipTrack}</span> track.
              </p>
              <div className="inline-block p-3 rounded-xl bg-ivory-200 text-xs font-mono text-charcoal border border-forest-900/10">
                Application ID: <span className="font-bold text-forest-900">{appId}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-forest-900 hover:bg-emerald text-white text-xs font-bold rounded-xl transition-all"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4 overflow-y-auto font-sans">
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
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs sm:text-sm focus:outline-none focus:border-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs sm:text-sm focus:outline-none focus:border-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs sm:text-sm focus:outline-none focus:border-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="College Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs sm:text-sm focus:outline-none focus:border-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-xs text-charcoal"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Passed Out">Passed Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                  Target Internship Track *
                </label>
                <select
                  value={formData.internshipTrack}
                  onChange={(e) => setFormData({ ...formData, internshipTrack: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs sm:text-sm focus:outline-none focus:border-emerald font-semibold"
                >
                  <option value="">Select Internship Track</option>
                  {INTERNSHIP_TRACKS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                  Existing Technical Skills
                </label>
                <input
                  type="text"
                  value={formData.existingSkills}
                  onChange={(e) => setFormData({ ...formData, existingSkills: e.target.value })}
                  placeholder="e.g. React, JavaScript, Java, Python, Git"
                  className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    GitHub Profile Link
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                    Resume / Portfolio Link
                  </label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="Google Drive link / website URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-1">
                  Why do you want to join this internship? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                  placeholder="Tell us what you hope to build and learn during the program..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-xs resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 bg-forest-900 hover:bg-emerald text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-forest-subtle flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Apply Now →'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
