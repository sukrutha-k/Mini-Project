import { Link } from 'react-router-dom';
import TemplateSlideshow from './TemplateSlideshow';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex-1 z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Create the perfect resume</span>
                    <span className="block text-blue-600">tailored to each job</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Let AI help you customize your resume for each job application. Increase your chances of getting hired by matching your skills to job requirements.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/auth"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>

            {/* Right Content - Template Slideshow */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-white">
              <div className="w-full h-full px-4 py-8">
                <TemplateSlideshow />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to land your dream job
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    name: 'AI-Powered Matching',
    description: 'Our advanced AI analyzes job descriptions and matches them with your skills and experience.',
    icon: '🎯'
  },
  {
    name: 'Custom Resume Generation',
    description: 'Generate tailored resumes that highlight your most relevant experiences for each job.',
    icon: '📄'
  },
  {
    name: 'Skills Assessment',
    description: 'Get insights into which of your skills match the job requirements and what you might need to develop.',
    icon: '📊'
  },
  {
    name: 'Easy Profile Management',
    description: 'Maintain and update your professional profile in one place, ready to generate targeted resumes.',
    icon: '👤'
  }
];

export default LandingPage; 