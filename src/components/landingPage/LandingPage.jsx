import "./LandingPage.css";
import Navbar from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";
import dashboardImage from "../../../assets/dashboard.png";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <Navbar />
      <main className="hero-section" id="hero">
        <div className="image-container">
          <h1>Welcome to ZenVibe</h1>
          <img src={dashboardImage} alt="Dashboard" className="dashboard-img" />
          <button onClick={handleGetStartedClick} className="get-started-btn">
            Get Started
          </button>
        </div>
      </main>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2 className="section-title">About ZenVibe</h2>
        <p className="section-content">
          ZenVibe is a health and wellness tracker designed to help you embark
          on a journey towards a healthier lifestyle. With a focus on simplicity
          and user-friendliness, ZenVibe aims to be your companion in achieving
          balance and wellness.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Features</h2>
        <ul className="feature-list">
          <li className="feature-item">
            <h3>Track Your Progress</h3>
            <p>
              Monitor your health and wellness journey with detailed charts and
              logs.
            </p>
          </li>
          <li className="feature-item">
            <h3>Set and Achieve Goals</h3>
            <p>
              Set your wellness goals and track your progress towards achieving
              them.
            </p>
          </li>
          <li className="feature-item">
            <h3>Mood Tracker</h3>
            <p>
              Understand your mood patterns and work towards emotional balance.
            </p>
          </li>
          {/* Add more features as needed */}
        </ul>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <h2 className="section-title">Contact Us</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <h2 className="section-title">User Reviews</h2>
        <div className="review-card">
          <p>
            &quot;ZenVibe has been a game-changer in my wellness journey. Highly
            recommend!&quot;
          </p>
        </div>
        <div className="review-card">
          <p>
            &quot;I love the simplicity and effectiveness of ZenVibe. Its a
            must-have for anyone serious about health.&quot;
          </p>
        </div>
        {/* Add more reviews as needed */}
      </section>
    </div>
  );
}

export default LandingPage;
