import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  skills: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  };
  experience: {
    title: string;
    company: string;
    description: string;
  };
};

type JobRecommendation = {
  id: string;
  title: string;
  company: string;
  location: string;
  source: 'LinkedIn' | 'Naukri';
  link: string;
  postedAt: string;
  matchScore: number;
};

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'recommendations'>('profile');
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState<JobRecommendation | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      name: 'John Doe',
      email: 'john@example.com',
      skills: 'React, TypeScript, Node.js',
      education: {
        degree: "Bachelor's in Computer Science",
        institution: 'University of Technology',
        year: '2022',
      },
      experience: {
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: 'Developed and maintained web applications using React and Node.js',
      },
    },
  });

  // Simulate fetching job recommendations
  useEffect(() => {
    const mockRecommendations: JobRecommendation[] = [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'Tech Solutions Inc',
        location: 'Bangalore, India',
        source: 'LinkedIn',
        link: 'https://linkedin.com/jobs/1',
        postedAt: '2 hours ago',
        matchScore: 85,
      },
      {
        id: '2',
        title: 'Frontend Team Lead',
        company: 'Digital Innovations',
        location: 'Mumbai, India',
        source: 'Naukri',
        link: 'https://naukri.com/jobs/2',
        postedAt: '5 hours ago',
        matchScore: 78,
      },
    ];
    setJobRecommendations(mockRecommendations);

    // Simulate new job notification every 30 seconds
    const interval = setInterval(() => {
      const newJob: JobRecommendation = {
        id: Math.random().toString(),
        title: 'New React Position',
        company: 'Innovation Tech',
        location: 'Hyderabad, India',
        source: Math.random() > 0.5 ? 'LinkedIn' : 'Naukri',
        link: 'https://example.com/job',
        postedAt: 'Just now',
        matchScore: Math.floor(Math.random() * 20) + 75,
      };
      setNewRecommendation(newJob);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      setJobRecommendations(prev => [newJob, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = (data: FormData) => {
    console.log(data);
    setIsEditing(false);
  };

  const formData = watch();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Job Notification */}
      {showNotification && newRecommendation && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 w-96 border-l-4 border-blue-500 animate-slide-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <img
                src={newRecommendation.source === 'LinkedIn' ? '/linkedin-icon.png' : '/naukri-icon.png'}
                alt={newRecommendation.source}
                className="h-6 w-6"
              />
            </div>
            <div className="ml-3 w-full">
              <p className="text-sm font-medium text-gray-900">
                New Job Match! ({newRecommendation.matchScore}% match)
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {newRecommendation.title} at {newRecommendation.company}
              </p>
              <a
                href={newRecommendation.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                View Job →
              </a>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                  activeTab === 'recommendations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Job Recommendations
              </button>
            </nav>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'profile' ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* View Mode */}
                {!isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 rounded-lg">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                      <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                      <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                        <h4 className="text-base font-semibold">{formData.education.degree}</h4>
                        <p className="text-sm text-gray-600">{formData.education.institution}</p>
                        <p className="text-sm text-gray-500">{formData.education.year}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Experience</h3>
                      <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-lg">
                        <h4 className="text-base font-semibold">{formData.experience.title}</h4>
                        <p className="text-sm text-gray-600">{formData.experience.company}</p>
                        <p className="mt-2 text-sm text-gray-500">{formData.experience.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            {...register("name", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            {...register("email", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Skills (comma-separated)
                        </label>
                        <textarea
                          {...register("skills", { required: true })}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <input
                            type="text"
                            {...register("education.degree", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                            type="text"
                            {...register("education.institution", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Year</label>
                          <input
                            type="text"
                            {...register("education.year", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Experience</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <input
                            type="text"
                            {...register("experience.title", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <input
                            type="text"
                            {...register("experience.company", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            {...register("experience.description", { required: true })}
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* Job Recommendations Tab */
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Job Recommendations</h2>
                <div className="space-y-6">
                  {jobRecommendations.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {job.matchScore}% Match
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{job.postedAt}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="flex items-center text-sm text-gray-500">
                              <img
                                src={job.source === 'LinkedIn' ? '/linkedin-icon.png' : '/naukri-icon.png'}
                                alt={job.source}
                                className="h-4 w-4 mr-1"
                              />
                              {job.source}
                            </span>
                          </div>
                        </div>
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Apply Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 