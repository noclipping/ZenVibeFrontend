import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../../assets/zenvibe.png'; // Update the path as necessary
import '../auth/auth.css'; // Update the path as necessary

function RegisterPage() {
    const navigate = useNavigate();

    // State variables for registration
    const [stage, setStage] = useState(1);
    const [showLogoScreen, setShowLogoScreen] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [email, setEmail] = useState('');
    const [originalWeight, setOriginalWeight] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [age, setAge] = useState('');
    const [goalWeight, setGoalWeight] = useState('');
    const [gender, setGender] = useState('Male');
    const [activityLevel, setActivityLevel] = useState('sedentary');
    const [error, setError] = useState('');

    // Handle submit for the first stage
    const handleFirstStageSubmit = (e) => {
        e.preventDefault();
        setStage(2); // Move to the second stage
    };

    // Handle submit for the second stage
    const handleSecondStageSubmit = (e) => {
        e.preventDefault();
        setStage(3); // Move to the third stage
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
                    email,
                    original_weight: parseFloat(originalWeight),
                    feet: parseInt(feet),
                    inches: parseInt(inches),
                    age: parseInt(age),
                    goal_weight: parseFloat(goalWeight),
                    gender,
                    activity_level: activityLevel,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setShowLogoScreen(true); // Show logo screen on successful registration

                setTimeout(() => {
                    navigate(`/protected/${data.id}`);
                }, 6090); // Adjust the timeout duration as needed
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (showLogoScreen) {
        return (
            <div className="logo-screen-container">
                <img src={logo} alt="ZenVibe Logo" className="logo-animation" />
                <h2 className="signup-message">Welcome To ZenVibe! Lets work towards your goals</h2>
            </div>
        );
    }


    return (
        <div className="auth-container">
            {error && <p className="error">{error}</p>}

            <form className="auth-form" onSubmit={stage === 1 ? handleFirstStageSubmit : (stage === 2 ? handleSecondStageSubmit : handleFinalSubmit)}>
                <h1>Become Part of Zen Vibe - Your Gateway to Healthier Living</h1>
                <img src={logo} alt="ZenVibe Logo" className="auth-logo" />

                {stage === 1 && (
                    <>
                        <input type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} placeholder="Username" required />
                        <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" required />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                        <button type="submit">Next</button>
                        <p>I have an account! <Link to="/login">Login</Link></p>
                    </>
                )}

                {stage === 2 && (
                    <>
                        <input type="number" value={originalWeight} onChange={(e) => setOriginalWeight(e.target.value)} placeholder="Original Weight" required />
                        <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="Feet" required />
                        <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} placeholder="Inches" required />
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required />
                        <input type="number" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} placeholder="Goal Weight" required />
                        <button type="submit">Next</button>
                    </>
                )}

                {stage === 3 && (
                    <>
                        <label>
                            Gender:
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>

                        <label>
                            Activity Level:
                            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                                <option value="sedentary">Sedentary</option>
                                <option value="lightlyActive">Lightly Active</option>
                                <option value="moderatelyActive">Moderately Active</option>
                                <option value="veryActive">Very Active</option>
                                <option value="extremelyActive">Extremely Active</option>
                            </select>
                        </label>

                        <button type="submit">Sign Up</button>
                    </>
                )}
            </form>
        </div>
    );
}

export default RegisterPage;
