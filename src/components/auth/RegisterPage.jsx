import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../../assets/zenvibe.png'; // Update the path as necessary
import '../auth/auth.css'; // Update the path as necessary

function RegisterPage() {
    const navigate = useNavigate();

    // State for registration
    const [stage, setStage] = useState(1); // Control the stage of the registration form
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [email, setEmail] = useState('');
    const [originalWeight, setOriginalWeight] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [age, setAge] = useState('');
    const [goalWeight, setGoalWeight] = useState('');
    const [error, setError] = useState('');

    // Handle first stage submit
    const handleFirstStageSubmit = (e) => {
        e.preventDefault();
        setStage(2); // Move to the second stage
    };

    // Handle final registration submit
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
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

            const data = await response.json();
            navigate(`/protected/${data.id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            {error && <p className="error">{error}</p>}
            
            <form className="auth-form" onSubmit={stage === 1 ? handleFirstStageSubmit : handleFinalSubmit}>
                <img src={logo} alt="ZenVibe Logo" className="auth-logo" />
                {stage === 1 ? (
                    <>
                        <input type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Username" required />
                        <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" required />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                        <button type="submit">Next</button>
                        <p>I have an account!<Link to="/login"> Login</Link></p>
                    </>
                ) : (
                    <>
                        <input type="number" value={originalWeight} onChange={(e) => setOriginalWeight(e.target.value)} placeholder="Original Weight" required />
                        <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="Feet" required />
                        <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} placeholder="Inches" required />
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required />
                        <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} placeholder="Goal Weight" required />
                        <button type="submit">Sign Up</button>
                    </>
                )}
            </form>
        </div>
    );
}

export default RegisterPage;
