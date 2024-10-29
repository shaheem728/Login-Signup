import React, { useState } from 'react';
import { signup } from '../api/auth'; // Make sure the path is correct
import { useNavigate } from 'react-router-dom'; // Import for navigation

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signup(username, password);
            console.log('Signup successful!');
            navigate('/login'); // Redirect to login after signup
        } catch (err) {
            setError(err.error);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Signup</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default Signup;
