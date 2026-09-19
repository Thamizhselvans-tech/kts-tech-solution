export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  group: 'Products / Engineering' | 'Research / Innovation';
  problem: string;
  solution: string;
  description: string;
  keyFeatures: string[];
  technology: string[];
  projectStatus: 'Active' | 'In Production' | 'Deployed' | 'Research';
  isInternal?: boolean;
  githubUrl?: string;
  liveDemoUrl?: string;
  image: string;
  title?: string;
  tagline?: string;
  industry?: string;
  year?: string;
  client?: string;
  metrics?: { label: string; value: string }[];
  fullStory?: string;
  technologies?: string[];
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  image: string;
  bio: string;
  quirk?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Lead {
  id: string;
  leadId?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  companyName?: string;
  projectType: string;
  budget: string;
  budgetRange?: string;
  timeline: string;
  description: string;
  sourcePage: string;
  date?: string;
  status: 'New' | 'Contacted' | 'Discussion' | 'Proposal Sent' | 'Won' | 'Lost';
  notes?: string;
  referenceId: string;
  emailStatus?: 'pending' | 'sent' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export interface InternshipApplication {
  id: string;
  applicationId?: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  department: string;
  academicYear: string;
  internshipTrack: string;
  skills?: string;
  existingSkills?: string;
  githubUrl?: string;
  github?: string;
  portfolioUrl?: string;
  portfolio?: string;
  whyJoin?: string;
  motivation?: string;
  resumeUrl?: string;
  appliedDate?: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Completed';
  notes?: string;
  emailStatus?: 'pending' | 'sent' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export const COMPANY_INFO = {
  name: "Kryptonode Tech Solutions Pvt Ltd",
  shortName: "Kryptonode",
  headline: "We Build Ideas Into Real Products.",
  secondaryTagline: "Technology • Design • Development • Growth",
  philosophy: "Your Problem First. Technology Second.",
  email: "kryptonodetech@gmail.com",
  phone: "8903850119",
  phoneFormatted: "+91 89038 50119",
  whatsapp: "https://wa.me/918903850119",
  instagram: "https://www.instagram.com/krypotnode_?stkn=MTd6Y255dHd3bXp5Ng==",
  linkedin: "https://www.linkedin.com/in/kryptonode-tech-solutions-06b5b3438?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  location: "India • Global Remote",
};

export const SERVICES: Service[] = [
  {
    id: 'website-development',
    number: '01',
    title: 'Website Development',
    description: 'Modern, responsive websites designed to represent your brand, communicate your value and convert visitors into customers.',
    iconName: 'Globe',
    category: 'Website'
  },
  {
    id: 'web-app-development',
    number: '02',
    title: 'Web Application Development',
    description: 'Custom web applications designed around real business workflows, users and operational needs.',
    iconName: 'Layers',
    category: 'Web Application'
  },
  {
    id: 'mobile-app-development',
    number: '03',
    title: 'Mobile App Development',
    description: 'User-focused mobile applications built for real-world use cases with clean interfaces and reliable backend systems.',
    iconName: 'Smartphone',
    category: 'Mobile App'
  },
  {
    id: 'ai-solutions',
    number: '04',
    title: 'AI Solutions',
    description: 'AI-powered applications, intelligent assistants, automation and AI integrations designed around meaningful use cases.',
    iconName: 'Cpu',
    category: 'AI Application'
  },
  {
    id: 'business-software',
    number: '05',
    title: 'Business Software',
    description: 'Custom digital systems that simplify business workflows such as ordering, inventory, CRM and administration.',
    iconName: 'Briefcase',
    category: 'Business Software'
  },
  {
    id: 'startup-mvp-development',
    number: '06',
    title: 'Startup MVP Development',
    description: 'Turn an early-stage idea into a structured MVP and working digital product.',
    iconName: 'Rocket',
    category: 'Startup MVP'
  }
];

export const PROJECTS: Project[] = [
  // Products / Engineering (6 Projects)
  {
    id: 'tms',
    number: '01',
    name: 'Training Management System (TMS)',
    category: 'Web Application / Enterprise',
    group: 'Products / Engineering',
    problem: 'Managing corporate training programs, course modules, attendance, and student performance records across spreadsheets is error-prone.',
    solution: 'A full-stack MERN training management portal streamlining student enrollments, course schedules, progress telemetry, and administrative reports.',
    description: 'A comprehensive MERN-stack training management platform for tracking course progress, student enrollments, attendance, and corporate training workflows.',
    keyFeatures: [
      'Course & Module Allocation Engine',
      'Student Progress & Attendance Tracking',
      'Admin Reporting & Performance Analytics',
      'Role-based Access Control (Admin / Student)'
    ],
    technology: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    projectStatus: 'Deployed',
    liveDemoUrl: 'https://cktraing-frontend.vercel.app',
    githubUrl: 'https://github.com/Thamizhselvans-tech/training-module',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'skill-tracker',
    number: '02',
    name: 'SkillTracker',
    category: 'Education / Productivity',
    group: 'Products / Engineering',
    problem: 'Developers and students struggle to track their learning roadmaps, technical skills, and project milestones in one organized view.',
    solution: 'A streamlined web dashboard organizing technical skill milestones, learning resources, project logs, and progress metrics in one place.',
    description: 'A platform designed to help users organize technical skills, learning progress and personal development in one place.',
    keyFeatures: [
      'Visual Skill Tree & Learning Milestones',
      'Project Submission & Progress Logs',
      'Resource Repository & Bookmark Manager',
      'Personal Analytics & Skill Portfolio View'
    ],
    technology: ['React', 'JavaScript', 'Node.js', 'Firebase', 'Tailwind CSS'],
    projectStatus: 'Active',
    isInternal: true,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'payment-manager',
    number: '03',
    name: 'Payment Manager',
    category: 'Business / Fintech',
    group: 'Products / Engineering',
    problem: 'Small businesses struggle to maintain real-time visibility over client pending balances, recurring payments, and transaction history.',
    solution: 'A cloud-connected payment management platform built on Firebase providing real-time receipt generation, balance tracking, and ledger history.',
    description: 'A cloud-connected financial payment and transaction management portal powered by Firebase for tracking invoices, receipts, and client balances.',
    keyFeatures: [
      'Real-Time Balance & Invoice Tracking',
      'Automated Digital Receipt Generation',
      'Client Payment History & Ledger View',
      'Firebase Authentication & Cloud Sync'
    ],
    technology: ['React', 'Firebase', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    projectStatus: 'Deployed',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'thandal',
    number: '04',
    name: 'Thandal',
    category: 'Fintech / Business Software',
    group: 'Products / Engineering',
    problem: 'Daily and monthly interest loan collection requires manual entry, leading to ledger discrepancies and missed payment schedules.',
    solution: 'An automated financial management software designed specifically for daily/monthly interest calculations, loan ledger tracking, and repayment schedules.',
    description: 'A dedicated financial solution for automated loan processing, daily/monthly interest calculations, ledger tracking, and repayment schedules.',
    keyFeatures: [
      'Automated Daily & Monthly Interest Calculations',
      'Borrower Account Ledger & History',
      'Payment Due Alerts & Collection Schedules',
      'Secure Encrypted Local & Cloud Backups'
    ],
    technology: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS'],
    projectStatus: 'Active',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hand-control',
    number: '05',
    name: 'HandControl',
    category: 'AI / Computer Vision / Voice',
    group: 'Products / Engineering',
    problem: 'Touch-based software navigation can be restricted in hygienic, industrial, or accessibility-constrained environments.',
    solution: 'A high-accuracy gesture and voice interface model using computer vision to translate hand movements and voice commands into real-time UI controls.',
    description: 'An intelligent gesture and voice recognition system utilizing computer vision models for hands-free device and software interface control.',
    keyFeatures: [
      'Real-Time Hand Landmark Tracking & Gesture Detection',
      'Integrated Speech-to-Command Voice Engine',
      'Low-Latency Signal Processing (< 15ms)',
      'Cross-Platform Interface Driver Integration'
    ],
    technology: ['Python', 'OpenCV', 'MediaPipe', 'Voice Engine', 'PyTorch'],
    projectStatus: 'Active',
    isInternal: true,
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'light-cse',
    number: '06',
    name: 'LightCSE',
    category: 'Web / Education',
    group: 'Products / Engineering',
    problem: 'Heavy educational portals often load slowly on mobile networks, impeding quick access to computer science reference materials.',
    solution: 'An ultra-lightweight web portal optimized for instant page loads, offering structured computer science notes, code snippets, and lab resources.',
    description: 'An optimized lightweight web learning platform designed to streamline computer science engineering resources, subject notes, and interactive code labs.',
    keyFeatures: [
      'Instant-Load Sub-Second Resource Catalog',
      'Clean Code Snippet & Notes Browser',
      'Mobile-First Responsive Layout',
      'Offline Caching Capabilities'
    ],
    technology: ['JavaScript', 'HTML5', 'CSS3', 'Netlify', 'Vite'],
    projectStatus: 'Deployed',
    liveDemoUrl: 'https://lightcse.netlify.app',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  },

  // Research / Innovation (4 Projects)
  {
    id: 'smart-waste-recycling',
    number: '07',
    name: 'Smart Waste Segregation & Recycling System',
    category: 'AI + IoT / Hardware Systems',
    group: 'Research / Innovation',
    problem: 'Manual municipal waste sorting is hazardous, inefficient, and results in low recyclable material recovery rates.',
    solution: 'An automated computer-vision sorting machine paired with IoT microcontrollers to categorize waste into biodegradable, recyclable, and hazardous bins.',
    description: 'An automated waste classification and smart recycling ecosystem combining computer vision object detection models with IoT microcontroller sorting mechanisms.',
    keyFeatures: [
      'YOLOv8 Real-Time Waste Classification Model',
      'Servo-Driven Microcontroller Mechanical Sorting',
      'Fill-Level Ultrasonic IoT Sensor Alerts',
      'Live Cloud Analytics Dashboard'
    ],
    technology: ['Python', 'YOLOv8', 'OpenCV', 'IoT / Arduino', 'Node.js'],
    projectStatus: 'Research',
    isInternal: true,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fisheries-supply-chain',
    number: '08',
    name: 'Fisheries Supply Chain System',
    category: 'Supply Chain Technology',
    group: 'Research / Innovation',
    problem: 'Lack of provenance tracking in coastal fisheries leads to spoilage, price manipulation, and unverified catch origins.',
    solution: 'A transparent digital supply chain system capturing catch telemetry, cold storage temperature logs, and direct harbor-to-market trade tracking.',
    description: 'A transparent digital supply chain platform tracking fish catch provenance, cold-storage telemetry, port logistics, and fair market distribution.',
    keyFeatures: [
      'Catch Provenance & GPS Location Logging',
      'Cold Storage IoT Temperature Telemetry',
      'Harbor Auction & Distributor Ledger',
      'Mobile Harbor Inspector Interface'
    ],
    technology: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Tailwind CSS'],
    projectStatus: 'Research',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cyber-block-trace',
    number: '09',
    name: 'CyberBlockTrace',
    category: 'Cybersecurity / Blockchain',
    group: 'Research / Innovation',
    problem: 'Security investigators require immutable forensic trails to track unauthorized network access and digital asset transactions.',
    solution: 'A decentralized forensic ledger recording system events, cryptographic checksums, and network threat indicators to prevent log tampering.',
    description: 'A secure decentralized ledger architecture for forensic transaction tracing, immutable audit logs, and network security threat detection.',
    keyFeatures: [
      'Immutable Cryptographic Audit Logging',
      'Decentralized Forensic Transaction Verification',
      'Real-Time Anomaly & Intrusion Detection',
      'Interactive Forensic Graph Trace Visualizer'
    ],
    technology: ['Python', 'Node.js', 'Blockchain / Smart Contracts', 'TypeScript'],
    projectStatus: 'Research',
    isInternal: true,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'pediatric-elbow-fracture',
    number: '10',
    name: 'Pediatric Elbow Fracture Detection',
    category: 'AI / Medical Imaging',
    group: 'Research / Innovation',
    problem: 'Pediatric elbow fractures in X-rays are notoriously subtle and often missed during initial emergency room triage.',
    solution: 'A novel hybrid deep neural network combining Convolutional Neural Networks for feature extraction and Vision Transformers for structural attention modeling.',
    description: 'A deep learning diagnostic vision model combining Convolutional Neural Networks and Vision Transformers for automated pediatric elbow fracture detection in X-rays.',
    keyFeatures: [
      'Hybrid CNN + Vision Transformer (ViT) Architecture',
      'Grad-CAM Heatmap Fracture Highlight Visualization',
      'High Sensitivity on Subtle Radiographic Signs',
      'DICOM Medical Image Integration Pipeline'
    ],
    technology: ['Python', 'PyTorch', 'Vision Transformer', 'CNN', 'OpenCV'],
    projectStatus: 'Research',
    isInternal: true,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  }
];

export const TECHNOLOGIES = [
  { name: 'React', category: 'Frontend', icon: 'Atom' },
  { name: 'Next.js', category: 'Frontend', icon: 'Globe' },
  { name: 'JavaScript', category: 'Frontend', icon: 'Code' },
  { name: 'TypeScript', category: 'Frontend', icon: 'FileCode' },
  { name: 'Tailwind CSS', category: 'Frontend', icon: 'Palette' },
  { name: 'Node.js', category: 'Backend', icon: 'Server' },
  { name: 'Express.js', category: 'Backend', icon: 'Cpu' },
  { name: 'Java', category: 'Backend', icon: 'Coffee' },
  { name: 'MongoDB', category: 'Database', icon: 'Database' },
  { name: 'Firebase', category: 'Database', icon: 'Flame' },
  { name: 'PostgreSQL', category: 'Database', icon: 'HardDrive' },
  { name: 'Python', category: 'AI', icon: 'Terminal' },
  { name: 'AI APIs', category: 'AI', icon: 'Zap' },
  { name: 'LLM Integration', category: 'AI', icon: 'Bot' },
  { name: 'AI Automation', category: 'AI', icon: 'Activity' },
  { name: 'Git', category: 'Tools', icon: 'GitBranch' },
  { name: 'GitHub', category: 'Tools', icon: 'Github' },
  { name: 'Figma', category: 'Tools', icon: 'Figma' },
  { name: 'VS Code', category: 'Tools', icon: 'Laptop' },
  { name: 'Vercel', category: 'Tools', icon: 'Cloud' },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'thamizhprabha',
    name: 'THAMIZHPRABHA',
    role: 'Technology • Product • Development',
    phone: '8668109481',
    whatsapp: 'https://wa.me/918668109481',
    image: '/tp-green-logo.jpg',
    bio: 'Full stack architecture lead focusing on web platforms, system engineering, and product execution.'
  },
  {
    id: 'danish-kumar',
    name: 'DANISH KUMAR',
    role: 'Development • Product Engineering',
    phone: '9361215922',
    whatsapp: 'https://wa.me/919361215922',
    image: '/dk-green-logo.jpg',
    bio: 'Product development specialist focused on user interface workflows, mobile applications, and backend APIs.'
  },
  {
    id: 'sarveshkumar',
    name: 'SARVESHKUMAR',
    role: 'Technology • Systems Development',
    phone: '9150185160',
    whatsapp: 'https://wa.me/919150185160',
    image: '/rm-green-logo.jpg',
    bio: 'Systems engineer specializing in database architecture, AI integration, and cloud deployments.'
  }
];

export const INTERNSHIP_TRACKS = [
  'Full-Stack Development',
  'Web Development',
  'Java Development',
  'AI Application Development',
  'Mobile App Development',
  'UI/UX Design'
];

export const INTERNSHIP_BENEFITS = [
  'Online flexible learning model',
  'Hands-on practical development assignments',
  'Real-world project building experience',
  'Mentor guidance from core Kryptonode developers',
  'Portfolio projects you can showcase to employers',
  'Collaborative team workflows & code reviews',
  'Git and GitHub workflow experience',
  'Official Kryptonode Project Completion Certificate'
];

// Helper functions for LocalStorage persistence
const LEADS_KEY = 'kn_leads_data_store';
const INTERNSHIPS_KEY = 'kn_internships_data_store';

export const getStoredLeads = (): Lead[] => {
  try {
    const data = localStorage.getItem(LEADS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse leads data store', e);
  }
  const initialLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Sample Business Enquiry',
      email: 'client@example.com',
      phone: '9876543210',
      company: 'Logistics Enterprise',
      projectType: 'Web Application',
      budget: '$25,000 - $50,000',
      timeline: '4 - 6 Weeks',
      description: 'Looking to build a custom inventory ordering web app.',
      sourcePage: 'Home - Contact Section',
      date: new Date().toLocaleDateString(),
      status: 'New',
      notes: 'Initial scope submitted. Awaiting call follow up.',
      referenceId: 'KN-849201'
    }
  ];
  localStorage.setItem(LEADS_KEY, JSON.stringify(initialLeads));
  return initialLeads;
};

export const saveLead = (lead: Omit<Lead, 'id' | 'date' | 'status' | 'referenceId'>): Lead => {
  const current = getStoredLeads();
  const refNum = Math.floor(100000 + Math.random() * 900000);
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now()}`,
    date: new Date().toLocaleDateString(),
    status: 'New',
    referenceId: `KN-${refNum}`
  };
  const updated = [newLead, ...current];
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
  return newLead;
};

export const updateLeadStatus = (id: string, status: Lead['status'], notes?: string): Lead[] => {
  const current = getStoredLeads();
  const updated = current.map((l) => (l.id === id ? { ...l, status, notes: notes ?? l.notes } : l));
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
  return updated;
};

export const getStoredInternships = (): InternshipApplication[] => {
  try {
    const data = localStorage.getItem(INTERNSHIPS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse internship applications store', e);
  }
  const initialInternships: InternshipApplication[] = [
    {
      id: 'app-1',
      fullName: 'Aravind Swamy',
      email: 'aravind@college.edu',
      phone: '9876501234',
      college: 'Anna University',
      degree: 'B.E',
      department: 'Computer Science',
      academicYear: '3rd Year',
      internshipTrack: 'Full-Stack Development',
      existingSkills: 'React, Node.js, JavaScript, Git',
      githubUrl: 'https://github.com/aravind-sample',
      portfolioUrl: 'https://aravind.dev',
      whyJoin: 'I want to build real digital products and understand production developer workflows.',
      appliedDate: new Date().toLocaleDateString(),
      status: 'New',
      notes: 'Strong GitHub repository profile.'
    }
  ];
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(initialInternships));
  return initialInternships;
};

export const saveInternshipApplication = (app: Omit<InternshipApplication, 'id' | 'appliedDate' | 'status'>): InternshipApplication => {
  const current = getStoredInternships();
  const newApp: InternshipApplication = {
    ...app,
    id: `app-${Date.now()}`,
    appliedDate: new Date().toLocaleDateString(),
    status: 'New'
  };
  const updated = [newApp, ...current];
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(updated));
  return newApp;
};

export const updateInternshipStatus = (id: string, status: InternshipApplication['status'], notes?: string): InternshipApplication[] => {
  const current = getStoredInternships();
  const updated = current.map((a) => (a.id === id ? { ...a, status, notes: notes ?? a.notes } : a));
  localStorage.setItem(INTERNSHIPS_KEY, JSON.stringify(updated));
  return updated;
};

export interface TechNode {
  id: string;
  name: string;
  category: string;
  latency: string;
  connections: string[];
  description: string;
}

export const TECH_NODES: TechNode[] = [
  {
    id: 'react',
    name: 'React 18',
    category: 'Frontend',
    latency: '< 16ms render frame',
    connections: ['typescript', 'tailwind', 'vite'],
    description: 'Component architecture building reactive user interfaces with full concurrent rendering.'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    latency: 'Static Compile Check',
    connections: ['react', 'node'],
    description: 'Strict type safety ensuring zero runtime type errors across complex applications.'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    latency: '0ms runtime cost',
    connections: ['react'],
    description: 'Utility-first CSS framework enabling pixel-perfect, responsive UI design systems.'
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'Backend',
    latency: 'Non-blocking I/O',
    connections: ['typescript', 'express', 'postgresql'],
    description: 'Asynchronous event-driven JavaScript runtime powering high-throughput API services.'
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'Backend',
    latency: 'Sub-5ms middleware',
    connections: ['node', 'postgresql'],
    description: 'Fast, unopinionated web framework for building REST APIs and microservices.'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    latency: 'ACID Compliant',
    connections: ['node'],
    description: 'Advanced relational database system for structured schema modeling and queries.'
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'Frontend',
    latency: 'Instant HMR',
    connections: ['react'],
    description: 'Next-generation frontend tooling providing lightning-fast development server.'
  }
];

export const TESTIMONIALS = [
  {
    quote: "Kryptonode took our rough concept and engineered a production-ready application within 6 weeks.",
    author: "Product Director",
    role: "Lead Strategist",
    company: "FinTech Client"
  }
];

export const WHY_US_PRINCIPLES = [
  {
    title: "Engineering First",
    description: "We write clean, typed, modular code designed for scaling from day 1."
  }
];
