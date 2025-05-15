export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  source: 'LinkedIn' | 'Naukri';
  postedAt: string;
  link: string;
  matchPercentage: number;
} 