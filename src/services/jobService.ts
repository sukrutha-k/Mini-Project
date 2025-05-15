import { Job } from '../types/job';

// In a real application, these would be API endpoints
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    description: 'Looking for a skilled frontend developer with React and TypeScript experience.',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'HTML'],
    source: 'LinkedIn',
    postedAt: '2 hours ago',
    link: 'https://linkedin.com/jobs/1',
    matchPercentage: 0
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupX',
    location: 'New York',
    description: 'Join our growing team as a Full Stack Engineer.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    source: 'Naukri',
    postedAt: '5 hours ago',
    link: 'https://naukri.com/jobs/2',
    matchPercentage: 0
  },
  {
    id: '3',
    title: 'Senior Software Engineer',
    company: 'TechGiant',
    location: 'Bangalore',
    description: 'Looking for a Senior Software Engineer with strong backend skills.',
    requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    source: 'LinkedIn',
    postedAt: '1 day ago',
    link: 'https://linkedin.com/jobs/3',
    matchPercentage: 0
  }
];

export const fetchJobMatches = async (userSkills: string[]): Promise<Job[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Calculate match percentage for each job
  const jobsWithMatch = MOCK_JOBS.map(job => {
    const matchingSkills = job.requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase() === skill.toLowerCase()
      )
    );
    const matchPercentage = (matchingSkills.length / job.requiredSkills.length) * 100;
    return { ...job, matchPercentage };
  });

  // Sort by match percentage
  return jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export const subscribeToJobNotifications = (callback: (job: Job) => void) => {
  // Simulate new job notifications every 30 seconds
  const interval = setInterval(() => {
    const newJob: Job = {
      id: Math.random().toString(),
      title: 'New Job Position',
      company: 'Tech Company',
      location: 'Remote',
      description: 'Exciting new opportunity!',
      requiredSkills: ['React', 'TypeScript', 'Node.js'],
      source: Math.random() > 0.5 ? 'LinkedIn' : 'Naukri',
      postedAt: 'Just now',
      link: 'https://example.com/job',
      matchPercentage: Math.floor(Math.random() * 20) + 75
    };
    callback(newJob);
  }, 30000);

  return () => clearInterval(interval);
}; 