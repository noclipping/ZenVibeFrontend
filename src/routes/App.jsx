// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../components/landingPage/LandingPage";
import AuthPage from "../components/auth/AuthPage";
import ProtectedPage from "../components/dashboard/ProtectedPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/protected" element={<ProtectedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
