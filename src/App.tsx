import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { StartupSection } from './components/StartupSection';
import { Process } from './components/Process';
import { Work } from './components/Work';
import { TechnologySection } from './components/TechnologySection';
import { WhyKryptonode } from './components/WhyKryptonode';
import { ContactSection } from './components/ContactSection';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

import { ProjectEnquiryModal } from './components/ProjectEnquiryModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

export function App() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  const handleOpenProjectEnquiry = () => {
    setIsProjectModalOpen(true);
  };

  const handleOpenAdminPortal = () => {
    setIsAdminPortalOpen(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-forest-grid text-charcoal font-sans selection:bg-forest-900 selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenProjectEnquiry={handleOpenProjectEnquiry}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Main Page Sections */}
      <main>
        <Hero onOpenProjectEnquiry={handleOpenProjectEnquiry} />
        <About />
        <Services onOpenProjectEnquiry={handleOpenProjectEnquiry} />
        <StartupSection onOpenProjectEnquiry={handleOpenProjectEnquiry} />
        <Process />
        <Work onOpenProjectEnquiry={handleOpenProjectEnquiry} />
        <TechnologySection />
        <WhyKryptonode />
        <ContactSection />
        <CTA
          onOpenProjectEnquiry={handleOpenProjectEnquiry}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenProjectEnquiry={handleOpenProjectEnquiry}
        onOpenAdminPortal={handleOpenAdminPortal}
      />

      {/* Modals & Portals */}
      <ProjectEnquiryModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}

export default App;
