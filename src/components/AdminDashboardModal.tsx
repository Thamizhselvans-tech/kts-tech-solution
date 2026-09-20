import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Search, Filter, CheckCircle2, User, Mail, Phone, FileText, Download, Edit3, Briefcase, GraduationCap, Eye, EyeOff, LogOut, Trash2 } from 'lucide-react';
import { getStoredLeads, updateLeadStatus, deleteStoredLead, getStoredInternships, updateInternshipStatus, deleteStoredInternship, Lead, InternshipApplication } from '../data/portfolioData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [adminToken, setAdminToken] = useState<string | null>(() => sessionStorage.getItem('kn_admin_token'));
  const [authenticated, setAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem('kn_admin_token'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'leads' | 'internships' | 'enquiries'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [internships, setInternships] = useState<InternshipApplication[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotesInput, setLeadNotesInput] = useState('');

  const fetchLeads = (token: string) => {
    fetch('/api/admin/leads', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
          setAuthError('Session expired. Please log in again.');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          if (data.leads) setLeads(data.leads);
          if (data.internships) setInternships(data.internships);
          if (data.enquiries) setEnquiries(data.enquiries);
        }
      })
      .catch(() => {
        // Fallback
      });
  };

  useEffect(() => {
    if (isOpen) {
      setLeads(getStoredLeads());
      setInternships(getStoredInternships());
      if (adminToken) {
        fetchLeads(adminToken);
      }
    }
  }, [isOpen, adminToken]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    const cleanedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanedEmail, password })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('kn_admin_token', data.token);
        setAuthenticated(true);
        setPassword('');
        setAuthError(null);
        fetchLeads(data.token);
      } else {
        setAuthError(data?.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setAuthError('Authentication service is temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setAdminToken(null);
    sessionStorage.removeItem('kn_admin_token');
    setEmail('');
    setPassword('');
    setAuthError(null);
  };

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updated = updateLeadStatus(leadId, newStatus, leadNotesInput);
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus, notes: leadNotesInput });
    }
    if (adminToken) {
      fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: leadId, type: 'lead', status: newStatus, notes: leadNotesInput })
      }).catch(() => {});
    }
  };

  const handleInternshipStatusChange = (appId: string, newStatus: InternshipApplication['status']) => {
    const updated = updateInternshipStatus(appId, newStatus);
    setInternships(updated);
    if (adminToken) {
      fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: appId, type: 'internship', status: newStatus })
      }).catch(() => {});
    }
  };

  const handleEnquiryStatusChange = (enquiryId: string, newStatus: string) => {
    setEnquiries(prev => prev.map(e => (e.enquiryId === enquiryId || e.id === enquiryId) ? { ...e, status: newStatus } : e));
    if (adminToken) {
      fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: enquiryId, type: 'enquiry', status: newStatus })
      }).catch(() => {});
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete lead ${leadId}?`)) {
      return;
    }

    setLeads((prev) => prev.filter((l: any) => (l.leadId !== leadId && l.referenceId !== leadId && l.id !== leadId)));
    if (selectedLead && (selectedLead.id === leadId || selectedLead.referenceId === leadId || (selectedLead as any).leadId === leadId)) {
      setSelectedLead(null);
    }
    deleteStoredLead(leadId);

    if (adminToken) {
      try {
        await fetch('/api/admin/leads', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ id: leadId, type: 'lead' })
        });
      } catch (err) {
        console.error('Failed to delete lead from server:', err);
      }
    }
  };

  const handleDeleteInternship = async (appId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this application?')) {
      return;
    }

    setInternships((prev) => prev.filter((a: any) => (a.id !== appId && a.applicationId !== appId && a.referenceId !== appId)));
    deleteStoredInternship(appId);

    if (adminToken) {
      try {
        await fetch('/api/admin/leads', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ id: appId, type: 'internship' })
        });
      } catch (err) {
        console.error('Failed to delete application from server:', err);
      }
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this enquiry?')) {
      return;
    }

    setEnquiries((prev) => prev.filter((e: any) => (e.id !== enquiryId && e.enquiryId !== enquiryId && e.referenceId !== enquiryId)));

    if (adminToken) {
      try {
        await fetch('/api/admin/leads', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ id: enquiryId, type: 'enquiry' })
        });
      } catch (err) {
        console.error('Failed to delete enquiry from server:', err);
      }
    }
  };

  const filteredLeads = leads.filter((l: any) => {
    const q = searchQuery.toLowerCase();
    const idStr = (l.leadId || l.referenceId || l.id || '').toLowerCase();
    const phoneStr = (l.phone || '').toLowerCase();
    const matchesSearch = (l.name || '').toLowerCase().includes(q) ||
                          (l.email || '').toLowerCase().includes(q) ||
                          (l.projectType || '').toLowerCase().includes(q) ||
                          idStr.includes(q) ||
                          phoneStr.includes(q);
    const matchesFilter = filterStatus === 'All' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredInternships = internships.filter((a: any) => {
    const q = searchQuery.toLowerCase();
    const idStr = (a.applicationId || a.referenceId || a.id || '').toLowerCase();
    const phoneStr = (a.phone || '').toLowerCase();
    const matchesSearch = (a.fullName || a.name || '').toLowerCase().includes(q) ||
                          (a.email || '').toLowerCase().includes(q) ||
                          (a.internshipTrack || '').toLowerCase().includes(q) ||
                          (a.college || '').toLowerCase().includes(q) ||
                          idStr.includes(q) ||
                          phoneStr.includes(q);
    return matchesSearch;
  });

  const filteredEnquiries = enquiries.filter((e: any) => {
    const q = searchQuery.toLowerCase();
    const idStr = (e.enquiryId || e.referenceId || e.id || '').toLowerCase();
    const phoneStr = (e.phone || '').toLowerCase();
    const matchesSearch = (e.name || '').toLowerCase().includes(q) ||
                          (e.email || '').toLowerCase().includes(q) ||
                          (e.enquiryType || '').toLowerCase().includes(q) ||
                          (e.message || '').toLowerCase().includes(q) ||
                          idStr.includes(q) ||
                          phoneStr.includes(q);
    return matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-charcoal/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-ivory-100 rounded-2xl sm:rounded-3xl border border-forest-900/20 shadow-forest-card overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 sm:p-6 bg-forest-900 text-white shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-light text-white shrink-0">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-bold font-sans">Kryptonode Admin Lead & Application Portal</h3>
                <p className="text-[11px] sm:text-xs text-gray-300 font-mono">Secure Internal Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {authenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white text-[11px] sm:text-xs font-mono transition-colors font-bold border border-red-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {!authenticated ? (
            /* Login View */
            <div className="p-8 sm:p-10 max-w-md w-full mx-auto my-auto space-y-6 font-sans">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-soft text-forest-900 mx-auto flex items-center justify-center">
                  <Lock className="w-7 h-7 text-emerald" />
                </div>
                <h3 className="text-xl font-bold text-charcoal">Admin Portal Authentication</h3>
                <p className="text-xs text-charcoal/70 font-mono">Sign in to access client leads & enquiries</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-left text-xs font-mono font-bold text-charcoal mb-1.5">
                    ADMIN EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    className="w-full px-4 py-3 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-sm focus:outline-none focus:border-emerald font-sans"
                  />
                </div>

                <div>
                  <label className="block text-left text-xs font-mono font-bold text-charcoal mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-ivory-50 border border-forest-900/15 text-charcoal text-sm focus:outline-none focus:border-emerald font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/50 hover:text-charcoal p-1 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <p className="text-xs text-red-600 font-mono text-center font-semibold bg-red-50 border border-red-200 p-2.5 rounded-xl">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-forest-900 hover:bg-forest-900/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-forest-subtle transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Authenticating...' : 'Access Dashboard →'}
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard Body */
            <div className="p-6 overflow-y-auto space-y-6 font-sans">
              
              {/* Dashboard Nav Tabs & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-forest-900 text-white shadow-forest-subtle">
                  <div className="text-xs font-mono text-gray-300">TOTAL PROJECT LEADS</div>
                  <div className="text-3xl font-extrabold font-sans mt-1">{leads.length}</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-soft border border-forest-900/10">
                  <div className="text-xs font-mono text-emerald-muted">NEW UNREAD LEADS</div>
                  <div className="text-3xl font-extrabold text-forest-900 font-sans mt-1">
                    {leads.filter((l) => l.status === 'New').length}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-ivory-50 border border-forest-900/10">
                  <div className="text-xs font-mono text-emerald-muted">INTERNSHIP APPS</div>
                  <div className="text-3xl font-extrabold text-charcoal font-sans mt-1">{internships.length}</div>
                </div>

                <div className="p-4 rounded-2xl bg-ivory-50 border border-forest-900/10">
                  <div className="text-xs font-mono text-emerald-muted">WON PROJECTS</div>
                  <div className="text-3xl font-extrabold text-forest-900 font-sans mt-1">
                    {leads.filter((l) => l.status === 'Won').length}
                  </div>
                </div>
              </div>

              {/* View Switcher & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-forest-900/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      activeTab === 'leads' ? 'bg-forest-900 text-white' : 'bg-ivory-200 text-charcoal'
                    }`}
                  >
                    Project Leads ({leads.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('internships')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      activeTab === 'internships' ? 'bg-forest-900 text-white' : 'bg-ivory-200 text-charcoal'
                    }`}
                  >
                    Internship Applications ({internships.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      activeTab === 'enquiries' ? 'bg-forest-900 text-white' : 'bg-ivory-200 text-charcoal'
                    }`}
                  >
                    General Enquiries ({enquiries.length})
                  </button>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-emerald-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, ref..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-ivory-50 border border-forest-900/15 text-xs text-charcoal focus:outline-none focus:border-emerald font-sans"
                  />
                </div>
              </div>

              {activeTab === 'leads' ? (
                /* LEADS TABLE */
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-emerald-muted sm:hidden flex items-center justify-between px-1">
                    <span>Swipe horizontally for full details →</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-forest-900/10 -webkit-overflow-scrolling-touch">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-forest-900 text-white font-mono text-[11px] uppercase">
                        <tr>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Name & Email</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Project Type</th>
                          <th className="p-3">Budget</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-forest-900/10 bg-ivory-50">
                        {filteredLeads.map((lead) => {
                          const leadKey = lead.id || lead.referenceId || lead.leadId || (lead as any)._id;
                          const refId = lead.referenceId || lead.leadId || lead.id || 'KN-PENDING';
                          const budgetVal = lead.budget || (lead as any).budgetRange || 'Guidance Needed';
                          return (
                            <tr key={leadKey} className="hover:bg-emerald-soft/50 transition-colors">
                              <td className="p-3 font-mono font-bold text-forest-900">{refId}</td>
                              <td className="p-3">
                                <div className="font-bold text-charcoal">{lead.name}</div>
                                <div className="text-[11px] text-emerald-muted font-mono">{lead.email}</div>
                              </td>
                              <td className="p-3 font-mono">
                                <a href={`tel:${lead.phone}`} className="hover:underline text-forest-900 font-bold">
                                  {lead.phone}
                                </a>
                              </td>
                              <td className="p-3 font-semibold">{lead.projectType}</td>
                              <td className="p-3 font-mono">{budgetVal}</td>
                              <td className="p-3">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleStatusChange(lead.id || refId, e.target.value as any)}
                                  className="px-2 py-1 rounded bg-ivory-100 border border-forest-900/15 text-[11px] font-mono font-bold text-forest-900"
                                >
                                  <option>New</option>
                                  <option>Contacted</option>
                                  <option>Discussion</option>
                                  <option>Proposal Sent</option>
                                  <option>Won</option>
                                  <option>Lost</option>
                                </select>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedLead(lead)}
                                    className="px-2.5 py-1 bg-forest-900 text-white rounded-lg font-mono text-[11px] hover:bg-emerald transition-colors whitespace-nowrap"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLead(refId)}
                                    className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-200 hover:border-red-600"
                                    title="Delete Lead"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Selected Lead Details Inspector Drawer */}
                  {selectedLead && (
                    <div className="p-6 rounded-2xl bg-ivory-50 border border-forest-900/15 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-forest-900/10">
                        <span className="font-mono text-xs font-bold text-forest-900">
                          LEAD DETAILS — {selectedLead.referenceId}
                        </span>
                        <button
                          onClick={() => setSelectedLead(null)}
                          className="text-xs font-mono text-emerald-muted hover:underline"
                        >
                          Close Inspector
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                        <div>
                          <span className="font-mono text-emerald-muted text-[10px]">Client Name:</span>
                          <div className="font-bold text-charcoal">{selectedLead.name}</div>
                        </div>
                        <div>
                          <span className="font-mono text-emerald-muted text-[10px]">Email & Phone:</span>
                          <div className="font-bold text-charcoal">{selectedLead.email} • {selectedLead.phone}</div>
                        </div>
                        <div>
                          <span className="font-mono text-emerald-muted text-[10px]">Submitted Date:</span>
                          <div className="font-bold text-charcoal">{selectedLead.date}</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-ivory-100 border border-forest-900/10 text-xs font-sans">
                        <div className="font-mono text-[10px] text-emerald-muted font-bold uppercase mb-1">Project Scope & Description:</div>
                        <p className="text-charcoal leading-relaxed">{selectedLead.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="px-4 py-2 bg-forest-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Client</span>
                        </a>
                        <a
                          href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-soft text-forest-900 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-forest-900/10"
                        >
                          <span>WhatsApp Message</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'internships' ? (
                /* INTERNSHIP APPLICATIONS TABLE */
                <div className="overflow-x-auto rounded-2xl border border-forest-900/10">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-forest-900 text-white font-mono text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Track</th>
                        <th className="p-3">College & Dept</th>
                        <th className="p-3">Phone & Email</th>
                        <th className="p-3">Applied Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest-900/10 bg-ivory-50">
                      {filteredInternships.map((app) => {
                        const appKey = app.id || app.applicationId || (app as any)._id;
                        const appId = app.applicationId || app.id || (app as any)._id;
                        return (
                          <tr key={appKey} className="hover:bg-emerald-soft/50 transition-colors">
                            <td className="p-3 font-bold text-charcoal">{app.fullName}</td>
                            <td className="p-3 font-mono font-bold text-forest-900">{app.internshipTrack}</td>
                            <td className="p-3">
                              <div>{app.college}</div>
                              <div className="text-[10px] text-emerald-muted">{app.degree} ({app.department})</div>
                            </td>
                            <td className="p-3 font-mono">
                              <div>{app.phone}</div>
                              <div className="text-[10px] text-emerald-muted">{app.email}</div>
                            </td>
                            <td className="p-3 font-mono text-[11px]">{app.appliedDate || (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '')}</td>
                            <td className="p-3">
                              <select
                                value={app.status}
                                onChange={(e) => handleInternshipStatusChange(app.applicationId || app.id, e.target.value as any)}
                                className="px-2 py-1 rounded bg-ivory-100 border border-forest-900/15 text-[11px] font-mono font-bold text-forest-900"
                              >
                                <option>New</option>
                                <option>Reviewed</option>
                                <option>Shortlisted</option>
                                <option>Accepted</option>
                                <option>Rejected</option>
                                <option>Completed</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteInternship(appId)}
                                className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-200 hover:border-red-600"
                                title="Delete Application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredInternships.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-charcoal/60 font-mono text-xs">
                            No internship applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* GENERAL ENQUIRIES TABLE */
                <div className="overflow-x-auto rounded-2xl border border-forest-900/10">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-forest-900 text-white font-mono text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Enquiry ID</th>
                        <th className="p-3">Name & Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Message</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest-900/10 bg-ivory-50">
                      {filteredEnquiries.map((enq) => {
                        const enqKey = enq.enquiryId || enq.id || (enq as any)._id;
                        const enqId = enq.enquiryId || enq.referenceId || enq.id || (enq as any)._id;
                        return (
                          <tr key={enqKey} className="hover:bg-emerald-soft/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-forest-900">{enqId}</td>
                            <td className="p-3">
                              <div className="font-bold text-charcoal">{enq.name}</div>
                              <div className="text-[11px] text-emerald-muted font-mono">{enq.email}</div>
                            </td>
                            <td className="p-3 font-mono">{enq.phone || 'N/A'}</td>
                            <td className="p-3 font-semibold text-emerald-700">{enq.enquiryType}</td>
                            <td className="p-3 max-w-xs truncate text-charcoal/80" title={enq.message}>{enq.message}</td>
                            <td className="p-3 font-mono text-[11px]">{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'N/A'}</td>
                            <td className="p-3">
                              <select
                                value={enq.status || 'New'}
                                onChange={(e) => handleEnquiryStatusChange(enq.enquiryId || enq.id, e.target.value)}
                                className="px-2 py-1 rounded bg-ivory-100 border border-forest-900/15 text-[11px] font-mono font-bold text-forest-900"
                              >
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Resolved</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteEnquiry(enqId)}
                                className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-200 hover:border-red-600"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredEnquiries.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-charcoal/60 font-mono text-xs">
                            No general website enquiries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
