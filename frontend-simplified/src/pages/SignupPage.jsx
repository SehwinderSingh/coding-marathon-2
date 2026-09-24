import { useState } from 'react';
const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    };

    return (
        <div className='signup'>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <label>Confirm Password:</label>
                <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label>Phone Number:</label>
                <input
                    type='text'
                    value={PhoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label>Date of Birth:</label>
                <input
                    type='date'
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <label>Address:</label>
                <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                {error && <p>{error}</p>}
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;