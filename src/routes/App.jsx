import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../components/landingPage/LandingPage";
import AuthPage from "../components/auth/AuthPage";
import ProtectedPage from "../components/dashboard/ProtectedPage";
import WeightGoal from "../../src/pages/WeightGoal"; 
import MoodTracker from '../pages/MoodTracker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/protected" element={<ProtectedPage />} />
        <Route path="/weight-goal" element={<WeightGoal />} />
        <Route path="/mood" element={<MoodTracker />} /> 
      </Routes>
    </Router>
  );
}

export default App;
