import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserPlus,
    User,
    Mail,
    Lock
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await register(formData);

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true
                });
            }, 1500);

        } catch (error) {
            console.error("Register Error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-container">

            <div className="auth-card">

                <div className="auth-icon">
                    <UserPlus size={28} />
                </div>

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Join BlogPlatform and start writing
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label htmlFor="name">
                        Full Name
                    </label>

                    <div className="input-wrapper">
                        <User size={18} />

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <label htmlFor="email">
                        Email
                    </label>

                    <div className="input-wrapper">
                        <Mail size={18} />

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <label htmlFor="password">
                        Password
                    </label>

                    <div className="input-wrapper">
                        <Lock size={18} />

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength="6"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}

                    <Link to="/login">
                        Login here
                    </Link>
                </p>

            </div>

        </main>
    );
};

export default Register;