import { useState, useEffect } from 'react';

const templates = [
  {
    id: 1,
    name: 'ATS-Optimized Resumes',
    image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Resumes optimized for Applicant Tracking Systems to ensure your application gets noticed'
  },
  {
    id: 2,
    name: 'AI-Powered Keyword Matching',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Smart keyword analysis and optimization based on job descriptions'
  },
  {
    id: 3,
    name: 'Job-Specific Customization',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Tailored resumes that highlight relevant skills and experiences for each position'
  },
  {
    id: 4,
    name: 'Professional Formatting',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Clean, professional layouts that pass ATS screening while maintaining visual appeal'
  }
];

const TemplateSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length);
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + templates.length) % templates.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative rounded-lg shadow-2xl overflow-hidden">
          <div className={`relative transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {imageError ? (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Image failed to load</p>
              </div>
            ) : (
              <img
                src={templates[currentIndex].image}
                alt={templates[currentIndex].name}
                className="w-full h-[500px] object-cover"
                onError={handleImageError}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
              <div className="text-center text-white p-8 w-full">
                <h3 className="text-3xl font-bold mb-2">{templates[currentIndex].name}</h3>
                <p className="text-lg">{templates[currentIndex].description}</p>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {templates.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 500);
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSlideshow; 