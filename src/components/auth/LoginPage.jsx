import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../../assets/zenvibe.png'; // Update the path as necessary
import '../auth/auth.css'; // Update the path as necessary

function LoginPage() {
    const navigate = useNavigate();

    // Login state
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Error handling
    const [error, setError] = useState('');

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Necessary to include cookies
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword,
                }),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.statusText}`);
            }

            const data = await response.json(); // Get the response data
            setError(''); // Clear any previous errors
            navigate(`/protected/${data.id}`); // Navigate to the protected route with the user ID
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            {error && <p className="error">{error}</p>}

            {/* Login Form */}
            <form className="auth-form" onSubmit={handleLogin}>
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
        </div>
    );
}

export default LoginPage;
