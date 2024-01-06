// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../components/landingPage/LandingPage";
import ProtectedPage from "../components/dashboard/ProtectedPage";
import WeightGoal from "../../src/pages/WeightGoal";
import MoodTracker from "../../src/pages/MoodTracker";
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page: Users see this when they visit your site */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page: Users are directed here from the Landing Page to log in */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Page: Users can navigate here from the Login Page to register */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Page: Only accessible to logged-in users */}
        <Route path="/protected" element={<ProtectedPage />} />

        {/* Additional Features: Other pages like WeightGoal and MoodTracker */}
        <Route path="/weight-goal" element={<WeightGoal />} />
        <Route path="/mood" element={<MoodTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
