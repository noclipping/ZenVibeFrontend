// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../components/landingPage/LandingPage";
import ProtectedPage from "../components/dashboard/ProtectedPage";
import WeightGoal from "../../src/pages/WeightGoal";
import FoodPage from "../pages/FoodPage";
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";
import ReminderTracker from "../components/FeaturePage/ReminderFeature/ReminderTrack";
import ActivityReport from "../components/FeaturePage/ActivityFeature/ActivityReport"
import MoodTracker from "../pages/MoodTracker";
import ZenAI from "../pages/ZenAI";







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
        <Route path="/protected/:id" element={<ProtectedPage />} />

        {/* Additional Features: Other pages like WeightGoal and MoodTracker */}
        <Route path="/weight-goal/:id" element={<WeightGoal />} />
        <Route path="/food/:id" element={<FoodPage />} />
        <Route path="/reminders/:id" element={<ReminderTracker />} />
        <Route path="/mood/:id" element={<MoodTracker />} />
        <Route path="/activity/:id" element={<ActivityReport/>} />
        <Route path="/chat/:id" element={<ZenAI/>} />


      </Routes>
    </Router>
  );
}

export default App;
