import React from 'react';
import { Mail, Phone, MessageSquare, ArrowRight, Lock, Instagram, Linkedin } from 'lucide-react';
import { KryptonodeLogo } from './KryptonodeLogo';
import { COMPANY_INFO, TEAM_MEMBERS } from '../data/portfolioData';

interface FooterProps {
  onOpenProjectEnquiry: () => void;
  onOpenAdminPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProjectEnquiry, onOpenAdminPortal }) => {
  return (
    <footer className="bg-transparent border-t border-forest-900/10 pt-12 pb-8 text-charcoal font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-forest-900/10">
          
          {/* Company Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#home">
              <KryptonodeLogo size="md" />
            </a>

            <p className="text-xs text-charcoal/80 leading-relaxed font-sans max-w-sm">
              Kryptonode Tech Solutions Pvt Ltd is a technology company focused on building practical digital products for startups, businesses and creators.
            </p>

            <div className="text-xs font-mono text-forest-900 font-bold italic pt-1">
              "{COMPANY_INFO.headline}"
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal/80 font-medium">
              <li><a href="#home" className="hover:text-forest-900 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-forest-900 transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-forest-900 transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-forest-900 transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-forest-900 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Company Contact & Socials */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-4">
              Company Contact
            </h4>
            
            <div className="flex items-center gap-2 text-xs font-mono text-forest-900 font-bold">
              <Mail className="w-4 h-4 text-emerald shrink-0" />
              <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline">
                {COMPANY_INFO.email}
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-forest-900 font-bold">
              <Phone className="w-4 h-4 text-emerald shrink-0" />
              <a href={`tel:${COMPANY_INFO.phone}`} className="hover:underline">
                {COMPANY_INFO.phoneFormatted}
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-forest-900 font-bold">
              <Instagram className="w-4 h-4 text-emerald shrink-0" />
              <a href={COMPANY_INFO.instagram} target="_blank" rel="noreferrer" className="hover:underline">
                Instagram (@krypotnode_)
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-forest-900 font-bold">
              <Linkedin className="w-4 h-4 text-emerald shrink-0" />
              <a href={COMPANY_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                LinkedIn Profile
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenProjectEnquiry()}
                className="px-4 py-2 bg-forest-900 hover:bg-emerald text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-forest-subtle"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Team Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-charcoal uppercase tracking-wider mb-4">
              Team Contacts
            </h4>
            
            <div className="space-y-2 text-xs font-mono">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center justify-between gap-1 text-charcoal py-0.5">
                  <span className="font-bold text-forest-900">{m.name}:</span>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${m.phone}`} className="hover:underline font-semibold">{m.phone}</a>
                    <a href={m.whatsapp} target="_blank" rel="noreferrer" className="text-emerald hover:underline text-[11px]">WhatsApp</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdminPortal}
                className="text-[11px] font-mono text-emerald-muted hover:text-forest-900 flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3 h-3 text-forest-900" />
                <span>Admin Operations Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/70 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Kryptonode Tech Solutions Pvt Ltd. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
