import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ProfileCreation from './components/ProfileCreation';
import ResumeGeneration from './components/ResumeGeneration';
import ProfileSettings from './components/ProfileSettings';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile/create" element={<ProfileCreation />} />
          <Route path="/resume" element={<ResumeGeneration />} />
          <Route path="/settings" element={<ProfileSettings />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;