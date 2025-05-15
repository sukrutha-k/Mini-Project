import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';


// Constants for image validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

type Section = 'skills' | 'education' | 'experience' | 'certifications' | 'projects';

interface SectionConfig {
  title: string;
  isEnabled: boolean;
}

// Define the expected structure of the response data for resume upload (from JobMatch)
interface UploadResponseData {
  msg: string;
}

// Define the expected structure for job match results (adjust as needed)
interface JobMatchResult {
  // Define structure based on backend response for job matches
  title: string;
  company: string;
  // ... other job details
}

type FormData = {
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
    certificateImage?: File;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string;
    projectUrl?: string;
    githubUrl?: string;
  }[];
};

const ProfileCreation = () => {
  const [sections, setSections] = useState<{ [key in Section]: SectionConfig }>({
    skills: { title: 'Skills', isEnabled: true },
    education: { title: 'Education', isEnabled: true },
    experience: { title: 'Experience', isEnabled: true },
    certifications: { title: 'Certifications', isEnabled: true },
    projects: { title: 'Projects', isEnabled: true }
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: string }>({});

  // Adding state for resume upload from JobMatch
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Adding state for job matches
  const [jobMatches, setJobMatches] = useState<JobMatchResult[] | null>(null);
  const [jobMatchMessage, setJobMatchMessage] = useState<string>("");
  const [isMatching, setIsMatching] = useState(false);

  // State to hold the object URL for the preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Omit<FormData, 'resume'>>({
    defaultValues: {
      education: [{ degree: '', institution: '', year: '' }],
      experience: [{ title: '', company: '', duration: '', description: '' }],
      certifications: [{ name: '', issuer: '', year: '', certificateImage: undefined }],
      projects: [{ name: '', description: '', technologies: '', projectUrl: '', githubUrl: '' }]
    }
  });

  const [educationCount, setEducationCount] = useState(1);
  const [experienceCount, setExperienceCount] = useState(1);
  const [certificationCount, setCertificationCount] = useState(1);
  const [projectCount, setProjectCount] = useState(1);

  const onSubmit = async (data: Omit<FormData, 'resume'>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Store the profile data (this would typically be an API call)
      localStorage.setItem('userProfile', JSON.stringify(data));

      console.log("Profile data submitted:", data);
      setError('Profile data saved successfully!');
    } catch (err) {
      setError('Failed to save profile data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEducation = () => {
    setEducationCount(prev => prev + 1);
    const currentEducation = watch('education') || [];
    setValue('education', [...currentEducation, { degree: '', institution: '', year: '' }]);
  };

  const handleRemoveEducation = (index: number) => {
    const currentEducation = watch('education');
    if (currentEducation.length > 1) {
      setValue('education', currentEducation.filter((_, i) => i !== index));
      setEducationCount(prev => prev - 1);
    }
  };

  const handleAddExperience = () => {
    setExperienceCount(prev => prev + 1);
    const currentExperience = watch('experience') || [];
    setValue('experience', [...currentExperience, { title: '', company: '', duration: '', description: '' }]);
  };

  const handleRemoveExperience = (index: number) => {
    const currentExperience = watch('experience');
    if (currentExperience.length > 1) {
      setValue('experience', currentExperience.filter((_, i) => i !== index));
      setExperienceCount(prev => prev - 1);
    }
  };

  const handleAddCertification = () => {
    setCertificationCount(prev => prev + 1);
    const currentCertifications = watch('certifications') || [];
    setValue('certifications', [...currentCertifications, { name: '', issuer: '', year: '', certificateImage: undefined }]);
  };

  const handleRemoveCertification = (index: number) => {
    const currentCertifications = watch('certifications');
    if (currentCertifications.length > 1) {
      setValue('certifications', currentCertifications.filter((_, i) => i !== index));
      setCertificationCount(prev => prev - 1);
      const newImageErrors = { ...imageErrors };
      delete newImageErrors[index];
      setImageErrors(newImageErrors);
    }
  };

  const handleAddProject = () => {
    setProjectCount(prev => prev + 1);
    const currentProjects = watch('projects') || [];
    setValue('projects', [...currentProjects, { name: '', description: '', technologies: '', projectUrl: '', githubUrl: '' }]);
  };

  const handleRemoveProject = (index: number) => {
    const currentProjects = watch('projects');
    if (currentProjects.length > 1) {
      setValue('projects', currentProjects.filter((_, i) => i !== index));
      setProjectCount(prev => prev - 1);
    }
  };

  const toggleSection = (section: Section) => {
    setSections(prev => ({
      ...prev,
      [section]: { ...prev[section], isEnabled: !prev[section].isEnabled }
    }));
  };

  const getEnabledSections = () => {
    const enabled = Object.entries(sections)
      .filter(([_, config]) => config.isEnabled)
      .map(([key]) => key as Section);
    return enabled;
  };

  // Restore renderSectionSelector function
  const renderSectionSelector = () => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Sections to Include</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(sections).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSection(key as Section)}
              className={`p-4 rounded-lg border ${
                config.isEnabled
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-500'
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <span>{config.title}</span>
                <span className={`ml-2 ${config.isEnabled ? 'text-blue-500' : 'text-gray-400'}`}>
                  {config.isEnabled ? '✓' : '○'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!sections.projects.isEnabled) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Projects</h3>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Project +
          </button>
        </div>
        {[...Array(projectCount)].map((_, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Project #{index + 1}</h4>
              {projectCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  {...register(`projects.${index}.name`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register(`projects.${index}.description`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={4}
                  placeholder="Describe your project and its key features"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                <input
                  type="text"
                  {...register(`projects.${index}.technologies`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Project URL</label>
                <input
                  type="url"
                  {...register(`projects.${index}.projectUrl`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://myproject.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                <input
                  type="url"
                  {...register(`projects.${index}.githubUrl`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const validateImage = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum size is 5MB.';
    }
    return null;
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        setImageErrors(prev => ({ ...prev, [index]: error }));
        event.target.value = ''; // Clear the file input
        return;
      }

      // Clear any previous errors for this index
      setImageErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });

      const certifications = watch('certifications');
      // Need to update the type of certifications in FormData or handle this File differently
      // For now, casting for integration, but consider proper type handling
      (certifications as any)[index].certificateImage = file;
      setValue('certifications', certifications);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    // Clear previous messages and results on new file selection
    setUploadMessage("");
    setJobMatchMessage("");
    setJobMatches(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadMessage(""); // Clear previous messages
    setJobMatchMessage("");
    setJobMatches(null); // Clear previous job matches

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Explicitly specify the response type
      const response = await axios.post<UploadResponseData>(
        "https://26ad-60-243-175-75.ngrok-free.app/upload_resume", // Use the correct backend endpoint from JobMatch
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadMessage(response.data.msg);

      // If upload is successful, automatically trigger job matching
      // You might need to adjust this based on your backend flow
      // For example, if the backend returns job matches directly after upload,
      // you would process them here instead of calling a separate handleJobMatch function.
      // Assuming a separate endpoint or process for matching after upload:
      if (response.data.msg.includes("successfully")) { // Simple check, adjust as needed
        // You might need the file data or a reference from the upload response
        // to pass to the job matching endpoint.
        handleJobMatch(); // Call job matching function after successful upload
      }
    } catch (error: any) {
      // Handle error as a plain error object
      if ((error as any).response)
        {
        // Axios error with a response from the server
        setUploadMessage("Failed to upload resume: " + (error.response.data?.msg || error.message));
      } else {
        // Other errors (network issues, etc.)
        setUploadMessage("An unexpected error occurred during upload.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleJobMatch = async () => {
    // This function would call your backend's job matching endpoint.
    // It might need to send the uploaded file data or a user identifier.
    // For now, it's a placeholder. Replace with your actual API call.
    setIsMatching(true);
    setJobMatchMessage("");
    // setJobMatches(null); // Don't clear matches immediately, show loading instead

    try {
      // Example: Call a job matching endpoint.
      // You'll likely need to send the user's profile ID or the resume file data again.
      // This example assumes you might send the resume file again or use a stored reference.
      const formData = new FormData();
      if (file) {
        formData.append("file", file); // Sending file again for simplicity, adjust as needed
      } else {
        // Or send user ID to match based on stored profile/resume
        // formData.append("userId", "some-user-id");
        setJobMatchMessage("No resume file available for matching.");
        setIsMatching(false);
        return; // Exit if no file is available
      }

      // Replace with your actual job matching endpoint and method (GET or POST with data)
      const response = await axios.post(
        "https://26ad-60-243-175-75.ngrok-free.app/match_jobs", // Example job match endpoint
        formData // Send data needed for matching
        // add headers or other config as needed
      );

      // Assuming the response.data contains an array of job match results
      if (response.data && Array.isArray(response.data)) {
        setJobMatches(response.data); // Assuming response.data is JobMatchResult[]
        setJobMatchMessage(`Found ${response.data.length} job matches.`);
      } else {
        setJobMatches([]); // No matches found or unexpected format
        setJobMatchMessage("No job matches found or failed to retrieve matches.");
      }
    } catch (error: any) {
      if ((error as any).response)
        {
        setJobMatchMessage("Failed to find job matches: " + (error.response.data?.msg || error.message));
      } else {
        setJobMatchMessage("An unexpected error occurred during job matching.");
      }
      setJobMatches([]); // Clear matches on error
    } finally {
      setIsMatching(false);
    }
  };

  // Effect to create and clean up the object URL for resume preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clean up the URL when the component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
        setPreviewUrl(null); // Also clear state on cleanup
      };
    } else {
      // If file is null, ensure previewUrl is also null and revoked
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [file]); // Re-run the effect when the file state changes

  const renderEducation = () => {
    if (!sections.education.isEnabled) return null;
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          <button
            type="button"
            onClick={handleAddEducation}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Education +
          </button>
        </div>
        {[...Array(educationCount)].map((_, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Education #{index + 1}</h4>
              {educationCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  {...register(`education.${index}.degree`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Bachelor's in Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  {...register(`education.${index}.institution`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="University Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="text"
                  {...register(`education.${index}.year`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="2023"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (!sections.experience.isEnabled) return null;
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Experience</h3>
          <button
            type="button"
            onClick={handleAddExperience}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Experience +
          </button>
        </div>
        {[...Array(experienceCount)].map((_, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Experience #{index + 1}</h4>
              {experienceCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  {...register(`experience.${index}.title`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  {...register(`experience.${index}.company`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  {...register(`experience.${index}.duration`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="2 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows={4}
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCertifications = () => {
    if (!sections.certifications.isEnabled) return null;
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
          <button
            type="button"
            onClick={handleAddCertification}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Certification +
          </button>
        </div>
        {[...Array(certificationCount)].map((_, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Certification #{index + 1}</h4>
              {certificationCount > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCertification(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                <input
                  type="text"
                  {...register(`certifications.${index}.name`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="AWS Certified Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Issuing Organization</label>
                <input
                  type="text"
                  {...register(`certifications.${index}.issuer`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Amazon Web Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="text"
                  {...register(`certifications.${index}.year`)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certificate Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {imageErrors[index] && (
                  <p className="mt-1 text-sm text-red-600">{imageErrors[index]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Render Section Selector in Step 1 */}
            {renderSectionSelector()}

            {/* Integrated Resume Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Upload Resume</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload your existing resume (PDF or Word document) to find job matches.
                </p>
              </div>
              <div>
                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className={`mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    !file || isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </div>
              {uploadMessage && (
                <p className={`mt-2 text-sm ${uploadMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {uploadMessage}
                </p>
              )}
              {file && !uploadMessage && !isUploading && (
                <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>
              )}
              {/* Resume Preview Section */}
              {previewUrl && file && (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-700">Preview</h4>
                  <p className="mt-1 text-sm text-gray-600">File: {file.name}</p>
                  {/* Using an anchor tag for preview, relies on browser handling */}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>

            {/* Job Matching Results Section - Display after upload is successful and matches are found */}
            {uploadMessage.includes("successfully") && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Job Matches</h3>
                {jobMatchMessage && (
                  <p className={`mt-2 text-sm ${jobMatchMessage.includes('Found') ? 'text-green-600' : 'text-red-600'}`}>
                    {jobMatchMessage}
                  </p>
                )}
                {isMatching && <p>Finding job matches...</p>}
                {jobMatches && jobMatches.length > 0 && (
                  <ul className="mt-4 border-t border-gray-200 divide-y divide-gray-200">
                    {jobMatches.map((job, index) => (
                      <li key={index} className="py-4">
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{job.company}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {jobMatches && jobMatches.length === 0 && !isMatching && !jobMatchMessage.includes('Found') && (
                  <p className="mt-2 text-sm text-gray-600">No matches found for your resume.</p>
                )}
              </div>
            )}
          </div>
        );

      case 2:
        return renderEducation(); // Render Education section
      case 3:
        return renderExperience(); // Render Experience section
      case 4:
        return renderCertifications(); // Render Certifications section
      case 5:
        return renderProjects(); // Render Projects section

      default:
        return null;
    }
  };

  // Helper to get the current enabled section based on step
  const getCurrentEnabledSection = (currentStep: number): Section | 'resume_upload' | null => {
    if (currentStep === 1) return 'resume_upload'; // Step 1 is resume upload + selector
    const enabled = getEnabledSections();
    // Steps for manual sections are 2, 3, 4, 5, 6 based on order of sections array
    const sectionIndex = currentStep - 2;
    return enabled[sectionIndex] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Create Your Profile</h2>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {/* Step 1 is for resume upload + section selector */}
                <button
                  onClick={() => setStep(1)}
                  className={`w-8 h-8 rounded-full ${
                    step >= 1 ? 'bg-blue-600' : 'bg-gray-200'
                  } text-white flex items-center justify-center font-bold text-sm`}
                >
                  1
                </button>
                {/* Steps for manual sections start from 2 */}
                {getEnabledSections().map((sectionKey, index) => (
                  <button
                    key={sectionKey} // Use section key for a more stable key
                    onClick={() => setStep(index + 2)} // Steps are 2, 3, 4, 5, 6
                    className={`w-8 h-8 rounded-full ${
                      step >= index + 2 ? 'bg-blue-600' : 'bg-gray-200'
                    } text-white flex items-center justify-center font-bold text-sm`}
                  >
                    {index + 2}
                  </button>
                ))}
              </div>
              {/* Progress bar width calculation */}
              {/* Total steps = 1 (Resume/Selector) + number of enabled manual sections */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                   // Calculate progress based on total number of steps (1 + enabled manual sections)
                  style={{ width: `${((step - 1) / (getEnabledSections().length + (step > 1 ? 0 : 1))) * 100}%` }}
                />
              </div>
                {/* Display current section title below progress bar */}
               <div className="text-center mt-2 text-sm font-medium text-gray-700">
                   {step === 1 ? 'Resume Upload & Section Selection' : sections[getCurrentEnabledSection(step) as Section]?.title}
               </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Render the current step's content */}
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {/* Show Previous button from step 2 onwards */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
              )}
              {/* Show Next button if not on the last overall step (last manual section step) */}
              {step < getEnabledSections().length + 1 ? ( // Total steps are 1 + enabled sections. If current step is less than total, show Next
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                // Show Complete Profile button ONLY on the very last step
                 <button
                    type="submit" // This button submits the form
                    onClick={handleSubmit(onSubmit)} // Trigger the form submit handler
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isSubmitting ? (
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
                        Saving Profile...
                      </>
                    ) : (
                      'Complete Profile'
                    )}
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation; 