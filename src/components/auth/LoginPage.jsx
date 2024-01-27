import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../assets/zenvibe.png"; // Update the path as necessary
import "../auth/auth.css"; // Update the path as necessary

function LoginPage() {
  const navigate = useNavigate();

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [showLogoScreen, setShowLogoScreen] = useState(false); // New state for showing logo screen

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      setError("");
      setShowLogoScreen(true); // Show logo screen on successful login

      setTimeout(() => {
        navigate(`/protected/${data.id}`); // Navigate after the logo screen
      }, 6089); // Adjust the timeout duration as needed //6090
    } catch (err) {
      setError(err.message);
    }
  };

  if (showLogoScreen) {
    return (
      <div className="logo-screen-container">
        <img src={logo} alt="ZenVibe Logo" className="logo-animation" />
        <h2 className="welcome-message">Welcome back!</h2>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {error && <p className="error">{error}</p>}


            {/* Login Form */}
            <form className="auth-form" onSubmit={handleLogin}>
                <h1>Please Login to access your account!</h1>
                <img src={logo} alt="ZenVibe Logo" className="auth-logo" />
                <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <div className="button-container">
                    <button type="submit">Login</button>
                </div>
                <p>Dont have an account? <Link to="/register">Sign up</Link></p>
            </form>

      {/* Login Form */}
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Your Zen Vibe experience Awaits</h1>
        <img src={logo} alt="ZenVibe Logo" className="auth-logo" />
        <input
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="button-container">
          <button type="submit">Login</button>
        </div>
        <p>
          Dont have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;