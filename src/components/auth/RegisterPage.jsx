import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/zenvibe.png'; // Update the path as necessary
import '../auth/auth.css'; // Update the path as necessary

function RegisterPage() {
    const navigate = useNavigate();

    // Register state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [email, setEmail] = useState('');
    const [originalWeight, setOriginalWeight] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [age, setAge] = useState('');
    const [goalWeight, setGoalWeight] = useState('');

    // Error handling
    const [error, setError] = useState('');

    // Handle registration
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Necessary to include cookies
                body: JSON.stringify({
                    username: registerUsername,
                    password_hash: registerPassword,
                    email: email,
                    original_weight: parseFloat(originalWeight),
                    feet: parseInt(feet),
                    inches: parseInt(inches),
                    age: parseInt(age),
                    goal_weight: parseFloat(goalWeight),
                }),
            });

            if (!response.ok) {
                throw new Error(`Registration failed: ${response.statusText}`);
            }

            setError(''); // Clear any previous errors
            navigate('/protected/:id'); // Navigate to the protected route after registration
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            {error && <p className="error">{error}</p>}

            {/* Registration Form */}
            <form className="auth-form" onSubmit={handleSignUp}>
                <h1>ZenVibe Register</h1>
                <img src={logo} alt="ZenVibe Logo" className="auth-logo" />

                <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="number"
                    value={originalWeight}
                    onChange={(e) => setOriginalWeight(e.target.value)}
                    placeholder="Original Weight"
                    required
                />
                <input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="Feet"
                    required
                />
                <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    placeholder="Inches"
                    required
                />
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    required
                />
                <input
                    type="number"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder="Goal Weight"
                    required
                />
                <div className="button-container">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
