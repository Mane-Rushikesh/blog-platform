import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <Routes>

            {/* HOME */}
            <Route
                path="/"
                element={<Home />}
            />

            {/* AUTH */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* CREATE POST */}
            <Route
                path="/create-post"
                element={
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                }
            />

            {/* POST DETAILS */}
            <Route
                path="/posts/:id"
                element={<PostDetails />}
            />

            {/* INVALID URL */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
};

export default App;