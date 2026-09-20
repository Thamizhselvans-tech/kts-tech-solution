import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, Lock } from 'lucide-react';
import { KryptonodeLogo } from './KryptonodeLogo';

interface NavbarProps {
  onOpenProjectEnquiry: () => void;
  onOpenAdminPortal: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProjectEnquiry,
  onOpenAdminPortal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'services', 'startup-mvp', 'process', 'projects', 'technology', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-ivory-100/90 backdrop-blur-md border-b border-forest-900/10 shadow-forest-subtle'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a href="#home" className="group">
              <KryptonodeLogo size="md" />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 lg:space-x-2 bg-ivory-100/80 backdrop-blur-sm border border-forest-900/10 px-4 py-1.5 rounded-full shadow-forest-subtle">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors duration-200 rounded-full ${
                      isActive ? 'text-forest-900 font-semibold' : 'text-charcoal/70 hover:text-forest-900'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavTab"
                        className="absolute inset-0 bg-emerald-soft rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </a>
                );
              })}
            </nav>

            {/* Actions: Primary CTA & Admin Portal Trigger */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button
                onClick={() => onOpenProjectEnquiry()}
                className="px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-forest-900 hover:bg-emerald text-milk-100 rounded-full shadow-forest-subtle hover:shadow-forest-glow transition-all duration-300 flex items-center gap-1.5 group active:scale-[0.98]"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={onOpenAdminPortal}
                title="Admin Portal (Leads & Applications)"
                className="p-2.5 rounded-full bg-ivory-200 text-charcoal hover:bg-forest-900 hover:text-white border border-forest-900/10 transition-colors"
                aria-label="Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile / Tablet Menu Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => onOpenProjectEnquiry()}
                className="sm:inline-flex hidden px-3.5 py-2 text-xs font-semibold text-white bg-forest-900 hover:bg-emerald rounded-full transition-colors items-center gap-1 shadow-sm"
              >
                <span>Enquire</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-ivory-200 text-charcoal hover:bg-ivory-300 border border-forest-900/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-forest-900" /> : <Menu className="w-5 h-5 text-forest-900" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-ivory-100/95 backdrop-blur-lg border-b border-forest-900/10 shadow-floating px-5 sm:px-8 py-6 lg:hidden max-h-[calc(100vh-75px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-4">
              <div className="text-xs font-mono text-emerald uppercase tracking-widest pb-2 border-b border-forest-900/10 font-bold">
                Kryptonode Navigation
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-charcoal hover:text-forest-900 py-1 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-muted" />
                </a>
              ))}

              <div className="pt-4 border-t border-forest-900/10 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProjectEnquiry();
                  }}
                  className="w-full py-3 px-4 bg-forest-900 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-forest-subtle"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminPortal();
                  }}
                  className="w-full py-2.5 px-4 bg-ivory-200 text-charcoal font-mono text-xs rounded-xl flex items-center justify-center gap-2 border border-forest-900/10"
                >
                  <Lock className="w-3.5 h-3.5 text-forest-900" />
                  Admin Dashboard Portal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
