import "./LandingPage.css";
import Spline from '@splinetool/react-spline';
import Navbar from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";
import dashboardImage from "../../../assets/Zen_land.png";

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
          <div>
Mood Tracker
Understand your mood patterns and work towards emotional balance.


            <p>
              ZenVibe is an innovative health and wellness tracker, meticulously
              crafted to guide and support individuals on their journey to a
              healthier lifestyle. At its core, ZenVibe is more than just an
              application; it&apos;s a dedicated companion in the pursuit of
              balance and wellness. Designed with a keen focus on simplicity and
              user-friendliness, this state-of-the-art tool seamlessly
              integrates into daily life, ensuring that maintaining health and
              wellness is not just achievable, but also enjoyable. Whether you
              are a beginner embarking on the path of self-improvement or a
              seasoned enthusiast seeking to optimize your routines, ZenVibe
              adapts to your individual needs, offering personalized insights
              and recommendations. Its intuitive interface and comprehensive
              features make tracking your progress effortless, turning the often
              daunting task of health management into an engaging and rewarding
              experience. By choosing ZenVibe, you&apos;re not just selecting a
              SaaS application; you&apos;re embracing a holistic approach to
              health that&apos;s rooted in the latest technology and designed to
              foster sustainable, long-term wellbeing.
            </p>
          </div>
        </p>
        <Spline scene="https://prod.spline.design/R47T9roV3JNYA-0b/scene.splinecode" />
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

      {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <h2 className="section-title">User Reviews</h2>
        <div className="reviews-container"></div>
        <div className="review-card">
          <p>
            &quot;ZenVibe has been a game-changer in my wellness journey. Highly
            recommend!&quot;
          </p>
        </div>
        <div className="review-card">
          <p>
            &quot;I love the simplicity and effectiveness of ZenVibe. Its a
            must-have for anyone serious about health.&quot;e
          </p>
        </div>
        {/* Add more reviews as needed */}
      </section>
    </div>
  );
}

export default LandingPage;
