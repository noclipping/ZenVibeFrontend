import '../LandingPage.css';
import logo from '../assets/zenvibe.png';
import { useNavigate } from 'react-router-dom';
import dashboardImage from '../assets/dashboard.png'; //

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/auth');
  };

  return (
    <div className="landing-container">
      <Navbar />
      <main className="hero-section">
        <div className="logo-container">
        </div>
        <div className="image-container">
          <h1>Welcome to ZenVibe</h1>
          <img src={dashboardImage} alt="Dashboard" className="dashboard-img" />
          <button onClick={handleGetStartedClick} className="get-started-btn">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}

// Add this within your LandingPage.jsx
function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <h1>ZenVibe</h1>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#docs">Docs</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#reviews">Reviews</a></li>
      </ul>
      <button className="zen-vibe-btn">Zen Vibe+</button>
    </nav>
  );
}

export default LandingPage;
