import { useState } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        setError("");
        setSuccess("Login Successful");

        const loginUser = {
            email,
            password,
        };

        console.log("Login data:", loginUser);
    };

    return (
        <section className="bg-indigo-50">
            <div className="container m-auto max-w-2xl py-10">
                <div className="bg-white px-6 py-8 shadow-md rounded-md">
                    <h2 className="text-3xl text-center font-semibold mb-6">
                        Login
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block font-bold mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                className="border rounded w-full py-2 px-3"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 mb-4">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;