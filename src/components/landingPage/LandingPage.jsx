import "./LandingPage.css";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import dashboardImage from '../../../assets/dashboard.png'; //

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/auth");
  };

  return (
    <div className="landing-container">
      <Navbar />
      <main className="hero-section">
        <div className="logo-container"></div>
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

export default LandingPage;
