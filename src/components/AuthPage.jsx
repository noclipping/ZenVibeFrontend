import { useNavigate } from 'react-router-dom';

function AuthPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Simulate authentication
        navigate('/protected'); // Navigate to the protected page after "login"
    };

    return (
        <div>
            <h1>Login / Sign Up</h1>
            <button onClick={handleLogin}>Login / Sign Up</button>
        </div>
    );
}

export default AuthPage;
