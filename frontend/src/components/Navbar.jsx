import { Link, useNavigate } from "react-router-dom";
import {
    LogOut,
    PenLine,
    User,
    BookOpen
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/" className="logo">
                    <BookOpen size={24} />
                    <span>BlogPlatform</span>
                </Link>

                <div className="nav-right">

                    {user ? (
                        <>
                            <div className="user-info">
                                <User size={17} />
                                <span>{user.name}</span>
                            </div>

                            <Link
                                to="/create-post"
                                className="create-btn"
                            >
                                <PenLine size={17} />
                                <span>Create Post</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                <LogOut size={17} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nav-login"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="nav-register"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;