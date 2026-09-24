import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const newUser = {
      name,
      email,
      password,
      phone_number: phoneNumber,
      gender,
      date_of_birth: dateOfBirth,
      address: {
        street,
        city,
        zipCode,
      },
    };

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Signup failed");
      } else {
        // Save user & token to local storage
        localStorage.setItem("user", JSON.stringify(json));

        // Update global context
        dispatch({ type: "LOGIN", payload: json });

        // Redirect user to home
        navigate("/");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-10">
        <div className="bg-white px-6 py-8 shadow-md rounded-md">
          <h2 className="text-3xl text-center font-semibold mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-bold mb-2">Name</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Email</label>
              <input
                type="email"
                className="border rounded w-full py-2 px-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Password</label>
              <input
                type="password"
                className="border rounded w-full py-2 px-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                className="border rounded w-full py-2 px-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Phone Number</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Gender</label>
              <select
                className="border rounded w-full py-2 px-3"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Date of Birth</label>
              <input
                type="date"
                className="border rounded w-full py-2 px-3"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Street</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">City</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Zip Code</label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;