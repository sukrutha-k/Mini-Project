import { useState } from 'react';

const ResumeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeContent, setResumeContent] = useState({
    name: 'John Doe',
    title: 'Software Engineer',
    summary: 'Experienced software engineer with a strong background in web development and a passion for creating efficient, scalable solutions.',
    skills: 'React, TypeScript, Node.js, AWS, Python',
    // Add more fields as needed
  });

  const generateResume = () => {
    setIsGenerating(true);
    // Simulate API call to generate resume
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const downloadResume = () => {
    // Here you would typically trigger the actual download
    // For demo purposes, we'll just show an alert
    alert('Resume download started!');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the edited resume content
    alert('Resume changes saved!');
  };

  const handleInputChange = (field: string, value: string) => {
    setResumeContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Custom Resume</h2>

            {!isGenerated ? (
              <div className="text-center">
                <button
                  onClick={generateResume}
                  disabled={isGenerating}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    isGenerating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating Resume...
                    </>
                  ) : (
                    'Generate Resume'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Resume Preview */}
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
                    {!isEditing && (
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit Resume
                      </button>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={resumeContent.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            value={resumeContent.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Summary</label>
                          <textarea
                            value={resumeContent.summary}
                            onChange={(e) => handleInputChange('summary', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Skills</label>
                          <input
                            type="text"
                            value={resumeContent.skills}
                            onChange={(e) => handleInputChange('skills', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleSave}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4>{resumeContent.name}</h4>
                        <p className="text-gray-600">{resumeContent.title}</p>
                        <div className="mt-4">
                          <h5 className="font-medium">Summary</h5>
                          <p>{resumeContent.summary}</p>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-medium">Skills</h5>
                          <p>{resumeContent.skills}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsGenerated(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={downloadResume}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGeneration; 