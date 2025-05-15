import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">ResumeAI</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/job-match" className="text-gray-600 hover:text-gray-900">Job Match</Link>
            <Link to="/resume" className="text-gray-600 hover:text-gray-900">Resume</Link>
            <Link to="/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
            <Link to="/auth" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 