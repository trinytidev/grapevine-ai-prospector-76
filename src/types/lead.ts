export interface Lead {
  id: string;
  title: string;
  description: string;
  budget: string;
  platform: 'Upwork' | 'Freelancer' | 'Fiverr' | 'Indeed' | 'LinkedIn' | 'PeoplePerHour';
  status: 'new' | 'reviewed' | 'proposal_sent' | 'responded' | 'closed';
  client: string;
  postedDate: string;
  deadline?: string;
  skills: string[];
  proposalSent: boolean;
  proposalContent?: string;
  aiScore: number; // 0-100 compatibility score
}

export const mockLeads: Lead[] = [
  {
    id: '1',
    title: 'React Developer for E-commerce Platform',
    description: 'Looking for an experienced React developer to build a modern e-commerce platform with advanced filtering and payment integration.',
    budget: '$5,000 - $8,000',
    platform: 'Upwork',
    status: 'new',
    client: 'TechCorp Solutions',
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    skills: ['React', 'TypeScript', 'Node.js', 'Payment Integration'],
    proposalSent: false,
    aiScore: 95
  },
  {
    id: '2',
    title: 'Full-Stack Developer for SaaS Dashboard',
    description: 'Need a full-stack developer to create a comprehensive SaaS dashboard with real-time analytics and user management.',
    budget: '$3,000 - $5,000',
    platform: 'Freelancer',
    status: 'proposal_sent',
    client: 'StartupXYZ',
    postedDate: '2024-01-14',
    deadline: '2024-02-10',
    skills: ['React', 'Python', 'PostgreSQL', 'AWS'],
    proposalSent: true,
    proposalContent: 'Hi there! I\'m excited about your SaaS dashboard project...',
    aiScore: 87
  },
  {
    id: '3',
    title: 'UI/UX Designer for Mobile App',
    description: 'Seeking a talented UI/UX designer to create intuitive designs for our mobile application targeting millennials.',
    budget: '$2,000 - $4,000',
    platform: 'Fiverr',
    status: 'reviewed',
    client: 'AppVentures',
    postedDate: '2024-01-13',
    skills: ['Figma', 'Mobile Design', 'User Research'],
    proposalSent: false,
    aiScore: 72
  },
  {
    id: '4',
    title: 'WordPress Developer for Custom Theme',
    description: 'Looking for a WordPress expert to develop a custom theme for our corporate website with advanced customization options.',
    budget: '$1,500 - $3,000',
    platform: 'Indeed',
    status: 'responded',
    client: 'Corporate Inc',
    postedDate: '2024-01-12',
    deadline: '2024-01-30',
    skills: ['WordPress', 'PHP', 'Custom Themes', 'SEO'],
    proposalSent: true,
    aiScore: 81
  },
  {
    id: '5',
    title: 'AI Integration Specialist',
    description: 'Need an expert to integrate ChatGPT API into our existing platform and implement smart automation features.',
    budget: '$4,000 - $7,000',
    platform: 'LinkedIn',
    status: 'new',
    client: 'InnovateTech',
    postedDate: '2024-01-16',
    deadline: '2024-02-20',
    skills: ['API Integration', 'AI/ML', 'Python', 'REST APIs'],
    proposalSent: false,
    aiScore: 93
  }
];