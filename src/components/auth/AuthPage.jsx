 // Corrected import statement
 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/zenvibe.png';
import '../auth/auth.css'

function AuthPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add your login logic here
        navigate('/protected'); // Navigate to the protected page after "login"
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        // Add your sign-up logic here
    };

    return (
        <div className="auth-container">       
            <form className="auth-form" onSubmit={handleLogin}>
            <h1>ZenVibe</h1>
            <img src={logo} alt="ZenVibe Logo" className="auth-logo" />
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username"
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    required 
                />
                 <div className="button-container">
                <button type="submit">Login</button>
                <button type="button" onClick={handleSignUp}>Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default AuthPage;
