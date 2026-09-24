import { useState } from 'react';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    return (
        <div className='Login'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>

                <label>Email:</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password:</label>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p>{error}</p>}
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    );
};

export default LoginPage;